const Discord = require("discord.js")
const guildSettings = require("../models/settings")
const economySettings = require("../models/economy");

module.exports.run = async (bot, message, args) => {
    try {
        
        var settings = await guildSettings.findOne({ gid: message.guild.id })
        var economy = await economySettings.findOne({ gid: message.guild.id })

        if (message.member.permissions.has('MANAGE_ROLES')) {

            let role = message.mentions.roles.first();

            if(args[0] === "delete") {
                let resetEmbed = new Discord.MessageEmbed()
                .setDescription(`La configuration du rôle ayant les permissions de modifier les comptes bancaires a été réinitalisé.`)
                message.channel.send(resetEmbed);
                economy.role = "000"
                await economy.save()

                return;
            } 

            if(!role) return message.channel.send(":x: Veuillez mentionner un rôle.")

            economy.role = role.id 
            await economy.save()

            let embed = new Discord.MessageEmbed()
            .setDescription(`Le rôle : ${role} a désormais la possibilité de configurer les comptes bancaires. Faites \`${settings.prefix}role-bank delete\` pour supprimer cette configuration.`)
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
    name: "role-bank",
    description: `Effectuez une action.`,
    usage: "/action <message>",
    accessableby: "Tous",
    aliases: ['']
}