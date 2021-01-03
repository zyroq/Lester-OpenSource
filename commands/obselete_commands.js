const Discord = require("discord.js")
const userSettings = require("../models/user-cardId")


module.exports.run = async (bot, message, args) => {
    try {

        let id = new Discord.MessageEmbed()
        .setAuthor(`Commande obselète`)
        .setColor(`GREEN`)
        .setDescription(`Cette commande fait partie de la liste des commandes obselètes. Cette commande a été remplacée par un système automatisé plus ludique, qui est personnalisable via le site : https://lester-bot.tk/. Pour modifier les salons (twitter, darknet, ems) etc.. ou même effectuer d'autres actions, rendez-vous sur le site.`)

        message.channel.send(id)

        
    } catch (err) {
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "setup",
    description: `Affiche le permis port d'arme.`,
    usage: "/ppa [@Joueur]",
    accessableby: "Tous",
    aliases: ['setchannel', 'set-channel']
}