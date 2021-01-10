const Discord = require("discord.js")
const talkedRecently = new Set();


module.exports.run = async (bot, message, args) => {

    message.delete()

    let comas = [
        "vous n'avez rien oublié",
        "vous oubliez les 3 dernières sessions",
        "vous oubliez les 5 dernières minutes",
        "vous n'avez rien oublié",
        "vous oubliez les 3 dernières sessions",
        "vous oubliez les 5 dernières minutes",
        "vous n'avez rien oublié",
        "vous oubliez les 3 dernières sessions",
        "vous oubliez les 5 dernières minutes",
        "vous n'avez rien oublié",
        "vous oubliez les 3 dernières sessions",
        "vous oubliez les 5 dernières minutes",
        "vous n'avez rien oublié",
        "vous oubliez les 3 dernières sessions",
        "vous oubliez les 5 dernières minutes",
        "vous n'avez rien oublié",
        "vous oubliez les 3 dernières sessions",
        "vous oubliez les 5 dernières minutes",
        "vous n'avez rien oublié",
        "vous oubliez les 3 dernières sessions",
        "vous oubliez les 5 dernières minutes",
        "vous oubliez tout, de A à Z, à part votre identité et votre métier."
    ];

    let coma = comas[Math.floor(Math.random() * comas.length)];

    let erreur = new Discord.MessageEmbed()
    .setDescription(`Veuillez patienter quelques minutes ${message.author}.`)
    .setColor("#f00000");

    let comaE = new Discord.MessageEmbed()
    .setDescription(`${message.author} vous êtes dans le coma : ${coma}`)
    .setColor("#c88bff")
    .setFooter("Veuillez attendre 5 minutes sur place ou l'arrivée d'un EMS.");

    if (talkedRecently.has(message.author.id)) {
        message.channel.send(erreur);
    } else {
    message.channel.send(comaE)
    
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, 120000);
    }
}

module.exports.config = {
    name: "coma",
    description: `Permet d'afficher l'action coma, avec un message aléatoire indiquant l'état de votre personnage.`,
    usage: "/coma",
    accessableby: "Tous",
    aliases: ['']
}