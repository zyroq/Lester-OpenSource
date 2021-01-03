const Discord = require("discord.js")
const userSettings = require("../models/user-cardId")


module.exports.run = async (bot, message, args) => {
    try {
        let member = message.mentions.members.first() ? message.mentions.members.first() : message.author
        let userA;

        if(member === message.mentions.members.first()) {
            userA = member.user
        }

        if(member === message.author) {
            userA = member
        }

        var identity = await userSettings.findOne({ gid: message.guild.id, user_id: member.id })
        if(!identity) {
            const newID = new userSettings({
              gid: message.guild.id,
              user_id: member.id
            });
            await newID.save()
          }


        let id = new Discord.MessageEmbed()
        .setAuthor(`Citoyen ${userA.username}`, userA.displayAvatarURL())
        .setThumbnail(message.guild.iconURL)
        .setDescription(`―――――――――――――
        Permis port d'arme de *${identity.name}* :

        Statut P.P.A : *${identity.ppa}*
        ―――――――――――――`)
        
        .setColor('#2F3136')
        .setFooter(`Citoyenneté : ${message.guild.name}`)

        message.channel.send(id)

        
    } catch (err) {
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "ppa",
    description: `Affiche le permis port d'arme.`,
    usage: "/ppa [@Joueur]",
    accessableby: "Tous",
    aliases: ['']
}