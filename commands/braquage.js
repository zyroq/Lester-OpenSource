const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const prefix = botconfig.prefix
const talkedRecently = new Set();
const ms = require('ms');
const robberySettings = require("../models/robbery");
const guildSettings = require("../models/settings");
const userBankBalance = require("../models/user-bank");


module.exports.run = async (bot, message, args) => {

try {

    if(!args[0]) {

        let embedErr = new Discord.MessageEmbed()
        .setDescription(`Veuillez choisir quel lieu braquer :`)
        .addField("Banque", `\`${prefix}braquage banque\``)
        .addField("Supérette", `\`${prefix}braquage superette\``)
        .setColor("#ffab2c")

        message.channel.send(embedErr)
        return;
    }
    
    var settings = await guildSettings.findOne({ gid: message.guild.id })

    var robbery = await robberySettings.findOne({ gid: message.guild.id })

    let time = robbery.bank_time
    let bankNewAmount;
    let bankAmount = robbery.bank_amount
    let userBalance;

    if(settings.premium === "yes") {
        userBalance = await userBankBalance.findOne({ gid: message.guild.id, user_id: message.author.id })
        
        bankNewAmount = parseInt(bankAmount) + parseInt(userBalance.sale)
    }




if(args[0] == "banque") {

    let debut = new Discord.MessageEmbed()
    .setDescription(`:white_check_mark: Vous débutez un braquage de banque ${message.author} !`)
    .setColor("#ffab2c")
    .setFooter(`Veuillez patienter ${time} minute(s)`)

    let fin = new Discord.MessageEmbed()
    .setDescription(`Vous venez de réussir le braquage ${message.author} !`)
    .setColor("#ffab2c")
    .setFooter(`${message.guild.name}`)

    let erreur = new Discord.MessageEmbed()
    .setDescription(`:x: Vous êtes déjà entrain de braquer la banque ${message.author}`)
    .setColor("#f00000")

    let embedPoliceBanque = new Discord.MessageEmbed()
    .setTitle(`Alerte`)
    .setColor("#1a75cf")
    .setDescription(`**Braquage de banque** en cours à la **banque centrale** !`)
    .setTimestamp()
    .setFooter(`${message.guild.name}`)


    if (talkedRecently.has(message.author.id)) {
        message.channel.send(erreur);
} else {
    message.channel.send(debut)
    if (message.guild.channels.cache.find(channel => channel.name === "appel-lspd")) {
        let sChannel = message.guild.channels.cache.find(x => x.name === "appel-lspd")
        sChannel.send("@here")
    sChannel.send(embedPoliceBanque)
    };
    
    // Adds the user to the set so that they can't talk for a minute
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      message.channel.send(fin)
      message.author.send(fin)
      .catch(err => console.log(err))

      if(settings.premium === "yes") {

        userBalance.sale = superetteNewAmount

        userBalance.save();
      }
      
      talkedRecently.delete(message.author.id);
    }, ms(`${time}m`));
}

}

if(args[0] == "superette") {



    let suptime = robbery.superette_time
    let superetteNewAmount;
    let superetteAmount = robbery.superette_amount

    if(settings.premium === "yes") {
        userBalance = await userBankBalance.findOne({ gid: message.guild.id, user_id: message.author.id })
        
        superetteNewAmount = parseInt(superetteAmount) + parseInt(userBalance.sale)
    }

    let debut = new Discord.MessageEmbed()
    .setDescription(`:white_check_mark: Vous débutez un braquage de supérette ${message.author} !`)
    .setColor("#ffab2c")
    .setFooter(`Veuillez patienter ${suptime} minute(s)`)

    let fin = new Discord.MessageEmbed()
    .setDescription(`Vous venez de réussir le braquage ${message.author} !`)
    .setColor("#ffab2c")
    .setFooter(`${message.guild.name}`)

    let erreur = new Discord.MessageEmbed()
    .setDescription(`:x: Vous êtes déjà entrain de braquer un supérette ${message.author}`)
    .setColor("#f00000")

    let embedPoliceBanque = new Discord.MessageEmbed()
    .setTitle(`Alerte`)
    .setColor("#1a75cf")
    .setDescription(`**Braquage de supérette** en cours !`)
    .setTimestamp()
    .setFooter(`${message.guild.name}`)


    if (talkedRecently.has(message.author.id)) {
        message.channel.send(erreur);
} else {
    message.channel.send(debut)
    if (message.guild.channels.cache.find(channel => channel.name === "appel-lspd")) {
        let sChannel = message.guild.channels.cache.find(x => x.name === "appel-lspd")
        sChannel.send("@here")
    sChannel.send(embedPoliceBanque)
    };
    
    // Adds the user to the set so that they can't talk for a minute
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      message.channel.send(fin)
      message.author.send(fin)
      .catch(err => console.log(err))

      if(settings.premium === "yes") {

        userBalance.sale = superetteNewAmount

        userBalance.save();
      }

      talkedRecently.delete(message.author.id);
    }, ms(`${suptime}m`));
}
}

} catch(err) {
    const errEmbed = new Discord.MessageEmbed()
    .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
    .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
    message.channel.send(errEmbed);
    console.log(err)
}

}


module.exports.config = {
    name: "braquage",
    description: `Envoyer un message à partir du bot.`,
    usage: "!braquage <lieu>",
    accessableby: "Tous",
    aliases: ['']
}