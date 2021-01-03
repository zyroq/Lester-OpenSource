const Discord = require("discord.js")
const GuildSettings = require("../models/settings");


module.exports.run = async (bot, message, args) => {

    var settings = await GuildSettings.findOne({ gid: message.guild.id })
    let modrole = settings.role;

if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES') || message.member.roles.cache.some(r => r.id === modrole)) {
 
        message.delete()
        let argsresult = args.join(" ")
       const msg = message.channel.send(argsresult)
        


    let logs = false
    if(logs) {
        let embedLogs = new Discord.MessageEmbed()
        .setColor(`GREEN`)
        .setAuthor(`Message privé envoyé`)
        .setDescription(`**Utilisateur :** ${message.author}\n**Action :** A envoyé un message en utilisant la commande \`say\`\n**Message :** [Voir](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${msg.id})
        `)
        .setTimestamp()
        logs.send(embedLogs)
        
    } else return;
} else return;

}



module.exports.config = {
    name: "say",
    description: `Envoyer un message à partir du bot.`,
    usage: "/say <message>",
    accessableby: "Administrateur | Manage Message",
    aliases: ['']
}