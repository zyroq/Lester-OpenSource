const Discord = require("discord.js");
const botconfig = require("./botconfig.json");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
const mongoose = require("mongoose");
const config = require("./config");
const GuildSettings = require("./models/settings");
const PremiumKey = require("./models/premium-key");
const twitterSettings = require("./models/twitter");
const darknetSettings = require("./models/darknet");
const economySettings = require("./models/economy");
const userBank = require("./models/user-bank");
const logsSettings = require("./models/logs");
const robbery = require("./models/robbery");
const lspdSettings = require("./models/lspd");
const emsSettings = require("./models/ems");
const userSettings = require("./models/user-cardId")
const witheningSettings = require("./models/withening-settings")
const joinLeaveSettings = require("./models/join-leave-data")
const blacklisted = require("./models/blacklist")



const Dashboard = require("./dashboard/dashboard");


const DBL = require("dblapi.js");
const dbl = new DBL(botconfig.tokentopgg, bot);
 

// We instiate the client and connect to database.
mongoose.connect(config.mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
bot.config = config;

bot.on("ready", async () => {
  

  if(bot.shard.ids == 0) {
    Dashboard(bot)
  };
 
  dbl.on('error', e => {
    console.log(`Oops! ${e}`);
   })

  bot.shard.broadcastEval(`
    (async => { 
      console.log(\`Shard \${this.shard.ids} ready\`)
    })();
`);

bot.shard.broadcastEval(`
(async => { 
  console.log(\`Shard \${this.shard.ids} ready\`)
})();
`);

    console.log(`${bot.user.username} is online`);
    bot.user.setActivity(`/help | lester-bot.fr | Shard: ${bot.shard.ids}`, {type: "WATCHING"});


    setInterval(() => {
  bot.shard.fetchClientValues('guilds.cache.size')
	.then(results => {
    console.log(`${results.reduce((prev, guildCount) => prev + guildCount, 0)} total guilds`);

      let serverCount = results.reduce((prev, guildCount) => prev + guildCount, 0);
      dbl.postStats( serverCount, bot.shard.ids, bot.shard.count);
      


})
    .catch(console.error);
  }, 1800000);
  
});



bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err)

    //console.log(files)
    let jsfile = files.filter(f => f.split(".").pop() === "js") 
    if(jsfile.length <= 0) {
         return console.log("[LOGS] Couldn't Find Commands!");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        bot.commands.set(pull.config.name, pull);  
        pull.config.aliases.forEach(alias => {
            bot.aliases.set(alias, pull.config.name)
        });
    });
});


bot.on("guildMemberAdd" , async member => {
  
  var joinLeaveData = await joinLeaveSettings.findOne({ gid: member.guild.id });
  if(!joinLeaveData) {
    const newID = new joinLeaveSettings({
      gid: member.guild.id,
    });
    await newID.save()
    joinLeaveData = await joinLeaveSettings.findOne({ gid: member.guild.id });

  }
  if(!joinLeaveData) return;
  let channel = joinLeaveData.joinChannel
  if(!channel) return;
  channel = member.guild.channels.cache.find(x => x.id === channel)
  if(!channel) return;
  let msg = joinLeaveData.joinMessage
  if(!msg) return;
  let sendMsg = await channel.send(checkVar(msg, member)).catch(()=>{});
  if(!sendMsg) return;

});


bot.on("guildMemberRemove" , async (member) => {
  var removeLeaveData = await joinLeaveSettings.findOne({ gid: member.guild.id });
  if(!removeLeaveData) return;
  let channel = removeLeaveData.leaveChannel
  if(!channel) return;
  channel = member.guild.channels.cache.find(x => x.id === channel)
  if(!channel) return;
  channel
});


