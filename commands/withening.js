const Discord = require("discord.js");
const GuildSettings = require("../models/settings");
const economySettings = require("../models/economy");
const userBank = require("../models/user-bank");
const witheningSettings = require("../models/withening-settings");

const ms = require('ms')
let talkedRecently = new Set()

module.exports.run = async (bot, message, args) => {
    try {

        var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
        if(storedSettings.premium === "no") return;
    
        var economy = await economySettings.findOne({ gid: message.guild.id });
        var withening = await witheningSettings.findOne({ gid: message.guild.id })
    
            let currency = economy.currency
    
        
        if(!args[0]) {
            let embed = new Discord.MessageEmbed()
            .setColor("GOLD")
            .setDescription("Pour commencer à blanchir, faites la commande \`/withening start\`.")
            .addField(`Temps`, `${withening.time} minute(s)`)
            .addField(`Blanchissement de`, `${withening.amount}${currency}`)
            message.channel.send(embed)
        }

        if(args[0] === "start") {

            var balance = await userBank.findOne({ gid: message.guild.id, user_id: message.author.id })
        let sale = balance.sale

        let limit = withening.amount
        let amount = limit;
        let bank = balance.banque

        if(parseInt(sale) <= 0) return message.channel.send(`:x: **Vous n'avez pas d'argent sale à blanchir ! Essayez une autre fois !**`)
        if(parseInt(limit) > parseInt(sale)) {
            amount = sale
        }

        let time = withening.time
    
        let newAmount = parseInt(sale) - parseInt(amount)

         let newAmountAdd = parseInt(bank) + parseInt(amount)


        let debut = new Discord.MessageEmbed()
        .setDescription(`:white_check_mark: Vous débutez le blanchiment de ${amount}$ ${message.author} !`)
        .setColor("#ffab2c")
        .setFooter(`Veuillez patienter ${time} minutes`)
    
        let fin = new Discord.MessageEmbed()
        .setDescription(`Vous venez de blanchir ${message.author} ${amount}$ !`)
        .setColor("#ffab2c")
        .setFooter("Vous pouvez désormais vous enfuir")
    
        let erreur = new Discord.MessageEmbed()
        .setDescription(`:x: Vous êtes déjà entrain de blanchir ${message.author}`)
        .setColor("#f00000")
    
        if (talkedRecently.has(message.author.id)) {
            message.channel.send(erreur);
    } else {
        message.channel.send(debut)
        
        talkedRecently.add(message.author.id);
        setTimeout(() => {
          message.channel.send(fin)
          message.author.send(fin)
          .catch()
          balance.sale = newAmount;
          balance.banque = newAmountAdd;

          balance.save()

          let logs = false;
          if(logs) {
              let embedLogs = new Discord.MessageEmbed()
              .setColor(`ORANGE`)
              .setAuthor(`Compte banquaire mis à jour`)
              .setThumbnail('https://zupimages.net/up/20/28/gqj8.png')
              .setDescription(`
              **Utilisateur :** ${message.author}
              **Action :** Blanchiment d'argent | \`+${amount}\`
              `)
              .setTimestamp()
              logs.send(embedLogs)
              
          }

          talkedRecently.delete(message.author.id);
        }, ms(`${time}m`));
    }
} else return;
    
      
        
} catch(err) {
    const errEmbed = new Discord.MessageEmbed()
    .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
    .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
    message.channel.send(errEmbed);
    console.log(err)
};
};

module.exports.config = {
    name: "withening",
    description: `Permet de blanchir de l'argent.`,
    usage: "/withening <total>",
    accessableby: "Tous",
    aliases: ['']
}