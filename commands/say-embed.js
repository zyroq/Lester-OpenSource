const Discord = require("discord.js")
const GuildSettings = require("../models/settings");


module.exports.run = async (bot, message, args) => {

    var settings = await GuildSettings.findOne({ gid: message.guild.id })
    let modrole = settings.role;

if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES') || message.member.roles.cache.some(r => r.id === modrole)) {
 
    let content = args.join(" ")
    
    let color = message.member.displayHexColor;
    if (color == '#000000') color = 'RANDOM';
    const crossMark = bot.emojis.cache.get('706081571781738576');

    if (content.length > 1024) return message.channel.send(`${crossMark} **Votre message contient plus de 1024 caractères. Je ne peux donc pas l'envoyer sous forme d'embed.**`);
    let embedNew = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(`${content}`)
    .setFooter(`${message.guild.name}`)
    message.delete()
    const msg = message.channel.send(embedNew)


    let logs = false
    if(logs) {
        let embedLogs = new Discord.MessageEmbed()
        .setColor(`GREEN`)
        .setAuthor(`Message privé envoyé`)
        .setDescription(`**Utilisateur :** ${message.author}\n**Action :** A envoyé un message sous forme d'embed\n**Message :** [Voir](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${msg.id})
        `)
        .setTimestamp()
        logs.send(embedLogs)
        
    } else return;
} else return;
    }




module.exports.config = {
    name: "say-embed",
    description: `Envoyer un message à partir du bot sous forme d'embed.`,
    usage: "!say-embed <message>",
    accessableby: "Administrateur | Manage Message",
    aliases: ['say-e']
}