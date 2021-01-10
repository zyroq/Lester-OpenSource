const Discord = require("discord.js")
const GuildSettings = require("../models/settings");
const userBank = require("../models/user-bank");

module.exports.run = async (bot, message, args) => {
    try {
        
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if(storedSettings.premium === "no") return;

    var balance = await userBank.findOne({ gid: message.guild.id, user_id: message.author.id });

    
        let amount = args[0];


            if(!amount) return message.channel.send(`:x: **Veuillez indiquer la somme que vous souhaitez retirer !**`)

            let liquide = balance.liquide;
            let banque = balance.banque;
            let liquideAmount;
            let banqueAmount;

            if(isNaN(amount)) {
                if(!amount === "all") return message.channel.send(`:x: **Ce n'est pas un nombre, l'action est donc impossible à réaliser.**`)

                banqueAmount = parseInt(banque) - parseInt(banque)
                liquideAmount = parseInt(liquide) + parseInt(banque)
      
                

            } else {
                if(amount >= banque) {
                    banqueAmount = parseInt(banque) - parseInt(banque)
                    liquideAmount = parseInt(liquide) + parseInt(banque)
                } else {
                    banqueAmount = parseInt(banque) - parseInt(amount)
                    liquideAmount = parseInt(liquide) + parseInt(amount)
                }
                
            } 

            balance.liquide = liquideAmount;
            balance.banque = banqueAmount;
    
            await balance.save().catch(()=>{});
    

        let embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setDescription(`:white_check_mark: Retrait effectué avec succès ${message.author}.`)
        .setThumbnail('https://zupimages.net/up/20/28/a8an.png')
        .setTimestamp()
        .setFooter(`${message.guild.name}`)

        message.channel.send(embed);


    } catch (err) {
        console.log(err)
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "withdraw",
    description: `Consulter le compte en banque d'un joueur.`,
    usage: "/remove-money [type (banque, liquide, sale) <@joueur> <montant>]",
    accessableby: "Tous",
    aliases: ['with']
}