const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {

    try{

    if(!args[0]) {

        let Sembed = new Discord.MessageEmbed()
        .setColor('#2F3136')
        .setAuthor(`Liste des commandes`, message.guild.iconURL)
        .setThumbnail(bot.user.displayAvatarURL)
        .setTimestamp()
        .setDescription(`Hey ${message.author.username} !\n\nConfigure Lester en seulement quelques clics sur https://lester-bot.fr !\n\nPour voir la **liste des commandes**, [cliquez ici](https://docs.lester-bot.fr/liste-des-commandes) pour être redirigé vers celle-ci. Vous pouvez également **rejoindre notre serveur** si vous avez une question *(lien ci-dessous)*`)
        .addField(`:link: Liens utiles :link:`, "[Serveur de support](https://discord.gg/ME3y3Bx) | [Inviter le bot](https://discord.com/oauth2/authorize?client_id=604672517130420245&scope=bot&permissions=8)")
        .setFooter("Lester", bot.user.displayAvatarURL)
        message.channel.send(Sembed)
        return;
    }

    if(args[0] === "site") {
        
        let Sembed = new Discord.MessageEmbed()
        .setColor('#2F3136')
        .setAuthor(`Modifier votre serveur via internet.`)
        .setTimestamp()
        .setDescription(`Apprends à configurer Lester en quelques clics grâce à notre guide [en cliquant ici](https://docs.lester-bot.fr/guides/modifier-votre-serveur-via-internet.)`)
        .setFooter("Lester Guide", bot.user.displayAvatarURL)
        message.channel.send(Sembed)
        return;
    }
} catch(err) {
    const errEmbed = new Discord.MessageEmbed()
    .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
    .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
    message.channel.send(errEmbed);
}
}


module.exports.config = {
    name: "help",
    aliases: ["h", "halp", "commands"],
    usage: "!usage",
    description: "",
    accessableby: "Membres"
}