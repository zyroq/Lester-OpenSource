const Discord = require("discord.js")

const GuildSettings = require("../models/settings");
const economySettings = require("../models/economy");
const accountData = require("../models/accounts");

module.exports.run = async (bot, message, args) => {
    try {

    //cette commande n'est pas complète et sera disponible dans une prochaine version

    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if(storedSettings.premium === "no") return;

    const allAccounts = []; 

    var allAccountsData = await accountData.find({ gid: message.guild.id });

    allAccountsData.forEach(account => {
        allAccounts.push(account.name)
    })

    var economy = await economySettings.findOne({ gid: message.guild.id });


    let content = args.join(" ")

    if(!content) {
        let embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        if(allAccounts.length < 1) {
            embed.setDescription(`Liste des comptes entreprises :\n\n*Aucun compte trouvé.*\n\n\`/account <nom>\` pour afficher les informations d'un compte précis.`)
        } else {
            embed.setDescription(`Liste des comptes entreprises :\n\n**- ${allAccounts.join("\n- ")}**\n\n\`/account <nom>\` pour afficher les informations d'un compte précis.`)
        }
        await message.channel.send(embed)
        return;
    }

    var account = await accountData.findOne({ gid: message.guild.id, name: content });
    if(!account) {
        let embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setDescription(`:x: Ce compte est introuvable.`) 
        await message.channel.send(embed)
        return;
    }


    let owner = `Utilisateur introuvable (${account.owner})`
    let ownerUser = bot.users.cache.get(account.owner)
    if(ownerUser) {
        owner = `${ownerUser.username}#${ownerUser.discriminator} (${account.owner})`
    }

    const coOwner = ['']
    if(account.co_owner2) {
        let coOwn = bot.users.cache.get(account.co_owner2)
        coOwner.push(`${coOwn.username}#${coOwn.discriminator} (${coOwn.id})`)
    }

    if(account.co_owner3) {
        let coOwn = bot.users.cache.get(account.co_owner3)
        coOwner.push(`${coOwn.username}#${coOwn.discriminator} (${coOwn.id})`)
    }

    if(coOwner.length < 1){
    coOwner.push("Aucun")
    }

    let embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(`${account.name}`)
    .setDescription(`**Fonds :** \`${n(account.banque)}${economy.currency}\`\n\n**Propriétaire :** ${owner}\n**Co-propriétaire(s) :** ${coOwner.join(",\n")}`) 
    await message.channel.send(embed)
    
    function n(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
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
    name: "account",
    description: `Consulter le compte en banque d'un joueur.`,
    usage: "/add-money [type (banque, liquide, sale) <@joueur> <montant>]",
    accessableby: "Tous",
    aliases: ['']
}