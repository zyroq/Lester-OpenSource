const Discord = require("discord.js")


module.exports.run = async (bot, message, args) => {
  
    try {
        message.delete()

        let inviteEmbed = new Discord.MessageEmbed()
        .setColor("ORANGE")
        .setDescription(`Tu peux retrouver tout les différents liens en rapport avec Lester (Invitation, support, etc..) en visitant notre site https://lester-bot.tk !`)


        message.channel.send(inviteEmbed);
   
    } catch (err) {
        console.error(err);
    }
};
module.exports.config = {
    name: "invite",
    description: `Affiche les liens importants, comme le support, et le lien d'invitation du bot.`,
    usage: "/invite",
    accessableby: "Tous",
    aliases: ['inv', 'link', 'support']
}