bot.on("message", async (message) => {
    // Declaring a reply function for easier replies - we grab all arguments provided into the function and we pass them to message.channel.send function.
  
    if(message.author.bot || message.channel.type === "dm") return;
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

    await checkDb(message.guild.id);

    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    var economy = await economySettings.findOne({ gid: message.guild.id });
    var identity = await userSettings.findOne({ gid: message.guild.id, user_id: message.author.id });
    if(!identity) {
      const newID = new userSettings({
        gid: message.guild.id,
        user_id: message.author.id
      });
      await newID.save()
    }


        if(storedSettings.premium === "yes") {

              var user_bank = await userBank.findOne({ gid: message.guild.id, user_id: message.author.id });
              if (!user_bank) {
                const newSettings = new userBank({
                  gid: message.guild.id,
                  user_id: message.author.id,
                  banque: economy.amount_start
                });
                await newSettings.save().catch(()=>{});
              }

        }

    let prefix = storedSettings.prefix
  
    // If the message does not start with the prefix stored in database, we ignore the message.
    if (message.content.indexOf(prefix) !== 0) return;
  
    // We remove the prefix from the message and process the arguments.
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
    if(commandfile) commandfile.run(bot,message,args)

  
  });




  
// darknet :
bot.on("message", async message => {
  if(message.author.bot || message.channel.type === "dm") return;
    
  const dSettings = await darknetSettings.findOne({ gid: message.guild.id });
  if(!dSettings) return;

  if(message.channel.id !== dSettings.channel) return;
  
  let messageArray = message.content.split(" ")
  let argsresult = messageArray.slice(0).join(" ");
  try {
      message.delete()

      let darknetChann = message.guild.channels.cache.find(x => x.id === dSettings.channel )

      if(!argsresult[0]) return;

      let successEmbed = new Discord.MessageEmbed()

          .setColor('#050505')
          .setDescription(`${argsresult}`)


          if(dSettings.title) {
            successEmbed.setTitle(`${checkVar(dSettings.title, message.author)}`)
            }

            if(dSettings.author && !dSettings.author_url) {
              successEmbed.setAuthor(`${checkVar(dSettings.author, message.author)}`)
              }

              
            if(dSettings.author && dSettings.author_url) {
              successEmbed.setAuthor(`${checkVar(dSettings.author, message.author)}`, checkVar(dSettings.author_url, message.author))
              }

              if(dSettings.footer && !dSettings.footer_url) {
                successEmbed.setFooter(`${checkVar(dSettings.footer, message.author)}`)
              }

              if(dSettings.footer && dSettings.footer_url) {
                successEmbed.setFooter(`${checkVar(dSettings.footer, message.author)}`, checkVar(dSettings.footer_url, message.author))
              }

                      if(dSettings.time === "true") {
                      successEmbed.setTimestamp()
                      }
          const msg = await darknetChann.send(successEmbed)

          let logs = await logsSettings.findOne({ gid: message.guild.id })
          if(logs) {
              let embedLogs = new Discord.MessageEmbed()
              .setColor(`#050505`)
              .setAuthor(`Message spécifique`, 'https://zupimages.net/up/20/28/aht6.png')
              .setTimestamp()
              if(argsresult.length > 1900) {
                embedLogs.setDescription(`**Utilisateur :** ${message.author} (${message.author.id})\n**Salon :** darknet - <#${dSettings.channel}>\n**Message :** [Voir](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${msg.id}) - Message trop long.`)
              } else {
                embedLogs.setDescription(`**Utilisateur :** ${message.author} (${message.author.id})\n**Salon :** darknet - <#${dSettings.channel}>\n**Message :** [Voir](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${msg.id}) - \`${argsresult}\``)
              } 
              logs = message.guild.channels.cache.find(x => x.id === logs.channel )
              if(logs) {
              logs.send(embedLogs)
              };
              
          } else return;
          
          //sChannel.send(reportEmbed)

} catch(err) {
  console.log(err)
const errEmbed = new Discord.MessageEmbed()
.setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
.addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
message.channel.send(errEmbed);
};
});



