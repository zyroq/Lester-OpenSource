const Discord = require("discord.js")
const GuildSettings = require("../models/settings");
const economySettings = require("../models/economy");
const userBank = require("../models/user-bank");

module.exports.run = async (bot, message, args) => {
    try {
        
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if(storedSettings.premium === "no") return;

    var economy = await economySettings.findOne({ gid: message.guild.id });

    let currency = economy.currency;

    
        let user = message.mentions.members.first()
        let amount;

        if(!user) return message.channel.send(`:x: **Veuillez mentionner un utilisateur existant !**`)
        if(user.id === message.author.id) return message.channel.send(':x: **Vous ne pouvez pas vous transférer votre propre argent !**')

        
        let type;
        let recType;

            
            var receiver = await userBank.findOne({ gid: message.guild.id, user_id: user.id });
            if(!receiver) {
                const newBalance = new userBank({
                    gid: message.guild.id,
                    user_id: user.id,
                    banque: economy.amount_start
                });
                await newBalance.save().catch(()=>{});
                receiver = await userBank.findOne({ gid: message.guild.id, user_id: user.id });
            }

            var balance = await userBank.findOne({ gid: message.guild.id, user_id: message.author.id });


            if(user.id === message.author.id) return message.channel.send(':x: **Vous ne pouvez pas vous transférer votre propre argent !**')

          if(args[0] === "liquide") {
                amount = args[2]
                type = balance.liquide
                recType = receiver.liquide;

            } else if(args[0] === "sale") {
                amount = args[2]
                type = balance.sale
                recType = receiver.sale;


            } else { 
            type = balance.liquide;
            amount = args[1]
            recType = receiver.liquide;
            };


            if(!amount) return message.channel.send(`:x: **Veuillez indiquer la somme que vous souhaitez ajouter !**`)

            if(isNaN(amount)) return message.channel.send(`:x: **Ce n'est pas un nombre, l'action est donc impossible à réaliser.**`)


        let argent = type;
        let ReceiveArgent = recType;

            if(amount > argent) return message.channel.send(`:x: ${message.author} **vous n'avez pas assez d'argent pour pouvoir procéder à ce transfert !**`)
        let newAmount = parseInt(argent) - parseInt(amount)

        let newReceive = parseInt(ReceiveArgent) + parseInt(amount)

        if(args[0] === "liquide") {
            balance.liquide = newAmount;
            receiver.liquide = newReceive;

        } else if(args[0] === "sale") {
            balance.sale = newAmount;
            receiver.sale = newReceive;


        } else { 
        balance.liquide = newAmount;
        receiver.liquide = newReceive;
        };
        balance.save()
        receiver.save()


        let embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL)
        .setDescription(`:white_check_mark: Vous venez de donner avec succès **${n(amount)}${currency}** à ${user}.`)
        .setTimestamp()
        .setFooter(`${message.guild.name}`)

        message.channel.send(embed);
        function n(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }

        let logs = false
        if(logs) {
            let embedLogs = new Discord.MessageEmbed()
            .setColor(`ORANGE`)
            .setAuthor(`Compte banquaire mis à jour`)
            .setThumbnail('https://zupimages.net/up/20/28/gqj8.png')
            .setDescription(`**Utilisateur :** ${user}\n**Effectuée par :** ${message.author}\n**Action :** Transaction d'argent\n${user} - \`+${amount}\`\n${message.author} - \`-${amount}\`
            `)
            .setTimestamp()
            logs.send(embedLogs)
            
        } else return;






    } catch (err) {
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "give-money",
    description: `Consulter le compte en banque d'un joueur.`,
    usage: "/add-money <type (liquide, sale)> <@joueur> <montant>]",
    accessableby: "Tous",
    aliases: ['givemoney', 'pay']
}