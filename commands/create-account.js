const Discord = require("discord.js")

const GuildSettings = require("../models/settings");
const economySettings = require("../models/economy");
const accountData = require("../models/accounts");

module.exports.run = async (bot, message, args) => {
    try {

    

    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if(storedSettings.premium === "no") return;


    var allAccounts = await accountData.find({ gid: message.guild.id });


    if(allAccounts.length >= 10) {
        let embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setDescription(':x: La limite de création de compte à été atteinte (**10**). Veuillez en supprimer un avant d\'effectuer cette opération.')
        await message.channel.send(embed)
        return;
    }

    let content = args.join(" ")
    if(!content) {
        let embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setDescription(':x: Veuillez spécifier un nom à donner au compte (nom d\'entreprise..) que vous souhaitez créer.\n\n\`/create-account <nom>\` (15 caractères max)')
        await message.channel.send(embed)
        return;
    }

    if(content.length > 15) {
        let embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setDescription(`:x: Le nom du compte doit être inférieur ou égal à 15 caractères. Vous avez \`${parseInt(content.length) - 15}\` caractères en trop.`) 
        await message.channel.send(embed)
        return;
    }

    var account = await accountData.findOne({ gid: message.guild.id, name: content });
    if(account) {
        let embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setDescription(`:x: Le compte \`${account.name}\` existe déjà.`) 
        await message.channel.send(embed)
        return;
    }

        const newAccount = new accountData({
            gid: message.guild.id,
            name: content,
            owner: message.author.id,
    });
    await newAccount.save().catch(()=>{});
    account = await accountData.findOne({ gid: message.guild.id, name: content });



    let embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
    .setDescription(`:white_check_mark: Vous venez de créer avec succès le compte de **${content}**.`) 
    await message.channel.send(embed)
    


    } catch (err) {
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "create-account",
    description: `Consulter le compte en banque d'un joueur.`,
    usage: "/add-money [type (banque, liquide, sale) <@joueur> <montant>]",
    accessableby: "Tous",
    aliases: ['']
}