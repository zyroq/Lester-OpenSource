const Discord = require("discord.js")

const GuildSettings = require("../models/settings");
const itemSettings = require("../models/item");
const userItemSettings = require("../models/user-item");

module.exports.run = async (bot, message, args) => {
    
    //cette commande n'est pas complète et sera disponible dans une prochaine version

    var settings = await GuildSettings.findOne({ gid: message.guild.id })
    let modrole = settings.role;

if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES') || message.member.roles.cache.some(r => r.id === modrole)) {
 
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0];
    let itemName = messageArray.slice(1);

    if(!itemName[0]) {
        
    }

    let logs = await logsSettings.findOne({ gid: message.guild.id })
    if(logs) {
        let embedLogs = new Discord.MessageEmbed()
        .setColor(`#050505`)
        .setAuthor(`Item créé`, 'https://zupimages.net/up/20/28/aht6.png')
        .setTimestamp()

        logs = message.guild.channels.cache.find(x => x.id === logs.channel )
        if(logs) {
        logs.send(embedLogs)
        };
} else return;

} else return;
}



module.exports.config = {
    name: "create-item",
    description: `Envoyer un message à partir du bot.`,
    usage: "/say <message>",
    accessableby: "Administrateur | Manage Message",
    aliases: ['create']
}