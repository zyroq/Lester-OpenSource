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
    let owner = await client.users.fetch(`${guild[0].ownerID}`)
    //channels    
    
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



    //channels    
    /*const rolesList = (await Promise.all(
      guild[0].roles.map(async (role) => {
      
        const cachedChannel = (await client.shard.broadcastEval(`this.guilds.cache.get('${guild[0].id}').roles.cache.get('${role}')`)).filter(Boolean);

        return cachedChannel.map((g) => ({
          name: g.name,
          id: g.id,
        }));
      })
    )).filter(Boolean).flat()*/

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

        //economy
        var eSettings = await economySettings.findOne({ gid: guild[0].id });
        if (!eSettings) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          let newSettings = new economySettings({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          eSettings = await economySettings.findOne({ gid: guild[0].id });
        };

        //logs
        var logsParams = await logsSettings.findOne({ gid: guild[0].id });
        if (!logsParams) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          let newSettings = new logsSettings({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          logsParams = await logsSettings.findOne({ gid: guild[0].id });
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

            var withening = await witheningSettings.findOne({ gid: guild[0].id });
        if (!withening) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          let newSettings = new witheningSettings({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          withening = await witheningSettings.findOne({ gid: guild[0].id });
        }


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
        }


        let modrole = false
        /*if(storedSettings.modrole) {
          const [guildFinder] = (await client.shard.broadcastEval(`this.guilds.cache.get('${guild[0].id}')`)).filter(Boolean);
          if(!cachedChannel) {
            modrole = false
          } else {
          modrole = cachedChannel.name
          }
        }*/
  
        let economyrole = false
        /*if(eSettings.role) {
          const [guildFinder] = (await client.shard.broadcastEval(`this.guilds.cache.get('${guild[0].id}')`)).filter(Boolean);
          let cachedChannel = guildFinder.roles
          if(!cachedChannel) {
             economyrole = false
             } else {
          economyrole = cachedChannel.name
             }
        }*/
    // We render the template with an alert text which confirms that settings have been saved.
    renderTemplate(res, req, "settings/services.ejs", {
      guild,
      settings: storedSettings,
      twitter: tSettings,
      darknet: dSettings,
      economy: eSettings,
      robConfig: robberySettings,
      withening,
      logs,
      logsParams,
      lspd,
      ems,
      alert: null,
      owner,
      logsChannelStatut,
      lspdChannelStatut,
      emsChannelStatut,
      darknetChannelStatut,
      twitterChannelStatut,
      channelsText,
      rolesList,
      modrole,
      economyrole,
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
      console.log(req.body.test1)
      console.log(req.body.test2)
      let guildP = await user.guilds.find(x => x.id === theGuild)
      if (!guildP && !isStaff) return res.redirect("/dashboard");
  
      if(!isStaff) {
        const guildPerms = new Discord.Permissions(guildP.permissions);
        if (!guildPerms.has('MANAGE_GUILD')) return res.redirect("/dashboard");
        }
  
      const guild = (await client.shard.broadcastEval(`this.guilds.cache.get('${theGuild}')`)).filter(Boolean);
      if (!guild) return res.redirect("/dashboard");
  
  
    //var
    let owner = await client.users.fetch(`${guild[0].ownerID}`)

    //channels    
    
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


 
    //channels    
    /*const rolesList = (await Promise.all(
      guild[0].roles.map(async (role) => {
      
        const cachedChannel = (await client.shard.broadcastEval(`this.guilds.cache.get('${guild[0].id}').roles.cache.get('${role}')`)).filter(Boolean);

        return cachedChannel.map((g) => ({
          name: g.name,
          id: g.id,
        }));
      })
    )).filter(Boolean).flat()*/

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

    //twitter settings
    var tSettings = await twitterSettings.findOne({ gid: guild[0].id });
    if (!tSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      let newSettings = new twitterSettings({
        gid: guild[0].id
      });
      await newSettings.save().catch(()=>{});
      tSettings = await twitterSettings.findOne({ gid: guild[0].id });
    }

    //darknet Settings
    var dSettings = await darknetSettings.findOne({ gid: guild[0].id });
    if (!dSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      let newSettings = new darknetSettings({
        gid: guild[0].id
      });
      await newSettings.save().catch(()=>{});
      dSettings = await darknetSettings.findOne({ gid: guild[0].id });
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
    var logsParams = await logsSettings.findOne({ gid: guild[0].id });
    if (!logsParams) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      let newSettings = new logsSettings({
        gid: guild[0].id
      });
      await newSettings.save().catch(()=>{});
      logsParams = await logsSettings.findOne({ gid: guild[0].id });
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

        //logs
        var logs = await logsSettings.findOne({ gid: guild[0].id });
        if (!logs) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          let newSettings = new logsSettings({
            gid: guild[0].id
          });
          await newSettings.save().catch(()=>{});
          logs = await logsSettings.findOne({ gid: guild[0].id });
        }

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


        //config principal
        storedSettings.prefix = req.body.prefix
        storedSettings.modrole = req.body.modrole

        await storedSettings.save().catch(() => {});


        withening.time = req.body.withening_time
        withening.amount = req.body.withening_amount

        await withening.save().catch(() => {});

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

        //config economy
        eSettings.role = req.body.economy_role
        eSettings.currency = req.body.economy_currency
        eSettings.amount_start = req.body.economy_amount_start

        await eSettings.save().catch(() => {});

        //config logs
        logs.channel = req.body.logs_channel

        await logs.save().catch(() => {});
        
        //robbery config
        robberySettings.bank_time = req.body.bank_time
        robberySettings.bank_amount = req.body.bank_amount
        robberySettings.superette_time = req.body.superette_time
        robberySettings.superette_amount = req.body.superette_amount

        await robberySettings.save().catch(() => {});


        //ems config
        ems.channel = req.body.ems_channel
        await ems.save().catch(() => {});


        //lspd config
        lspd.channel = req.body.lspd_channel
        await lspd.save().catch(() => {});


        //premium check
        prem = req.body.prems
        if(prem) {
        var keyFind = PremiumKey.findOne({ key: prem }, function (err, result)  {
          if (err) return;

          if(result) {
            PremiumKey.findOneAndDelete({ key: prem }, function (err, result)  { 
              if (err) return;
            })
            storedSettings.premium = "yes"
            storedSettings.save();

          };
        });
      };

      let twitterChannelStatut;
      if(req.body.twitter_channel) {
        const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${req.body.twitter_channel}')`)).filter(Boolean);    
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
      if(req.body.darknet_channel) {
        const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${req.body.darknet_channel}')`)).filter(Boolean);
        if(!cachedChannel) {
         darknetChannelStatut = false
        } else
        if(cachedChannel.type !== 'text') { 
          darknetChannelStatut = false

        } else {
        darknetChannelStatut = cachedChannel.name

        }
    }

      let emsChannelStatut;
      if(req.body.ems_channel) {
        const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${req.body.ems_channel}')`)).filter(Boolean);
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
      if(req.body.lspd_channel) {
        const [cachedChannel] = (await client.shard.broadcastEval(`this.channels.cache.get('${req.body.lspd_channel}')`)).filter(Boolean);
        if(!cachedChannel) {
           lspdChannelStatut = false
        } else 
        if(cachedChannel.type !== 'text') {
           lspdChannelStatut = false
        } else {
        lspdChannelStatut = cachedChannel.name
        }
      }

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


      let modrole = false;
      /*if(req.body.modrole) {
        const [cachedChannel] = await client.shard.broadcastEval(`this.guilds.cache.get('${guild[0].id}').roles.cache.get('${req.body.modrole}')`)
        if(!cachedChannel) {
          modrole = false
        } else {
        modrole = cachedChannel.name
        }
      }*/

      let economyrole = false
      /*if(req.body.economy_role) {
        const [guildRole] = await client.shard.broadcastEval(`this.guilds.cache.get('${guild[0].id}')`)
        
        await guildRole.roles.map(async (role) => {
      
          if
          return economyrole = false
        })

        if(!cachedChannel) {
           economyrole = false
           } else {
        economyrole = cachedChannel.name
           }
      }*/
        // We render the template with an alert text which confirms that settings have been saved.
        renderTemplate(res, req, "settings/services.ejs", {
          guild, 
          keyFind, 
          prem, 
          logsParams,
          settings: storedSettings, 
          twitter: tSettings,
          darknet: dSettings,
          economy: eSettings,
          robConfig: robberySettings,
          logs,
          lspd,
          owner,
          ems,
          channelsText,
          logsChannelStatut,
          lspdChannelStatut,
          emsChannelStatut,
          darknetChannelStatut,
          twitterChannelStatut,
          rolesList,
          modrole,
          withening,
          economyrole, 
          alert: "Changement effectué avec succès." });
    });