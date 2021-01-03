const Discord = require("discord.js")
const lspdSettings = require("../models/lspd");


module.exports.run = async (bot, message, args) => {



    try {
        var lspd = await lspdSettings.findOne({ gid: message.guild.id })

    
            let lspdChan = message.guild.channels.cache.find(x => x.id === lspd.channel )
            if(!lspdChan) return message.channel.send(":x: Salon introuvable.")

        let argsresult = args.join(" ");
        if(!args[0]) {

            let embedFindOut = new Discord.MessageEmbed()
            .setDescription(`:x: Veuillez préciser le message.\n\nExemple \`/lspd Besoin d'aide prise d'otage..\``)
            .setColor("#ffab2c")
    
            message.channel.send(embedFindOut)
        } else {
            if (argsresult.length > 1000) return message.channel.send(`:x: **Votre message contient plus de 1024 caractères. Je ne peux donc pas l'envoyer sous forme d'embed.**`);


    let embedDN = new Discord.MessageEmbed()
    .setTitle(`Alerte`)
    .setColor("#1a75cf")
    .setDescription(`Un **appel** a été passé par un **citoyen** ! Nouvelle **intervention** !`)
    .addField("Détails de l'appel", `${argsresult}`)
    .addField("Hôte de l'appel", `${message.author}`)
    .setTimestamp()
    .setFooter(`${message.guild.name}`)

    message.delete()
    message.channel.send(`**Votre appel a bien été passé aux forces de l'ordre !**`).then(m => m.delete({timeout: 10000}))
    lspdChan.send("@here");
    lspdChan.send(embedDN);
        };

} catch(err) {
    const errEmbed = new Discord.MessageEmbed()
    .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
    .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
    message.channel.send(errEmbed);
}
}


module.exports.config = {
    name: "lspd",
    description: `Permet de contacter la police.`,
    usage: "/lspd <message>",
    accessableby: "Tous",
    aliases: ['']
}