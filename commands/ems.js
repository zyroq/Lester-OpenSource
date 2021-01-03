const Discord = require("discord.js")
const emsSettings = require("../models/ems");


module.exports.run = async (bot, message, args) => {


    const checkMark = '✅'
    const crossMark = '❌'
    try {
        var ems = await emsSettings.findOne({ gid: message.guild.id })

    
            let emsChan = message.guild.channels.cache.find(x => x.id === ems.channel )
            if(!emsChan) return message.channel.send(":x: Salon introuvable.")


        let argsresult = args.join(" ");
        if(!args[0]) {

            let embedFindOut = new Discord.MessageEmbed()
            .setDescription(`${crossMark} Veuillez préciser le message.\n\nExemple \`/lspd Besoin d'aide prise d'otage..\``)
            .setColor("#ffab2c")
    
            message.channel.send(embedFindOut)
        } else {
            if (argsresult.length > 1000) return message.channel.send(`${crossMark} **Votre message contient plus de 1024 caractères. Je ne peux donc pas l'envoyer sous forme d'embed.**`);


            let embedDN = new Discord.MessageEmbed()
            .setTitle(`Alerte`)
            .setColor("#0fe2e9")
            .setDescription(`Un **appel** a été passé par un **citoyen** ! Nouvelle **intervention** !`)
            .addField("Détails de l'appel", `${argsresult}`)
            .addField("Hôte de l'appel", `${message.author}`)
            .setTimestamp()
            .setFooter(`${message.guild.name}`)

    message.delete()
    message.channel.send(`${checkMark} **Votre appel a bien été passé auprès des services hospitaliers !**`).then(m => m.delete({timeout: 10000}))
    emsChan.send("@here");
    emsChan.send(embedDN);
        };

} catch(err) {
    const errEmote = bot.emojis.cache.get('706079974687375402');
    const errEmbed = new Discord.MessageEmbed()
    .setDescription(`${errEmote} Une erreur est survenue !\nCode erreur : \`${err}\``)
    .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
    message.channel.send(errEmbed);
};
};

module.exports.config = {
    name: "ems",
    description: `Permet de contacter les services médicaux.`,
    usage: "/ems <message>",
    accessableby: "Tous",
    aliases: ['']
}