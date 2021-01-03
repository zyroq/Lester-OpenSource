const Discord = require("discord.js")
const GuildSettings = require("../models/settings");


module.exports.run = async (bot, message, args) => {
        
    message.delete()
                
    
    let embedDN = new Discord.MessageEmbed()
    .setTitle(`Acheter le premium`)
    .setColor("GOLD")
    .setDescription(`**Vous souhaitez acheter le premium de Lester ?** Rien de plus simple !\n\nLe premium est distribué sous forme permanente (à vie) pour un seul serveur.\n\nIl est possible de transférer le serveur équipé du premium vers un autre. Pour cela contacter l'équipe du support.\n\n__L'acheter__\nPrix : \`4.99€\` (non néglociable; à vie)\nMéthode de paiement : PayPal\n\nPayez à cette adresse PayPal : [en cliquant ici](https://www.paypal.com/paypalme/tseacen). Une fois fait, nous vous donnerons une clé premium qu'il faudra saisir sur le tableau de bord de votre serveur via le site https://lester-bot.tk/.`)

    message.channel.send(embedDN);   
        

};

module.exports.config = {
    name: "premium",
    description: `Envoyer un message à partir du bot.`,
    usage: "/start-session <PSN>",
    accessableby: "Administrateur | Manage Message",
    aliases: ['buy']
};