// twitter :
bot.on("message", async message => {
  if(message.author.bot || message.channel.type === "dm") return;
  
  const dSettings = await twitterSettings.findOne({ gid: message.guild.id });
  if(!dSettings) return;


  if(message.channel.id !== dSettings.channel) return;
  
  let messageArray = message.content.split(" ")
  let argsresult = messageArray.slice(0).join(" ");
  try {
      message.delete()

      let twitterChann = message.guild.channels.cache.find(x => x.id === dSettings.channel )

      if(!argsresult[0]) return;

      let successEmbed = new Discord.MessageEmbed()

          .setColor('#66c2e9')
          .setDescription(`${argsresult}`)


          if(dSettings.title) {
            successEmbed.setTitle(`${checkVar(dSettings.title, message.author)}`)
            }


            if(dSettings.author && !dSettings.author_url) {
              successEmbed.setAuthor(`${checkVar(dSettings.author, message.author)}`)
              }

              if(dSettings.author && dSettings.author_url) {
                successEmbed.setAuthor(`${checkVar(dSettings.author, message.author)}`, checkVar(dSettings.author_url, message.author))
                }

              if(dSettings.footer && !dSettings.footer_url) {
                successEmbed.setFooter(`${checkVar(dSettings.footer, message.author)}`)
              }

              if(dSettings.footer && dSettings.footer_url) {
                successEmbed.setFooter(`${checkVar(dSettings.footer, message.author)}`, checkVar(dSettings.footer_url, message.author))
              }

                      if(dSettings.time === "true") {
                      successEmbed.setTimestamp()
                      }
          const msg = await twitterChann.send(successEmbed)

          let logs = await logsSettings.findOne({ gid: message.guild.id })
          if(logs) {
              let embedLogs = new Discord.MessageEmbed()
              .setColor(`#050505`)
              .setAuthor(`Message spécifique`, 'https://zupimages.net/up/20/28/aht6.png')
              .setTimestamp()
              if(argsresult.length > 1900) {
                embedLogs.setDescription(`**Utilisateur :** ${message.author} (${message.author.id})\n**Salon :** twitter - <#${dSettings.channel}>\n**Message :** [Voir](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${msg.id}) - Message trop long.`)
              } else {
                embedLogs.setDescription(`**Utilisateur :** ${message.author} (${message.author.id})\n**Salon :** twitter - <#${dSettings.channel}>\n**Message :** [Voir](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${msg.id}) - \`${argsresult}\``)
              } 
              logs = message.guild.channels.cache.find(x => x.id === logs.channel )
              if(logs) {
              logs.send(embedLogs)
              };
              
          } else return;
          
          //sChannel.send(reportEmbed)

} catch(err) {
  console.log(err)
const errEmbed = new Discord.MessageEmbed()
.setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
.addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
message.channel.send(errEmbed);
};
});



//blacklist message

bot.on("message", async message => {
  if(message.channel.type === "dm" || message.author.bot) return;
  if(message.guild.id === "570192130601910272") return;
 

  var user = await blacklisted.findOne({ id: message.author.id });
  if(!user) return;

  try {
    if(message.guild.ownerID === message.author.id) {
    message.guild.leave();
    return;

    } else {

        let embedLogs = new Discord.MessageEmbed()
        .setColor(`RED`)
        .setAuthor(`[BLACKLIST] Utilisateur banni`, `${message.author.displayAvatarURL()}`)
        .setDescription(`**${message.author.tag}** (${message.author.id}) a été banni du serveur automatiquement car il se trouve dans la blacklist de Lester.`)
        .addField('Raison :', `${user.reason}`)
        .setTimestamp()


              let logs = await logsSettings.findOne({ gid: message.guild.id })
              if(logs) {
                  logs = message.guild.channels.cache.find(x => x.id === logs.channel )
                  if(logs) {
                    await logs.send(embedLogs)
                  } else {
                    await message.channel.send(embedLogs)
                  }
                  
              } else {
                await message.channel.send(embedLogs)
              }

              const member = message.guild.members.resolve(message.author);


        await member.ban({ reason: '[BLACKLIST] Cet utilisateur a été banni du serveur automatiquement car il se trouve dans la blacklist de Lester.' })
      };

} catch(err) {
};
});


