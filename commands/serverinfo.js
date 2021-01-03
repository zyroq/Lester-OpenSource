const Discord = require("discord.js")
const GuildSettings = require("../models/settings");

module.exports.run = async (bot, message, args) => {
try {
    var settings = await GuildSettings.findOne({ gid: message.guild.id });
    let premStatus = ":x:"

    if(settings.premium === "yes") {
        premStatus = ":white_check_mark:"
    }

function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " jour" : " jours");
};

let emojiList = message.guild.emojis.cache.map((e, x) => e).join(' | ');

if(!emojiList) emojiList = "Aucun";

const embed = new Discord.MessageEmbed()
.setAuthor(`${message.guild.name}`, message.author.displayAvatarURL())
.setColor("GREEN")
.addField("Nom", `${message.guild.name}`, true)
.addField("ID", `${message.guild.id}`, true)
.addField("Premium", `${premStatus}`, true)
.addField("Propriétaire", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
.addField("Total | Humains | Bots", `${message.guild.memberCount} | ${message.guild.members.cache.filter(member => !member.user.bot).size} | ${message.guild.members.cache.filter(member => member.user.bot).size}`, true)
.addField("Date de création", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
.addField("Liste des emojis", `${emojiList}`)
.setThumbnail(message.guild.iconURL())
message.channel.send(embed);
} catch(err) {
    const errEmbed = new Discord.MessageEmbed()
    .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
    .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
    message.channel.send(errEmbed)
};
};

module.exports.config = {
    name: "serverinfo",
    description: "Affiche les informations du serveur",
    usage: "/serverinfo",
    accessableby: "Tous",
    aliases: ["si", "serverdesc", "server-info", "serveur-info"]
}


//let dateCreate = myDate.getFullYear() + '-' +('0' + (myDate.getMonth()+1)).slice(-2)+ '-' +  ('0' + myDate.getDate()).slice(-2) + ' '+myDate.getHours()+ ':'+('0' + (myDate.getMinutes())).slice(-2)+ ':'+myDate.getSeconds();
