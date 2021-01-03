const Discord = require("discord.js")
const GuildSettings = require("../models/settings");


module.exports.run = async (bot, message, args) => {                
    
    let embedDN = new Discord.MessageEmbed()
    .setTitle(`Site internet`)
    .setColor("GREEN")
    .setDescription(`Accéder au site internet de Lester [en cliquant ici](https://lester-bot.tk/)`)
    await message.channel.send("https://lester-bot.tk/")
    await message.channel.send(embedDN);   
        

};

module.exports.config = {
    name: "site",
    description: `Envoyer un message à partir du bot.`,
    usage: "/start-session <PSN>",
    accessableby: "Administrateur | Manage Message",
    aliases: ['']
};