bot.on('guildMemberAdd', async member => {
  let messageArray = message.content.split(" ")
  let argsresult = messageArray.slice(0).join(" ");

  if(member.guild.id === "570192130601910272") return;



  var user = await blacklisted.findOne({ id: member.user.id });
  if(!user) return;

  try {
    let embedLogs = new Discord.MessageEmbed()
    .setColor(`RED`)
    .setAuthor(`[BLACKLIST] Utilisateur banni`)
    .setDescription(`**${member.user.tag}** (${member.user.id}) a été banni du serveur automatiquement car il se trouve dans la blacklist de Lester.`)
    .addField('Raison :', `${user.reason}`)
    .setTimestamp()


          let logs = await logsSettings.findOne({ gid: member.guild.id })
          if(logs) {
              logs = bot.channels.get(x => x.id === logs.channel )
              if(logs) {
                await logs.send(embedLogs)
              } 
          }
          const user = member.guild.members.resolve(member);

    await user.ban({ reason: '[BLACKLIST] Cet utilisateur a été banni du serveur automatiquement car il se trouve dans la blacklist de Lester.' })
          
} catch(err) {
};
});


bot.on("error", console.error);
bot.on("warn", console.warn);












function checkVar(text, user) {
  if(text.includes("{user_mention}")) {
  text = text.replace("{user_mention}", user);
  };

  if(text.includes("{user_tag}")) {
    text = text.replace("{user_tag}", user.discriminator);
    };

    if(text.includes("{user_username}")) {
  text = text.replace("{user_username}", user.username);
  };

  if(text.includes("{user}")) {
    text = text.replace("{user}", `${user.username}#${user.discriminator}`);
    };

  if(text.includes("{user_icon}")) {
    text = text.replace("{user_icon}", `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`);
    };

  if(text.includes("{user_id}")) {
    text = text.replace("{user_id}", user.id);
    };
    return text
};


async function checkDb(id) {
  var storedSettings = await GuildSettings.findOne({ gid: id });
  if (!storedSettings) {
    // If there are no settings stored for this guild, we create them and try to retrive them again.
    const newSettings = new GuildSettings({
      gid: id
    });
    await newSettings.save().catch(()=>{});
  }

//twitter settings
var tSettings = await twitterSettings.findOne({ gid: id });
if (!tSettings) {
// If there are no settings stored for this guild, we create them and try to retrive them again.
let newSettings = new twitterSettings({
  gid: id
});
await newSettings.save().catch(()=>{});
}

//darknet Settings
var dSettings = await darknetSettings.findOne({ gid: id });
if (!dSettings) {
// If there are no settings stored for this guild, we create them and try to retrive them again.
let newSettings = new darknetSettings({
  gid: id
});
await newSettings.save().catch(()=>{});
}

var eSettings = await economySettings.findOne({ gid: id });
if (!eSettings) {
// If there are no settings stored for this guild, we create them and try to retrive them again.
let newSettings = new economySettings({
  gid: id
});
await newSettings.save().catch(()=>{});
}


  //logs
  var logs = await logsSettings.findOne({ gid: id });
  if (!logs) {
    // If there are no settings stored for this guild, we create them and try to retrive them again.
    let newSettings = new logsSettings({
      gid: id
    });
    await newSettings.save().catch(()=>{});
  }

  var robberySettings = await robbery.findOne({ gid: id });
  if (!robberySettings) {
    // If there are no settings stored for this guild, we create them and try to retrive them again.
    let newSettings = new robbery({
      gid: id
    });
    await newSettings.save().catch(()=>{});
  }

  
  var lspd = await lspdSettings.findOne({ gid: id });
  if (!lspd) {
    // If there are no settings stored for this guild, we create them and try to retrive them again.
    let newSettings = new lspdSettings({
      gid: id
    });
    await newSettings.save().catch(()=>{});
  }

  var ems = await emsSettings.findOne({ gid: id });
  if (!ems) {
    // If there are no settings stored for this guild, we create them and try to retrive them again.
    let newSettings = new emsSettings({
      gid: id
    });
    await newSettings.save().catch(()=>{});
  }

  var withening = await witheningSettings.findOne({ gid: id });
  if (!withening) {
    // If there are no settings stored for this guild, we create them and try to retrive them again.
    let newSettings = new witheningSettings({
      gid: id
    });
    await newSettings.save().catch(()=>{});
  }
};



 

bot.login(botconfig.token);