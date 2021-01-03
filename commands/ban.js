const Discord = require("discord.js")
const GuildSettings = require("../models/settings");
const economySettings = require("../models/economy");
const accountData = require("../models/accounts");

module.exports.run = async (bot, message, args) => {
    if(message.author.id ==! "313768730700152833") return;
    message.delete()
    if (message.mentions.members.first()) {
               // Easy way to get member object though mentions.
               var member = message.mentions.members.first();
               // ban
               member.ban().then((member) => {
            message.channel.send(":wave: " + member.displayName + " a été banni du serveur. C'est dommage pour lui.");
        }).catch(() => {
            message.author.send("I do not have permissions to do this");
        });
}
}



module.exports.config = {
    name: "mmh",
    description: `Consulter le compte en banque d'un joueur.`,
    usage: "/add-money [type (banque, liquide, sale) <@joueur> <montant>]",
    accessableby: "Tous",
    aliases: ['']
}