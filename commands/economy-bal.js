const Discord = require("discord.js")
const GuildSettings = require("../models/settings");
const economySettings = require("../models/economy");
const userBank = require("../models/user-bank");
const accountData = require("../models/accounts");


module.exports.run = async (bot, message, args) => {
    try {
        
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if(storedSettings.premium === "no") return;

    var economy = await economySettings.findOne({ gid: message.guild.id });




        let currency = economy.currency

    
        let user = message.mentions.members.first()
        let avatar;
        let name;

        let account = false
        if(args) {
        account = await accountData.findOne({ gid: message.guild.id, name: args.join(" ") })
        }

        if(user) {
            avatar = user.user.displayAvatarURL()
            name = user.user.tag
        } else if(account) {
            user = account.name
            avatar = null

                let ban = account.banque;

                let embed = new Discord.MessageEmbed()
                .setAuthor(`${user}`)
                .setThumbnail('https://zupimages.net/up/20/28/53c3.png')
                .addField(`Fonds`, `${n(ban)}${currency}`, true)
                .setTimestamp()
                .setFooter(`${message.guild.name}`)

                message.channel.send(embed)
                return;
        } else {
            user = message.author
            avatar = user.displayAvatarURL()
            name = user.tag
        }

        var balance = await userBank.findOne({ gid: message.guild.id, user_id: user.id });
        if(!balance) {
            const newBalance = new userBank({
                gid: message.guild.id,
                user_id: user.id,
                banque: economy.amount_start
            });
            await newBalance.save().catch(()=>{});
            balance = await userBank.findOne({ gid: message.guild.id, user_id: user.id });
        }

        let liq = balance.liquide;
        let ban = balance.banque;
        let sal = balance.sale;

        if(!liq) {
            balance.liquide = 0
            await balance.save().catch(()=>{});
        }
        if(!ban) {
            balance.banque = 0
            await balance.save().catch(()=>{});
        }
        if(!sal) {
            balance.sale = 0
            await balance.save().catch(()=>{});
        }

        let totalBank = parseInt(liq) + parseInt(ban) + parseInt(sal)

        let embed = new Discord.MessageEmbed()
        .setAuthor(`${name}`, avatar)
        .setThumbnail('https://zupimages.net/up/20/28/53c3.png')
        .addField(`Liquide`, `${n(liq)}${currency}`, true)
        .addField(`Banque`, `${n(ban)}${currency}`, true)
        .addField(`Argent Sale`, `${n(sal)}${currency}`, true)
        .addField(`Total`, `${n(totalBank)}${currency}`)

        .setTimestamp()
        .setFooter(`${message.guild.name}`)

        message.channel.send(embed)

        function n(x) {
            if(!x) return "0";
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
    name: "money",
    description: `Consulter le compte en banque d'un joueur.`,
    usage: "/money",
    accessableby: "Tous",
    aliases: ['balance', 'bal']
}