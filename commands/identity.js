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
        **__Identité__**
        
        Nom / Prénom : *${identity.name}*
        Âge : *${identity.age}*
        Sexe : *${identity.sexe}*
        Couleur de peau : *${identity.peau}*

        ―――――――――――――
        **__Permis__**

        Moto : ${identity.p_mot}
        Voiture : ${identity.p_car}
        Bateau : ${identity.p_boat}
        Hélicoptère : ${identity.p_hel}
        Avion : ${identity.p_plane}
        `)
        .setColor('#2F3136')
        .setFooter(`Citoyenneté : ${message.guild.name}`)


        await message.channel.send(id)
        //identity.wanted
        
    } catch (err) {
        console.log(err)
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "identity",
    description: `Effectuez une action.`,
    usage: "/action <message>",
    accessableby: "Tous",
    aliases: ['']
}