// We import modules.
const url = require("url");
const path = require("path");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const config = require("../config");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const GuildSettings = require("../models/settings");
const PremiumKey = require("../models/premium-key");
const twitterSettings = require("../models/twitter");
const darknetSettings = require("../models/darknet");
const economySettings = require("../models/economy");
const logsSettings = require("../models/logs");
const robbery = require("../models/robbery");
const lspdSettings = require("../models/lspd");
const emsSettings = require("../models/ems");
const witheningSettings = require("../models/withening-settings");
const userBank = require("../models/user-bank");
const accountData = require("../models/accounts");
const staffData = require("../models/staffData");
const paypal = require('paypal-rest-sdk');
const ms = require('ms')
//https://riptutorial.com/paypal/example/1485/node-express-server-example


const validUrl = require('valid-url');

paypal.configure({
  'mode': 'live', //sandbox or live
  'client_id': config.config_id,
  'client_secret': config.config_secret
});

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );


// We instantiate express app and the session store.
const app = express();
const MemoryStore = require("memorystore")(session);

// We export the dashboard as a function which we call in ready event.
module.exports = async (client) => {
  // We declare absolute paths.
  const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`); // The absolute path of current this directory.
  const templateDir = path.resolve(`${dataDir}${path.sep}templates`); // Absolute path of ./templates directory.

  // Deserializing and serializing users without any additional logic.
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  // We set the passport to use a new discord strategy, we pass in client id, secret, callback url and the scopes.
  /** Scopes:
   *  - Identify: Avatar's url, username and discriminator.
   *  - Guilds: A list of partial guilds.
  */
  passport.use(new Strategy({
    clientID: config.id,
    clientSecret: config.clientSecret,
    callbackURL: `${config.domain}${config.port == 80 ? "" : `:${config.port}`}/callback`,
    //`${config.domain}${config.port == 80 ? "" : `:${config.port}`}/callback`
    scope: ["identify", "guilds", "email"]
  },
  (accessToken, refreshToken, profile, done) => { // eslint-disable-line no-unused-vars
    // On login we pass in profile with no logic.
    process.nextTick(() => done(null, profile));
  }));

  // We initialize the memorystore middleware with our express app.
  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
    resave: false,
    saveUninitialized: false,
  }));

  // We initialize passport middleware.
  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/public", express.static(path.resolve(`${dataDir}${path.sep}public`)));
  app.use("/js", express.static(path.resolve(`${dataDir}${path.sep}js`)));
/*  app.use(function(req, res, next) {
  res.setHeader("content-security-policy-report-only", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'report-sample' 'self' https://cdnjs.cloudflare.com/ajax/libs/parallax/3.1.0/parallax.min.js https://client.crisp.chat/l.js https://use.fontawesome.com/releases/v5.3.1/js/all.js;style-src 'report-sample' 'self' https://cdn.jsdelivr.net https://client.crisp.chat; object-src 'none'; base-uri 'self'; connect-src 'self' https://client.crisp.chat wss://client.relay.crisp.chat; font-src 'self' https://client.crisp.chat; frame-src 'self'; img-src 'self' data: https://cdn.discordapp.com https://client.crisp.chat https://image.crisp.chat; manifest-src 'self'; media-src 'self'; report-uri https://5f8c59c307c95d03bf76d3f3.endpoint.csper.io/; worker-src 'none';")
  next();
});*/

  // We bind the domain.
  app.locals.domain = config.domain.split("//")[1];

  // We set out templating engine.
  app.engine("html", ejs.renderFile);
  app.set("view engine", "html");

  // We initialize body-parser middleware to be able to read forms.
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // We declare a renderTemplate function to make rendering of a template in a route as easy as possible.
  const renderTemplate = async (res, req, template, data = {}) => {
    // Default base data which passed to the ejs template by default. 

    let userStaff = req.isAuthenticated() ? req.user : false


    let isStaff = false;
    let isSupport = false;
    let isBilling = false;
    let isAdmin = false;

    if(userStaff) {
      let staffdata = await staffData.findOne({ user_id: userStaff.id })

      
        if(staffdata) {
          if(staffdata.support === "true") {
            isSupport = true
          }
          if(staffdata.billing === "true") {
            isBilling = true
          }
          if(staffdata.admin === "true") {
            isAdmin = true
          }
          if(staffdata.staff === "true") {
            isStaff = true
          }
        }
    }
    const baseData = {
      bot: client,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null,
      support: isSupport,
      billing: isBilling,
      admin: isAdmin,
      staff: isStaff
    };
    // We render template using the absolute path of the template and the merged default data with the additional data provided.
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
  };

  // We declare a checkAuth function middleware to check if an user is logged in or not, and if not redirect him.
  const checkAuth = (req, res, next) => {
    // If authenticated we forward the request further in the route.
    if (req.isAuthenticated()) return next();
    // If not authenticated, we set the url the user is redirected to into the memory.
    req.session.backURL = req.url;
    // We redirect user to login endpoint/route.
    res.redirect("/login");
  }

  // Login endpoint.
  app.get("/login", (req, res, next) => {
    // We determine the returning url.
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL; // eslint-disable-line no-self-assign
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
    }
    // Forward the request to the passport middleware.
    next();
  },
  passport.authenticate("discord"));

  // Callback endpoint.
  app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), /* We authenticate the user, if user canceled we redirect him to index. */ (req, res) => {
    // If user had set a returning url, we redirect him there, otherwise we redirect him to index.
    if (req.session.backURL) {
      const url = req.session.backURL;
      req.session.backURL = null;
      res.redirect(url);
    } else {
      res.redirect("/");
    }
  });

  // Logout endpoint.
  app.get("/logout", function (req, res) {
    // We destroy the session.
    req.session.destroy(() => {
      // We logout the user.
      req.logout();
      // We redirect user to index.
      res.redirect("/");
    });
  });

  // Index endpoint.
  app.get("/", async (req, res) => {
    const reducer = (acc, guildCount) => acc + guildCount;
    const results = await client.shard.fetchClientValues('guilds.cache.size');
    
    let guildCounter  = results.reduce(reducer, 0)
    let guildCount = n(guildCounter)

    let totalMembers = await client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)');

    totalMembers = totalMembers.reduce((acc, memberCount) => acc + memberCount, 0);
    totalMembers = n(totalMembers);

    function n(x) {
      if(!x) return "Erreur"
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
  }

    renderTemplate(res, req, "index.ejs", { guildCount, totalMembers });
  });


  app.get('/redirection-paypal', checkAuth, function(req, res){
    //build PayPal payment request
    var payReq = JSON.stringify({
        'intent':'sale',
        'redirect_urls':{
            'return_url':'https://lester-bot.fr/process',
            'cancel_url':'https://lester-bot.fr/'
        },
        'payer':{
            'payment_method':'paypal'
        },
        'transactions':[{
            'amount':{
                'total':'4.99',
                'currency':'EUR'
            },
            'description':'Achat d\'une clé pour Lester premium.'
        }]
    });

    paypal.payment.create(payReq, function(error, payment){
        if(error){
          console.log("err1")
            console.error(error);
        } else {
            //capture HATEOAS links
            var links = {};
            payment.links.forEach(function(linkObj){
                links[linkObj.rel] = {
                    'href': linkObj.href,
                    'method': linkObj.method
                };
            })
        
            //if redirect url present, redirect user
            if (links.hasOwnProperty('approval_url')){
                res.redirect(links['approval_url'].href);
            } else {
                console.error('no redirect URI present');
            }
        }
    });
});
const talkedRecently = new Set();

app.get('/process', checkAuth, async (req, res) => {
  var paymentId = req.query.paymentId;
  var payerId = { 'payer_id': req.query.PayerID };

  paypal.payment.execute(paymentId, payerId, async function(error, payment){
      if(error){
        renderTemplate(res, req, "premium_codes/error.ejs");
        console.error(error);
      } else {
          if (payment.state == 'approved'){ 
            if (talkedRecently.has(req.user.id)) return renderTemplate(res, req, "premium_codes/error.ejs");
              

            talkedRecently.add(req.user.id);
            setTimeout(() => {
              talkedRecently.delete(req.user.id);
            }, 100000);


            function makeid(length) {
              var result           = '';
              var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
              var charactersLength = characters.length;
              for ( var i = 0; i < length; i++ ) {
                 result += characters.charAt(Math.floor(Math.random() * charactersLength));
              }
              return result;
            }
          
            let key1 = makeid(4);
            let key2 = makeid(4);
            let key3 = makeid(4);
            let key4 = makeid(4);
          
            const theKey = `${key1}-${key2}-${key3}-${key4}`
          
             const keyVar = new PremiumKey({
              key: theKey,
              user: req.user.id
            });
             await keyVar.save().catch(()=>{});
             renderTemplate(res, req, "premium_codes/success.ejs");

                    } else {
                      renderTemplate(res, req, "premium_codes/error.ejs");
              }
      }
  });
});


  app.get("/panel-staff", checkAuth, async (req, res) => {
 
    let userStaff = req.isAuthenticated() ? req.user : false
    let isStaff = false;
    let isSupport = false;
    let isBilling = false;
    let isAdmin = false;
    if(userStaff) {
      let staffdata = await staffData.findOne({ user_id: userStaff.id })
        if(staffdata) {

          if(staffdata.staff === "true") {
            isStaff = true
          }
          if(staffdata.billing === "true") {
            isBilling = true
          }
          if(staffdata.admin === "true") {
            isAdmin = true
          }
        }
    }
    if (!isStaff) return res.redirect("/dashboard");


    const reducer = (acc, guildCount) => acc + guildCount;
    const results = await client.shard.fetchClientValues('guilds.cache.size');

    let totalMembers = await client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)');

    totalMembers = totalMembers.reduce((acc, memberCount) => acc + memberCount, 0);
    totalMembers = n(totalMembers);
    
    let guildCounter  = results.reduce(reducer, 0);
    let guildCount = n(guildCounter);

    function n(x) {
      if(!x) return "Erreur"
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }


    let serverPremiumCount = await GuildSettings.find({ premium: "yes" })
    serverPremiumCount = serverPremiumCount.length

    renderTemplate(res, req, "panel-staff.ejs", { guildCount, totalMembers, serverPremiumCount, isBilling });
  });

  
  app.get("/panel-staff/serveur", checkAuth, async (req, res) => {
 
    let userStaff = req.isAuthenticated() ? req.user : false
    let isStaff = false;
    if(userStaff) {
      let staffdata = await staffData.findOne({ user_id: userStaff.id })
        if(staffdata) {
          if(staffdata.staff === "true") {
            isStaff = true
          }
        }
    }
    if (!isStaff) return res.redirect("/dashboard");
 let guildIcon = null;
    let guildOwner = null;
    let guildCount = null;
    let guildName = null;
    let guildId = null;
    let guildShard = null;
    let guildStatus = false;
    let guildPremium = null

    

    renderTemplate(res, req, "panel-staff/server.ejs", { 
      alert: null,
      guildStatus,
      guildId,
      guildOwner,
      guildCount,
      guildName,
      guildShard,
      guildIcon,
      guildPremium
    });
  });

  
  app.post("/panel-staff/serveur", checkAuth, async (req, res) => {
    let alert = null
    let userStaff = req.isAuthenticated() ? req.user : false
    let isStaff = false;
    if(userStaff) {
      let staffdata = await staffData.findOne({ user_id: userStaff.id })
        if(staffdata) {
          if(staffdata.staff === "true") {
            isStaff = true
          }
        }
    }
    if (!isStaff) return res.redirect("/dashboard");

    let guildIcon = null;
    let guildOwner = null;
    let guildCount = null;
    let guildName = null;
    let guildId = null;
    let guildShard = null;
    let guildStatus = false;
    let guildPremium = null

    if(req.body.server) {
      
        guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${req.body.server}')`)).filter(Boolean);
        if(guild[0]) {
          guildIcon = guild[0].iconURL;
          guildOwner = await client.users.fetch(`${guild[0].ownerID}`);
          guildOwner = `${guildOwner.tag} (${guildOwner.id})`
          guildCount = guild[0].memberCount
          guildName = guild[0].name;
          guildId = guild[0].id;
          guildShard = guild[0].shardID;
          guildStatus = true;

          var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
          
          if(storedSettings.premium === "yes") {
            guildPremium = "Oui"
          } else {
            guildPremium = "Non"
          }

        } else {
          alert = "Ce serveur est introuvable."
        }
      } else {
      alert = "Veuillez rentrer l'ID d'un serveur."

      }

    renderTemplate(res, req, "panel-staff/server.ejs", { 
      alert,
      guildStatus,
      guildId,
      guildOwner,
      guildCount,
      guildName,
      guildShard,
      guildIcon,
      guildPremium
     });
  });


  app.get("/panel-staff/transfert-serveur-premium", checkAuth, async (req, res) => {

    let userStaff = req.isAuthenticated() ? req.user : false
    let isStaff = false;
    let isBilling = false;
    let isAdmin = false;
    let alertErr = null;
    let alertSuccess = null;
    if(userStaff) {
      let staffdata = await staffData.findOne({ user_id: userStaff.id })
        if(staffdata) {

          if(staffdata.staff === "true") {
            isStaff = true
          }
          if(staffdata.billing === "true") {
            isBilling = true
          }
          if(staffdata.admin === "true") {
            isAdmin = true
          }
        }
    }
    if (!isBilling) return res.redirect("/dashboard");

    renderTemplate(res, req, "panel-staff/transfert.ejs", { alertErr, alertSuccess });
  });

  app.post("/panel-staff/transfert-serveur-premium", checkAuth, async (req, res) => {

    let userStaff = req.isAuthenticated() ? req.user : false
    let isStaff = false;
    let isBilling = false;
    let isAdmin = false;
    let alertErr = null;
    let alertSuccess = null; 
    if(userStaff) {
      let staffdata = await staffData.findOne({ user_id: userStaff.id })
        if(staffdata) {

          if(staffdata.staff === "true") {
            isStaff = true
          }
          if(staffdata.billing === "true") {
            isBilling = true
          }
          if(staffdata.admin === "true") {
            isAdmin = true
          }
        }
    }
    if (!isBilling) return res.redirect("/dashboard");

    let guild = req.body.server_transfert;

      if(guild) {
      let premCheck = await GuildSettings.findOne({ gid: guild })

        if(premCheck){
          if(premCheck.premium === "yes") {
            premCheck.premium = "no";
            await premCheck.save();
            alertSuccess = "Le premium du serveur a été désactivé avec succès.";
          } else {
            alertErr = "Ce serveur n'a pas le premium d'activé. [2]";
          }
        } else {
          alertErr = "Ce serveur n'a pas le premium d'activé. [1]";
        }

      } else {
        alertErr = "Serveur introuvable.";
      }




    renderTemplate(res, req, "panel-staff/transfert.ejs", { alertErr, alertSuccess });
  });



  
  app.get("/panel-staff/membre", checkAuth, async (req, res) => {
 
    let userStaff = req.isAuthenticated() ? req.user : false
    let isStaff = false;
    if(userStaff) {
      let staffdata = await staffData.findOne({ user_id: userStaff.id })
        if(staffdata) {
          if(staffdata.staff === "true") {
            isStaff = true
          }
        }
    }
    if (!isStaff) return res.redirect("/dashboard");
    let userFinding = false;

    renderTemplate(res, req, "panel-staff/member.ejs", { 
      alert: null,
      userFinding
    });
  });

    
  app.post("/panel-staff/membre", checkAuth, async (req, res) => {
    let alert = null;
    let userStaff = req.isAuthenticated() ? req.user : false
    let isStaff = false;
    if(userStaff) {
      let staffdata = await staffData.findOne({ user_id: userStaff.id })
        if(staffdata) {
          if(staffdata.staff === "true") {
            isStaff = true
          }
        }
    }
    if (!isStaff) return res.redirect("/dashboard");

    let userFinding = false;

    if(req.body.userSearch) {
      if(!isNaN(req.body.userSearch)) {
        try {
        userFinding = await client.users.fetch(`${req.body.userSearch}`);
        } catch {
          alert = "Cet utilisateur est introuvable."
          userFinding = false;
        }
        if(!userFinding) {
          alert = "Cet utilisateur est introuvable."
          userFinding = false;
        } 
      }else {
        alert = "Cet utilisateur est introuvable."
      }
    } else {
      alert = "Cet utilisateur est introuvable."
    }

    renderTemplate(res, req, "panel-staff/member.ejs", { 
      alert,
      userFinding,
    });
  });


  
  app.get("/arc-sw.js", (req, res) => {

    renderTemplate(res, req, "arc-sw.js");
  });





  app.get("/:guildID/leaderboard", checkAuth, async (req, res) => {
    require('events').EventEmitter.defaultMaxListeners = 500;
    var theGuild = req.params.guildID;
    var user = req.user;

    let guildP = await user.guilds.find(x => x.id === theGuild)
    if (!guildP) return res.redirect("/dashboard");

    const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
    if (!guild) return res.redirect("/dashboard");


         
    var bankLeaderboard = await userBank.find({ gid: guild[0].id });

    const items = (await Promise.all(
      bankLeaderboard.map(async (account) => {
        
        let [owner] = (await client.shard.broadcastEval(`this.users.cache.get('${account.user_id}')`)).filter(Boolean);
        if(!owner) return;
        
        return {
          name: owner.username,
          tag: owner.discriminator,
          banque: account.banque,
          liquide: account.liquide,
          sale: account.sale,
          avatar: owner.displayAvatarURL,
          total: parseInt(account.banque) + parseInt(account.liquide) + parseInt(account.sale)
        }
      })
    )).filter(Boolean).flat()



          let leaderboardarray = items.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
          var size = 100;
          var leaderboard = leaderboardarray.slice(0, size).map(i => {
              return i
          });




      var allAccountsData = await accountData.find({ gid: guild[0].id });
      
    const accounts = (await Promise.all(
      allAccountsData.map(async (account) => {
        let ownerUsername = "Utilisateur Introuvable";
        let tag = "0000";
        let [owner] = (await client.shard.broadcastEval(`this.users.cache.get('${account.owner}')`)).filter(Boolean);
        if(owner) {
          ownerUsername = owner.username
          tag = owner.discriminator
        }
        
        return {
          name: account.name,
          ownerName: ownerUsername,
          ownerTag: tag,
          banque: account.banque,
        }
      })
    )).filter(Boolean).flat()


    let leaderboardarray2 = accounts.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
    var size = 15;
    var lb_account = leaderboardarray2.slice(0, size).map(i => {
        return i
    });



    renderTemplate(res, req, "leaderboard.ejs", { leaderboard, lb_account });
  });


  // Dashboard endpoint.
  app.get("/dashboard", checkAuth, async (req, res) => {

    let user = req.user

    require('events').EventEmitter.defaultMaxListeners = 500; 

    const guildList = (await Promise.all(
      user.guilds.map(async (guild) => {
        const guildPerms = new Discord.Permissions(guild.permissions);
        if (!guildPerms.has('MANAGE_GUILD')) return;
        
        const cachedGuilds = (await client.shard.broadcastEval(`this.guilds.cache.get('${guild.id}')`)).filter(Boolean);
        
        return cachedGuilds.map((g) => ({
          name: g.name,
          id: g.id,
          icon: g.icon,
        }));
      })
    )).filter(Boolean).flat()


    await renderTemplate(res, req, "dashboard.ejs", { guildList });
  });
  
  // Dashboard endpoint.
  app.get("/statut", async (req, res) => {
    let shardArray = await client.shard.broadcastEval(`this.ws.shards`);
    var shardList = [];
    let shardAvailable = 0;
    let shardUnavailable = 0;
        await shardArray.forEach(shardResult => {
            let [shard] = shardResult.flat()
            if(shard.status <= 1) {
              ++shardAvailable
            }
            shardList.push({
                id: shard.id,
                ping: shard.ping,
                status: shard.status,
              });
        });
        shardUnavailable = parseInt(client.shard.count) - parseInt(shardAvailable)
    await renderTemplate(res, req, "status.ejs", { shardList, shardAvailable, shardUnavailable });
  });
  /*app.get("/commandes", (req, res) => {
    renderTemplate(res, req, "commands.ejs", { perms: Discord.Permissions });
  });
    // Settings endpoint.
    app.get("/admin", checkAuth, async (req, res) => {
      renderTemplate(res, req, "admin.ejs", { perms: Discord.Permissions });      
    });*/

    app.get("/notre-equipe", async (req, res) => {
      var tseacen = await client.users.fetch('313768730700152833');
      var oblion = await client.users.fetch('559739212291768340');
      var fawkes = await client.users.fetch('571429270111649842');
      var skyder = await client.users.fetch('487885266795757569');
      var ander = await client.users.fetch('427222628848369667');
      var mikzii = await client.users.fetch('660999550911381515');
      var athe = await client.users.fetch('710087662127677442');
      var pepiflow = await client.users.fetch('655452705925365797');
      var dark = await client.users.fetch('538017773150797833');
      var victoria = await client.users.fetch('689418652176351253');


      await renderTemplate(res, req, "staff.ejs", {
        athe,
        mikzii,
        oblion,
        tseacen,
        fawkes,
        skyder,
        ander,
        pepiflow,
        dark,
        victoria
       });      
    });

    app.get("/premium", async (req, res) => {
      renderTemplate(res, req, "premium.ejs", { perms: Discord.Permissions });      
    });

    app.get("/mes-cles", checkAuth, async (req, res) => {
        
      var userKeys = await PremiumKey.find({ user: req.user.id });
      let items;

      if(userKeys) {
        items = (await Promise.all(
          userKeys.map(async (key) => {

            let now = Date.now();
            let diff = now - key.date;
            return {
              key: key.key,
              date: ms(diff, { long: true }),
            }
          })
        )).filter(Boolean).flat()
      }
      if(!items.length) items = false;       

      renderTemplate(res, req, "my-keys.ejs", { myKey: items });      
    });

      app.get("/tos", async (req, res) => {
    renderTemplate(res, req, "tos.ejs", { perms: Discord.Permissions });      
    });



    app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
      try{
      require('events').EventEmitter.defaultMaxListeners = 500;
      var theGuild = req.params.guildID;
      var user = req.user;
  
      let isStaff = false;
      if(user) {
        let staffdata = await staffData.findOne({ user_id: user.id })
          if(staffdata) {
  
            if(staffdata.staff === "true") {
              isStaff = true
            }
          }
      }
  
      let guildP = await user.guilds.find(x => x.id === theGuild)
      if (!guildP && !isStaff) return res.redirect("/dashboard");
  
      if(!isStaff) {
      const guildPerms = new Discord.Permissions(guildP.permissions);
      if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
      }
  
  
      const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
      if (!guild) return res.redirect("/dashboard");
      //var
  
      const rolesList = [
        {name: "Désactivé", id: "1"},
        {name: "Désactivé2", id: "2"}
        ]
      //data
      var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
          if (!storedSettings) {
            // If there are no settings stored for this guild, we create them and try to retrive them again.
            let newSettings = new GuildSettings({
              gid: guild[0].id
            });
            await newSettings.save().catch(()=>{});
            storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
          };

          var logs = await logsSettings.findOne({ gid: guild[0].id });
          if (!logs) {
            // If there are no settings stored for this guild, we create them and try to retrive them again.
            let newSettings = new logsSettings({
              gid: guild[0].id
            });
            await newSettings.save().catch(()=>{});
            logs = await logsSettings.findOne({ gid: guild[0].id });
          }

          let logsChannelStatut;
          if(logs.channel) {
            const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${logs.channel}')`)).filter(Boolean);
            if(!cachedChannel) {
              logsChannelStatut = false
            } else 
            if(cachedChannel.type !== 'text') { 
              logsChannelStatut = false
               } else {
            logsChannelStatut = cachedChannel.name
            }
          };



          const channelsText = (await Promise.all(
            guild[0].channels.map(async (channel) => {
  
              
              const cachedChannel = (await client.shard.broadcastEval(`this.channels.cache.get('${channel}')`)).filter(Boolean);
              if(cachedChannel[0].type !== 'text') return
              
              return cachedChannel.map((g) => ({
                name: g.name,
                id: g.id,
              }));
            })
          )).filter(Boolean).flat()
  
          let modrole = false
          /*if(storedSettings.modrole) {
            const [guildFinder] = (await client.shard.broadcastEval(`this.guilds.cache.get('${guild[0].id}')`)).filter(Boolean);
            if(!cachedChannel) {
              modrole = false
            } else {
            modrole = cachedChannel.name
            }
          }*/
      renderTemplate(res, req, "new-settings.ejs", {
        guild,
        logsChannelStatut,
        channelsText,
        settings: storedSettings,
        alert: null,
        modrole,
        logs,
        rolesList,
        createdTimestamp: ms(Date.now() - guild[0].createdTimestamp, {long: true}),
        });
      } catch(err) {
        console.log(err)
      }
    });


        // Settings endpoint.
    app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
          var theGuild = req.params.guildID;
          var user = req.user;
      
          let isStaff = false;
          if(user) {
            let staffdata = await staffData.findOne({ user_id: user.id })
              if(staffdata) {
      
                if(staffdata.staff === "true") {
                  isStaff = true
                }
              }
          }

          let guildP = await user.guilds.find(x => x.id === theGuild)
          if (!guildP && !isStaff) return res.redirect("/dashboard");
      
          if(!isStaff) {
            const guildPerms = new Discord.Permissions(guildP.permissions);
            if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
            }
      
          const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
          if (!guild) return res.redirect("/dashboard");
      
        const rolesList = [
          {name: "Désactivé", id: "1"},
          {name: "Désactivé2", id: "2"}
          ]
        //data
    
            var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
            if (!storedSettings) {
              // If there are no settings stored for this guild, we create them and try to retrive them again.
              const newSettings = new GuildSettings({
                gid: guild[0].id
              });
              await newSettings.save().catch(()=>{});
              storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
            };

              var logs = await logsSettings.findOne({ gid: guild[0].id });
        if (!logs) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          let newSettings = new logsSettings({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          logs = await logsSettings.findOne({ gid: guild[0].id });
        }

            logs.channel = req.body.logs_channel

            await logs.save().catch(() => {});
    
            //config principal
            storedSettings.prefix = req.body.prefix
            storedSettings.modrole = req.body.modrole
    
            await storedSettings.save().catch(() => {});

            let logsChannelStatut;
            if(req.body.logs_channel) {
              const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${req.body.logs_channel}')`)).filter(Boolean);
              if(!cachedChannel) {
                logsChannelStatut = false
              } else 
              if(cachedChannel.type !== 'text') { 
                logsChannelStatut = false
                 } else {
              logsChannelStatut = cachedChannel.name
              }
            }

            const channelsText = (await Promise.all(
              guild[0].channels.map(async (channel) => {
    
                
                const cachedChannel = (await client.shard.broadcastEval(`this.channels.cache.get('${channel}')`)).filter(Boolean);
                if(cachedChannel[0].type !== 'text') return
                
                return cachedChannel.map((g) => ({
                  name: g.name,
                  id: g.id,
                }));
              })
            )).filter(Boolean).flat()
    
    
          let modrole = false;


            // We render the template with an alert text which confirms that settings have been saved.
            renderTemplate(res, req, "new-settings.ejs", {
              guild, 
              rolesList,
              channelsText,
              logsChannelStatut,
              logs,
              settings: storedSettings, 
              modrole,
              alert: "Changement effectué avec succès.",
              createdTimestamp: ms(Date.now() - guild[0].createdTimestamp, {long: true}),
              });
    });

    
    app.get("/dashboard/:guildID/economie", checkAuth, async (req, res) => {
      try{
      require('events').EventEmitter.defaultMaxListeners = 500;
      var theGuild = req.params.guildID;
      var user = req.user;
  
      let isStaff = false;
      if(user) {
        let staffdata = await staffData.findOne({ user_id: user.id })
          if(staffdata) {
  
            if(staffdata.staff === "true") {
              isStaff = true
            }
          }
      }
  
      let guildP = await user.guilds.find(x => x.id === theGuild)
      if (!guildP && !isStaff) return res.redirect("/dashboard");
  
      if(!isStaff) {
      const guildPerms = new Discord.Permissions(guildP.permissions);
      if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
      }
  
  
      const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
      if (!guild) return res.redirect("/dashboard");
      //var
  
      const rolesList = [
        {name: "Désactivé", id: "1"},
        {name: "Désactivé2", id: "2"}
        ]
      //data
      var eSettings = await economySettings.findOne({ gid: guild[0].id });
      if (!eSettings) {
        // If there are no settings stored for this guild, we create them and try to retrive them again.
        let newSettings = new economySettings({
          gid: guild[0].id
        });
        await newSettings.save().catch(()=>{});
        eSettings = await economySettings.findOne({ gid: guild[0].id });
      }

      var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
          if (!storedSettings) {
            // If there are no settings stored for this guild, we create them and try to retrive them again.
            let newSettings = new GuildSettings({
              gid: guild[0].id
            });
            await newSettings.save().catch(()=>{});
            storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
          };
  
          let modrole = false
          /*if(storedSettings.modrole) {
            const [guildFinder] = (await client.shard.broadcastEval(`this.guilds.cache.get('${guild[0].id}')`)).filter(Boolean);
            if(!cachedChannel) {
              modrole = false
            } else {
            modrole = cachedChannel.name
            }
          }*/
      renderTemplate(res, req, "settings/economy.ejs", {
        guild,
        settings: storedSettings,
        alert: null,
        modrole,
        rolesList,
        economy: eSettings,
        createdTimestamp: ms(Date.now() - guild[0].createdTimestamp, {long: true}),
        });
      } catch(err) {
        console.log(err)
      }
    });

        // Settings endpoint.
    app.post("/dashboard/:guildID/economie", checkAuth, async (req, res) => {
      var theGuild = req.params.guildID;
      var user = req.user;
  
      let isStaff = false;
      if(user) {
        let staffdata = await staffData.findOne({ user_id: user.id })
          if(staffdata) {
  
            if(staffdata.staff === "true") {
              isStaff = true
            }
          }
      }

      let guildP = await user.guilds.find(x => x.id === theGuild)
      if (!guildP && !isStaff) return res.redirect("/dashboard");
  
      if(!isStaff) {
        const guildPerms = new Discord.Permissions(guildP.permissions);
        if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
        }
  
      const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
      if (!guild) return res.redirect("/dashboard");
  
    const rolesList = [
      {name: "Désactivé", id: "1"},
      {name: "Désactivé2", id: "2"}
      ]
    //data

        var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
        if (!storedSettings) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          const newSettings = new GuildSettings({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
        }

            var eSettings = await economySettings.findOne({ gid: guild[0].id });
        if (!eSettings) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          let newSettings = new economySettings({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          eSettings = await economySettings.findOne({ gid: guild[0].id });
        }

        //config principal
        storedSettings.prefix = req.body.prefix
        storedSettings.modrole = req.body.modrole

        await storedSettings.save().catch(() => {});

        eSettings.role = req.body.economy_role
        eSettings.currency = req.body.economy_currency
        eSettings.amount_start = req.body.economy_amount

        await eSettings.save().catch(() => {});


        let modrole = false;


        // We render the template with an alert text which confirms that settings have been saved.
        renderTemplate(res, req, "settings/economy.ejs", {
          guild, 
          rolesList,
          settings: storedSettings, 
          modrole,
          economy: eSettings,
          alert: "Changement effectué avec succès.",
          createdTimestamp: ms(Date.now() - guild[0].createdTimestamp, {long: true}),
          });
    });


       app.get("/dashboard/:guildID/embed", checkAuth, async (req, res) => {
          try{
          require('events').EventEmitter.defaultMaxListeners = 500;
          var theGuild = req.params.guildID;
          var user = req.user;
      
          let isStaff = false;
          if(user) {
            let staffdata = await staffData.findOne({ user_id: user.id })
              if(staffdata) {
      
                if(staffdata.staff === "true") {
                  isStaff = true
                }
              }
          }
      
          let guildP = await user.guilds.find(x => x.id === theGuild)
          if (!guildP && !isStaff) return res.redirect("/dashboard");
      
          if(!isStaff) {
          const guildPerms = new Discord.Permissions(guildP.permissions);
          if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
          }
      
      
          const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
          if (!guild) return res.redirect("/dashboard");


          const channelsText = (await Promise.all(
            guild[0].channels.map(async (channel) => {

              
              const cachedChannel = (await client.shard.broadcastEval(`this.channels.cache.get('${channel}')`)).filter(Boolean);
              if(cachedChannel[0].type !== 'text') return
              
              return cachedChannel.map((g) => ({
                name: g.name,
                id: g.id,
              }));
            })
          )).filter(Boolean).flat()



          //data
          var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
              if (!storedSettings) {
                // If there are no settings stored for this guild, we create them and try to retrive them again.
                let newSettings = new GuildSettings({
                  gid: guild[0].id
                });
                await newSettings.save().catch(()=>{});
                storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
              };


            //twitter settings
            var tSettings = await twitterSettings.findOne({ gid: guild[0].id });
            if (!tSettings) {
              // If there are no settings stored for this guild, we create them and try to retrive them again.
              let newSettings = new twitterSettings({
                gid: guild[0].id
              });
              await newSettings.save().catch(()=>{});
              tSettings = await twitterSettings.findOne({ gid: guild[0].id });
            };

            //darknet Settings
            var dSettings = await darknetSettings.findOne({ gid: guild[0].id });
            if (!dSettings) {
              // If there are no settings stored for this guild, we create them and try to retrive them again.
              let newSettings = new darknetSettings({
                gid: guild[0].id
              });
              await newSettings.save().catch(()=>{});
              dSettings = await darknetSettings.findOne({ gid: guild[0].id });
            };

              
            let twitterChannelStatut;
            if(tSettings.channel) {
              const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${tSettings.channel}')`)).filter(Boolean);
              if(!cachedChannel) { 
                twitterChannelStatut = false
              } else
              if(cachedChannel.type !== 'text') {
                twitterChannelStatut = false
                  } else {
              twitterChannelStatut = cachedChannel.name
            }
          }
          
            let darknetChannelStatut;
            if(dSettings.channel) {
              const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${dSettings.channel}')`)).filter(Boolean);
              
              if(!cachedChannel) {

              darknetChannelStatut = false
              } else
              if(cachedChannel.type !== 'text') { 
                darknetChannelStatut = false
              } else {
              darknetChannelStatut = cachedChannel.name
              }
          }
    
          renderTemplate(res, req, "settings/embed.ejs", {
            guild,
            settings: storedSettings,
            alert: null,
            twitter: tSettings,
            darknet: dSettings,
            darknetChannelStatut,
            twitterChannelStatut,
            channelsText,
            createdTimestamp: ms(Date.now() - guild[0].createdTimestamp, {long: true}),
            });
          } catch(err) {
            console.log(err)
          }
        });

    
    app.post("/dashboard/:guildID/embed", checkAuth, async (req, res) => {
      try{
      require('events').EventEmitter.defaultMaxListeners = 500;
      var theGuild = req.params.guildID;
      var user = req.user;
  
      let isStaff = false;
      if(user) {
        let staffdata = await staffData.findOne({ user_id: user.id })
          if(staffdata) {
  
            if(staffdata.staff === "true") {
              isStaff = true
            }
          }
      }
  
      let guildP = await user.guilds.find(x => x.id === theGuild)
      if (!guildP && !isStaff) return res.redirect("/dashboard");
  
      if(!isStaff) {
      const guildPerms = new Discord.Permissions(guildP.permissions);
      if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
      }
  
  
      const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
      if (!guild) return res.redirect("/dashboard");


      const channelsText = (await Promise.all(
        guild[0].channels.map(async (channel) => {

          
          const cachedChannel = (await client.shard.broadcastEval(`this.channels.cache.get('${channel}')`)).filter(Boolean);
          if(cachedChannel[0].type !== 'text') return
          
          return cachedChannel.map((g) => ({
            name: g.name,
            id: g.id,
          }));
        })
      )).filter(Boolean).flat()



      //data
      var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
          if (!storedSettings) {
            // If there are no settings stored for this guild, we create them and try to retrive them again.
            let newSettings = new GuildSettings({
              gid: guild[0].id
            });
            await newSettings.save().catch(()=>{});
            storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
          };


        //twitter settings
        var tSettings = await twitterSettings.findOne({ gid: guild[0].id });
        if (!tSettings) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          let newSettings = new twitterSettings({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          tSettings = await twitterSettings.findOne({ gid: guild[0].id });
        };

        //darknet Settings
        var dSettings = await darknetSettings.findOne({ gid: guild[0].id });
        if (!dSettings) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          let newSettings = new darknetSettings({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          dSettings = await darknetSettings.findOne({ gid: guild[0].id });
        };
      
        //config twitter
        tSettings.channel = req.body.twitter_channel
        tSettings.title = req.body.twitter_title
        tSettings.author = req.body.twitter_author

        if (validUrl.isUri(req.body.twitter_author_url)){
          tSettings.author_url = req.body.twitter_author_url
        }
        if (validUrl.isUri(req.body.twitter_footer_url)){
          tSettings.author_url = req.body.twitter_footer_url
        }

        tSettings.footer = req.body.twitter_footer

        await tSettings.save().catch(() => {});

        //config darknet
        dSettings.channel = req.body.darknet_channel
        dSettings.title = req.body.darknet_title
        dSettings.author = req.body.darknet_author
        dSettings.footer = req.body.darknet_footer

        if (validUrl.isUri(req.body.darknet_author_url)){
          tSettings.author_url = req.body.darknet_author_url
        }
        if (validUrl.isUri(req.body.darknet_footer_url)){
          tSettings.author_url = req.body.darknet_footer_url
        }

        await dSettings.save().catch(() => {});


                  
        let twitterChannelStatut;
        if(tSettings.channel) {
          const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${tSettings.channel}')`)).filter(Boolean);
          if(!cachedChannel) { 
            twitterChannelStatut = false
          } else
          if(cachedChannel.type !== 'text') {
             twitterChannelStatut = false
              } else {
          twitterChannelStatut = cachedChannel.name
        }
      }
      
        let darknetChannelStatut;
        if(dSettings.channel) {
          const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${dSettings.channel}')`)).filter(Boolean);
          
          if(!cachedChannel) {

           darknetChannelStatut = false
          } else
          if(cachedChannel.type !== 'text') { 
            darknetChannelStatut = false
          } else {
          darknetChannelStatut = cachedChannel.name
          }
      }

 
      renderTemplate(res, req, "settings/embed.ejs", {
        guild,
        settings: storedSettings,
        alert: "Chargement effectué avec succès.",
        twitter: tSettings,
        darknet: dSettings,
        darknetChannelStatut,
        twitterChannelStatut,
        channelsText,
        createdTimestamp: ms(Date.now() - guild[0].createdTimestamp, {long: true}),
        });
      } catch(err) {
        console.log(err)
      }
    });


    app.get("/dashboard/:guildID/illegal", checkAuth, async (req, res) => {
      var theGuild = req.params.guildID;
      var user = req.user;
  
      let isStaff = false;
      if(user) {
        let staffdata = await staffData.findOne({ user_id: user.id })
          if(staffdata) {
  
            if(staffdata.staff === "true") {
              isStaff = true
            }
          }
      }

      let guildP = await user.guilds.find(x => x.id === theGuild)
      if (!guildP && !isStaff) return res.redirect("/dashboard");
  
      if(!isStaff) {
        const guildPerms = new Discord.Permissions(guildP.permissions);
        if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
        }
  
      const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
      if (!guild) return res.redirect("/dashboard");

        var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
        if (!storedSettings) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          const newSettings = new GuildSettings({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
        };

        var robberySettings = await robbery.findOne({ gid: guild[0].id });
        if (!robberySettings) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          let newSettings = new robbery({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          robberySettings = await robbery.findOne({ gid: guild[0].id });
        }

            var withening = await witheningSettings.findOne({ gid: guild[0].id });
        if (!withening) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          let newSettings = new witheningSettings({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          withening = await witheningSettings.findOne({ gid: guild[0].id });
        }

        // We render the template with an alert text which confirms that settings have been saved.
        renderTemplate(res, req, "settings/illegal.ejs", {
          guild, 
          settings: storedSettings, 
          alert: null,
          withening,
          robberySettings,
          robConfig: robberySettings,
          createdTimestamp: ms(Date.now() - guild[0].createdTimestamp, {long: true}),
          });
});


app.post("/dashboard/:guildID/illegal", checkAuth, async (req, res) => {
  var theGuild = req.params.guildID;
  var user = req.user;

  let isStaff = false;
  if(user) {
    let staffdata = await staffData.findOne({ user_id: user.id })
      if(staffdata) {

        if(staffdata.staff === "true") {
          isStaff = true
        }
      }
  }

  let guildP = await user.guilds.find(x => x.id === theGuild)
  if (!guildP && !isStaff) return res.redirect("/dashboard");

  if(!isStaff) {
    const guildPerms = new Discord.Permissions(guildP.permissions);
    if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
    }

  const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
  if (!guild) return res.redirect("/dashboard");

    var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        gid: guild[0].id
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
    };

    var robberySettings = await robbery.findOne({ gid: guild[0].id });
    if (!robberySettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      let newSettings = new robbery({
        gid: guild[0].id
      });
      await newSettings.save().catch(()=>{});
      robberySettings = await robbery.findOne({ gid: guild[0].id });
    }

        var withening = await witheningSettings.findOne({ gid: guild[0].id });
    if (!withening) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      let newSettings = new witheningSettings({
        gid: guild[0].id
      });
      await newSettings.save().catch(()=>{});
      withening = await witheningSettings.findOne({ gid: guild[0].id });
    }

            //robbery config
    robberySettings.bank_time = req.body.bank_time
    robberySettings.bank_amount = req.body.bank_amount
    robberySettings.superette_time = req.body.superette_time
    robberySettings.superette_amount = req.body.superette_amount

    await robberySettings.save().catch(() => {});

    
    withening.time = req.body.withening_time
    withening.amount = req.body.withening_amount

    await withening.save().catch(() => {});



    // We render the template with an alert text which confirms that settings have been saved.
    renderTemplate(res, req, "settings/illegal.ejs", {
      guild, 
      settings: storedSettings, 
      withening,
      robberySettings,
      robConfig: robberySettings,
      alert: "Chargement effectué avec succès.",
      createdTimestamp: ms(Date.now() - guild[0].createdTimestamp, {long: true}),
      });
});



app.get("/dashboard/:guildID/services", checkAuth, async (req, res) => {
  try{
  require('events').EventEmitter.defaultMaxListeners = 500;
  var theGuild = req.params.guildID;
  var user = req.user;

  let isStaff = false;
  if(user) {
    let staffdata = await staffData.findOne({ user_id: user.id })
      if(staffdata) {

        if(staffdata.staff === "true") {
          isStaff = true
        }
      }
  }

  let guildP = await user.guilds.find(x => x.id === theGuild)
  if (!guildP && !isStaff) return res.redirect("/dashboard");

  if(!isStaff) {
  const guildPerms = new Discord.Permissions(guildP.permissions);
  if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
  }


  const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
  if (!guild) return res.redirect("/dashboard");
  //var

  const rolesList = [
    {name: "Désactivé", id: "1"},
    {name: "Désactivé2", id: "2"}
    ]
  //data
  var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
      if (!storedSettings) {
        // If there are no settings stored for this guild, we create them and try to retrive them again.
        let newSettings = new GuildSettings({
          gid: guild[0].id
        });
        await newSettings.save().catch(()=>{});
        storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
      };

      var logs = await logsSettings.findOne({ gid: guild[0].id });
      if (!logs) {
        // If there are no settings stored for this guild, we create them and try to retrive them again.
        let newSettings = new logsSettings({
          gid: guild[0].id
        });
        await newSettings.save().catch(()=>{});
        logs = await logsSettings.findOne({ gid: guild[0].id });
      }

      var lspd = await lspdSettings.findOne({ gid: guild[0].id });
      if (!lspd) {
        // If there are no settings stored for this guild, we create them and try to retrive them again.
        let newSettings = new lspdSettings({
          gid: guild[0].id
        });
        await newSettings.save().catch(()=>{});
        lspd = await lspdSettings.findOne({ gid: guild[0].id });
      }

      var ems = await emsSettings.findOne({ gid: guild[0].id });
      if (!ems) {
        // If there are no settings stored for this guild, we create them and try to retrive them again.
        let newSettings = new emsSettings({
          gid: guild[0].id
        });
        await newSettings.save().catch(()=>{});
        ems = await emsSettings.findOne({ gid: guild[0].id });
      }



      const channelsText = (await Promise.all(
        guild[0].channels.map(async (channel) => {

          
          const cachedChannel = (await client.shard.broadcastEval(`this.channels.cache.get('${channel}')`)).filter(Boolean);
          if(cachedChannel[0].type !== 'text') return
          
          return cachedChannel.map((g) => ({
            name: g.name,
            id: g.id,
          }));
        })
      )).filter(Boolean).flat()

      let modrole = false
      /*if(storedSettings.modrole) {
        const [guildFinder] = (await client.shard.broadcastEval(`this.guilds.cache.get('${guild[0].id}')`)).filter(Boolean);
        if(!cachedChannel) {
          modrole = false
        } else {
        modrole = cachedChannel.name
        }
      }*/

      let emsChannelStatut;
      if(ems.channel) {
        const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${ems.channel}')`)).filter(Boolean);
        if(!cachedChannel) {

           emsChannelStatut = false
        } else
        if(cachedChannel.type !== 'text') {

           emsChannelStatut = false
            } else {

        emsChannelStatut = cachedChannel.name
        }
      }

      let lspdChannelStatut;
      if(lspd.channel) {
        const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${lspd.channel}')`)).filter(Boolean);
        if(!cachedChannel) {
           lspdChannelStatut = false
        } else 
        if(cachedChannel.type !== 'text') {
           lspdChannelStatut = false
        } else {
        lspdChannelStatut = cachedChannel.name
        }
      }
  renderTemplate(res, req, "settings/services.ejs", {
    guild,
    channelsText,
    settings: storedSettings,
    alert: null,
    modrole,
    rolesList,
    lspd,
    ems,
    lspdChannelStatut,
    emsChannelStatut,
    createdTimestamp: ms(Date.now() - guild[0].createdTimestamp, {long: true}),
    
    });
  } catch(err) {
    console.log(err)
  }
});

    // Settings endpoint.
app.post("/dashboard/:guildID/services", checkAuth, async (req, res) => {
      var theGuild = req.params.guildID;
      var user = req.user;
  
      let isStaff = false;
      if(user) {
        let staffdata = await staffData.findOne({ user_id: user.id })
          if(staffdata) {
  
            if(staffdata.staff === "true") {
              isStaff = true
            }
          }
      }

      let guildP = await user.guilds.find(x => x.id === theGuild)
      if (!guildP && !isStaff) return res.redirect("/dashboard");
  
      if(!isStaff) {
        const guildPerms = new Discord.Permissions(guildP.permissions);
        if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
        }
  
      const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
      if (!guild) return res.redirect("/dashboard");
  
    const rolesList = [
      {name: "Désactivé", id: "1"},
      {name: "Désactivé2", id: "2"}
      ]
    //data

        var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
        if (!storedSettings) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          const newSettings = new GuildSettings({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
        };

    
    var lspd = await lspdSettings.findOne({ gid: guild[0].id });
    if (!lspd) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      let newSettings = new lspdSettings({
        gid: guild[0].id
      });
      await newSettings.save().catch(()=>{});
      lspd = await lspdSettings.findOne({ gid: guild[0].id });
    }

    var ems = await emsSettings.findOne({ gid: guild[0].id });
    if (!ems) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      let newSettings = new emsSettings({
        gid: guild[0].id
      });
      await newSettings.save().catch(()=>{});
      ems = await emsSettings.findOne({ gid: guild[0].id });
    }

        const channelsText = (await Promise.all(
          guild[0].channels.map(async (channel) => {

            
            const cachedChannel = (await client.shard.broadcastEval(`this.channels.cache.get('${channel}')`)).filter(Boolean);
            if(cachedChannel[0].type !== 'text') return
            
            return cachedChannel.map((g) => ({
              name: g.name,
              id: g.id,
            }));
          })
        )).filter(Boolean).flat()


        //ems config
        ems.channel = req.body.ems_channel
        await ems.save().catch(() => {});


        //lspd config
        lspd.channel = req.body.lspd_channel
        await lspd.save().catch(() => {});

      let modrole = false;

      let emsChannelStatut;
      if(ems.channel) {
        const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${ems.channel}')`)).filter(Boolean);
        if(!cachedChannel) {

           emsChannelStatut = false
        } else
        if(cachedChannel.type !== 'text') {

           emsChannelStatut = false
            } else {

        emsChannelStatut = cachedChannel.name
        }
      }

      let lspdChannelStatut;
      if(lspd.channel) {
        const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${lspd.channel}')`)).filter(Boolean);
        if(!cachedChannel) {
           lspdChannelStatut = false
        } else 
        if(cachedChannel.type !== 'text') {
           lspdChannelStatut = false
        } else {
        lspdChannelStatut = cachedChannel.name
        }
      }


        // We render the template with an alert text which confirms that settings have been saved.
        renderTemplate(res, req, "settings/services.ejs", {
          guild, 
          rolesList,
          channelsText,
          settings: storedSettings, 
          modrole,
          lspd,
          ems,
          lspdChannelStatut,
          emsChannelStatut,
          alert: "Changement effectué avec succès.",
          createdTimestamp: ms(Date.now() - guild[0].createdTimestamp, {long: true}),
          });
});

app.get("/dashboard/:guildID/premium", checkAuth, async (req, res) => {
  var theGuild = req.params.guildID;
  var user = req.user;

  let isStaff = false;
  if(user) {
    let staffdata = await staffData.findOne({ user_id: user.id })
      if(staffdata) {

        if(staffdata.staff === "true") {
          isStaff = true
        }
      }
  }

  let guildP = await user.guilds.find(x => x.id === theGuild)
  if (!guildP && !isStaff) return res.redirect("/dashboard");

  if(!isStaff) {
    const guildPerms = new Discord.Permissions(guildP.permissions);
    if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
    }

  const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
  if (!guild) return res.redirect("/dashboard");

    var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        gid: guild[0].id
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
    };

    // We render the template with an alert text which confirms that settings have been saved.
    renderTemplate(res, req, "settings/premium.ejs", {
      guild, 
      settings: storedSettings, 
      alertSuccess: null,
      alertError: null,
      createdTimestamp: ms(Date.now() - guild[0].createdTimestamp, {long: true}),
      });
});



app.post("/dashboard/:guildID/premium", checkAuth, async (req, res) => {
  var theGuild = req.params.guildID;
  var user = req.user;

  let isStaff = false;
  if(user) {
    let staffdata = await staffData.findOne({ user_id: user.id })
      if(staffdata) {

        if(staffdata.staff === "true") {
          isStaff = true
        }
      }
  }

  let guildP = await user.guilds.find(x => x.id === theGuild)
  if (!guildP && !isStaff) return res.redirect("/dashboard");

  if(!isStaff) {
    const guildPerms = new Discord.Permissions(guildP.permissions);
    if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
    }

  const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
  if (!guild) return res.redirect("/dashboard");

    var storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        gid: guild[0].id
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ gid: guild[0].id });
    };

    let alertSuccess = null;
    let alertError = null;
    
        //premium check
    prem = req.body.prems
    if(prem) {
    var keyFind = await PremiumKey.findOne({ key: prem });

      if(keyFind) {
        let delKey = await PremiumKey.findOneAndDelete({ key: prem })
          
        if(delKey) {
         
            storedSettings.premium = "yes"
            storedSettings.save();
            alertSuccess = "Bravo ! Votre serveur a dorénavant le mode premium d'activé !";
          } else {
            alertError = "La clé saisie est incorrecte. Si c'est une erreur, contacter notre support.";
          }
      } else {
        alertError = "La clé saisie est incorrecte. Si c'est une erreur, contacter notre support.";
      };
    } else {
      alertError = "La clé saisie est incorrecte. Si c'est une erreur, contacter notre support.";
    }

    // We render the template with an alert text which confirms that settings have been saved.
    renderTemplate(res, req, "settings/premium.ejs", {
      guild, 
      settings: storedSettings, 
      alert: "Changement effectué avec succès.",
      prem, 
      alertSuccess,
      alertError,
      createdTimestamp: ms(Date.now() - guild[0].createdTimestamp, {long: true}),
      });
});


    app.use(function(req, res, next) {
      res.status(404)
      renderTemplate(res, req, "404.ejs", { perms: Discord.Permissions });      
      
    });

  app.listen(config.port, null, null, () => console.log(`Dashboard is up and running on port ${config.port}.`));
};
