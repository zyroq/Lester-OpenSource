const Discord = require("discord.js")
const GuildSettings = require("../models/settings");
const twitterSettings = require("../models/twitter");
const darknetSettings = require("../models/darknet");
const economySettings = require("../models/economy");


module.exports.run = async (bot, message, args) => {

    try {
        console.log(message.guild.ownerID)
    } catch (err) {
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
        };
};

module.exports.config = {
    name: "test",
    description: `Réinitialise les données de Lester pour le serveur.`,
    usage: "/reset",
    accessableby: "Administrateur",
    aliases: ['']
}