const Discord = require("discord.js")
const userSettings = require("../models/user-cardId")
const guildSettings = require("../models/settings")

module.exports.run = async (bot, message, args) => {
    try {
        var settings = await guildSettings.findOne({ gid: message.guild.id })
        let role = settings.role;

        if (!message.member.permissions.has('MANAGE_ROLES')) {


            let idRole = message.guild.roles.cache.find(x => x.id === role );
            if(!idRole) return message.channel.send(`Vous n'avez pas les permissions.`)
            if(!message.member.roles.cache.some(r => r.id === role)) return message.channel.send(`Vous n'avez pas les permissions requises !`)
        }

        let member = message.mentions.members.first()


        if(!args[0]) {
            let embed = new Discord.MessageEmbed()
            .setColor("GOLD")
            .setDescription(`Il manque quelque chose !`)
            .addField(`Usage`, '`/config-ppa <@membre>`')
            message.channel.send(embed)
            return;
        };

        if(!member) {
            let embed = new Discord.MessageEmbed()
            .setColor("GOLD")
            .setDescription(`Vous devez mentionner un membre valide !`)
            .addField(`Usage`, '`/config-ppa <@membre>`')
            message.channel.send(embed)
            return;
        }
        var ppaUser = await userSettings.findOne({ gid: message.guild.id, user_id: member.id })
        if(!ppaUser) {
            const newID = new userSettings({
              gid: message.guild.id,
              user_id: member.id
            });
            await newID.save()
            ppaUser = await userSettings.findOne({ gid: message.guild.id, user_id: member.id })
          }
        let statut;


        let ppaStat = ppaUser.ppa;

        if(ppaStat === "Oui") {
            ppaUser.ppa = "Non"
            statut = `Vous venez de retirer le PPA de`
        } else {
            ppaUser.ppa = "Oui"
            statut = `Vous venez de donner le PPA à`
        }
        await ppaUser.save()

        let id = new Discord.MessageEmbed()
        .setAuthor(`Citoyen ${member.username}`, member.user.displayAvatarURL())
        .setThumbnail(message.guild.iconURL)
        .setDescription(`:white_check_mark: ${statut} ${member}`)
        
        .setColor('#2F3136')
        .setFooter(`${message.guild.name}`)

        message.channel.send(id)

        
    } catch (err) {
        console.log(err)
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "config-ppa",
    description: `Affiche le permis port d'arme.`,
    usage: "/ppa [@Joueur]",
    accessableby: "Tous",
    aliases: ['']
}