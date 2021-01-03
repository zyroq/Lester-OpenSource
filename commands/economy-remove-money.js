const Discord = require("discord.js")
const GuildSettings = require("../models/settings");
const economySettings = require("../models/economy");
const userBank = require("../models/user-bank");

module.exports.run = async (bot, message, args) => {
    try {

    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if(storedSettings.premium === "no") return;

    var economy = await economySettings.findOne({ gid: message.guild.id });

        if(!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) {

            let role = economy.role;

            if(!role) return message.channel.send(`Vous n'avez pas les permissions.`);
            
            let idRole = message.guild.roles.cache.find(x => x.id === role );
            if(!idRole) return message.channel.send(`Vous n'avez pas les permissions.`);
            if(!message.member.roles.cache.some(r => r.id === role)) return message.channel.send(`Vous n'avez pas les permissions requises !`)
        
        };

    
        let user = message.mentions.members.first()
        let amount;

        if(!user) return message.channel.send(`:x: **Veuillez mentionner un utilisateur existant !**`)
            let type;


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

                if(args[0] === "banque") {
                    amount = args[2]
                    type = balance.banque
                } else if(args[0] === "liquide") {
                    amount = args[2]
                    type = balance.liquide
    
                } else if(args[0] === "sale") {
                    amount = args[2]
                    type = balance.sale
    
                } else {
                    amount = args[1]
                    type = balance.liquide
                };


            if(!amount) return message.channel.send(`:x: **Veuillez indiquer la somme que vous souhaitez ajouter !**`)

            if(isNaN(amount)) return message.channel.send(`:x: **Ce n'est pas un nombre, l'action est donc impossible à réaliser.**`)


        let argent = type

        let newAmount;
        if(argent >= amount) {
            newAmount = parseInt(argent) - parseInt(amount)
            who = `:white_check_mark: Vous venez de retirer avec succès ${n(amount)} à ${user}.`
            } else {
                newAmount = parseInt(argent) - parseInt(argent)
                who = `:white_check_mark: Vous venez de retirer toute l'argent de ${user}.`
            }


        if(args[0] === "banque") {
            balance.banque = newAmount
        } else if(args[0] === "liquide") {
            balance.liquide = newAmount

        } else if(args[0] === "sale") {
            balance.sale = newAmount

        } else {
            balance.liquide = newAmount
        };


        await balance.save().catch(()=>{});


        let embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL)
        .setDescription(`${who}`)
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
            .setColor(`GREEN`)
            .setAuthor(`Compte banquaire mis à jour`, 'https://zupimages.net/up/20/28/aht6.png')
            .setDescription(`**Utilisateur :** ${user}\n**Effectuée par :** ${message.author}\n**Action :** Ajout d'argent | \`+${amount}\` | ${type}`)
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
    name: "remove-money",
    description: `/`,
    usage: "/",
    accessableby: "Tous",
    aliases: ['remove', 'removemoney']
}