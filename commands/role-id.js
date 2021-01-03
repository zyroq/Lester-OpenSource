const Discord = require("discord.js")
const guildSettings = require("../models/settings")


module.exports.run = async (bot, message, args) => {
    try {
        
        var settings = await guildSettings.findOne({ gid: message.guild.id })

        if (message.member.permissions.has('MANAGE_ROLES')) {

            let role = message.mentions.roles.first();

            if(args[0] === "delete") {
                let resetEmbed = new Discord.MessageEmbed()
                .setDescription(`La configuration du rôle ayant les permissions de modifier les cartes d'identité a été réinitalisé.`)
                message.channel.send(resetEmbed);
                settings.role = "000"
                await settings.save()

                return;
            } 

            if(!role) return message.channel.send(":x: Veuillez mentionner un rôle.")

            settings.role = role.id 
            await settings.save()

            let embed = new Discord.MessageEmbed()
            .setDescription(`Le rôle : ${role} a désormais la possibilité de configurer la carte d'identité. Faites \`${settings.prefix}role-id delete\` pour supprimer cette configuration.`)
            message.channel.send(embed)
        } else {
            message.channel.send(":x: Vous n'avez pas les droits pour effectuer cette commande.")
        }
    } catch (err) {
        console.log(err)
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "role-id",
    description: `Effectuez une action.`,
    usage: "/action <message>",
    accessableby: "Tous",
    aliases: ['']
}