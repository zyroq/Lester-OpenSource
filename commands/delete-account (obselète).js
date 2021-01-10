const Discord = require("discord.js")

const GuildSettings = require("../models/settings");
const economySettings = require("../models/economy");
const accountData = require("../models/accounts");

module.exports.run = async (bot, message, args) => {
    try {
        
    //cette commande n'est pas complète et sera disponible dans une prochaine version

    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if(storedSettings.premium === "no") return;
    
    let content = args.join(" ")
    if(!content) {
        let embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setDescription(':x: Veuillez spécifier le compte que vous souhaitez supprimer.\n\n\`/delete-account <nom>\`')
        await message.channel.send(embed)
        return;
    }

    var account = await accountData.findOne({ gid: message.guild.id, name: content });
    if(!account) {
        let embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setDescription(`:x: Le compte \`${content}\` est introuvable.`) 
        await message.channel.send(embed)
        return;
    }

        if(!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) {

            if(account.owner !== message.author.id) {
                let embed = new Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
                .setDescription(`:x: Vous n'avez pas les autorisations nécessaires afin de supprimer ce compte. Seul son propriétaire ou un membre du staff du serveur peuvent effectuer cette action.`) 
                await message.channel.send(embed)
                return;
            }
        };

    await account.remove()


    let embed = new Discord.MessageEmbed()
    .setColor("RED")
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
    .setDescription(`:white_check_mark: Vous venez de supprimer avec succès le compte **${content}**.`) 
    await message.channel.send(embed)
    


    } catch (err) {
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "delete-account",
    description: `Consulter le compte en banque d'un joueur.`,
    usage: "/add-money [type (banque, liquide, sale) <@joueur> <montant>]",
    accessableby: "Tous",
    aliases: ['']
}