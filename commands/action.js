const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    try {
    
        await message.delete()
        let argsresult = args.join(" ")
        let embed = new Discord.MessageEmbed()
        .setDescription(`**${message.author} effectue l'action suivante :** \n\n*${argsresult}*`)
        .setColor("RANDOM")
        await message.channel.send(embed)
    } catch (err) {
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "action",
    description: `Effectuez une action.`,
    usage: "/action <message>",
    accessableby: "Tous",
    aliases: ['act']
}