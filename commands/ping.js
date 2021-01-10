const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {

let botMsg = await message.channel.send(`Chargement..`);


const embedPinging = new Discord.MessageEmbed()
.setTitle(`📶 Ping`)
.setDescription(`**Serveur**: \`${botMsg.createdAt - message.createdAt}ms\`\n**Uptime**: \`${msToTime(bot.uptime)}\``)
.setColor("RANDOM")
.setTimestamp();

await message.channel.send(embedPinging);
await botMsg.delete();

};

function msToTime(ms){
days = Math.floor(ms / 86400000); // 24*60*60*1000
daysms = ms % 86400000; // 24*60*60*1000
hours = Math.floor(daysms / 3600000); // 60*60*1000
hoursms = ms % 3600000; // 60*60*1000
minutes = Math.floor(hoursms / 60000); // 60*1000
minutesms = ms % 60000; // 60*1000
sec = Math.floor(minutesms / 1000);

let str = "";
if (days) str = str + days + "jours";
if (hours) str = str + hours + "heures";
if (minutes) str = str + minutes + "min";
if (sec) str = str + sec + "sec";

return str;
}


module.exports.config = {
    name: "ping",
    description: `Affiche le ping du bot.`,
    usage: "/ping",
    accessableby: "Tous",
    aliases: ['']
}