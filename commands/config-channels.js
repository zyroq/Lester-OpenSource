const Discord = require("discord.js")

const GuildSettings = require("../models/settings");
const twitterSettings = require("../models/twitter");
const darknetSettings = require("../models/darknet");
const economySettings = require("../models/economy");
const userBank = require("../models/user-bank");
const logsSettings = require("../models/logs");
const robbery = require("../models/robbery");
const lspdSettings = require("../models/lspd");

module.exports.run = async (bot, message, args) => {

    if (!message.member.permissions.has('MANAGE_CHANNELS')) return;

    let prefix = await GuildSettings.findOne({ gid: message.guild.id });
    if(!prefix) return;
    prefix = prefix.prefix;


    if(!args[0]) {
        let embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor("Configuration")
        .setDescription(`\`${prefix}config twitter <salon>\`\nConfiguration du salon Twitter \n\n\`${prefix}config darknet <salon>\`\nConfiguration du salon Darknet  \n\n\`${prefix}config logs <salon>\`\nConfiguration du salon Logs \n\n\`${prefix}config lspd <salon>\`\nConfiguration du salon LSPD \n\n\`${prefix}config ems <salon>\`\nConfiguration du salon EMS`);
        message.channel.send(embed);
        return;
    }

    let channel = message.mentions.channels.first()
    let errChannel = new Discord.MessageEmbed()
    .setColor("RED")
    .setAuthor("Erreur")
    .setDescription(`Salon introuvable, ou manquant. Veuillez réssayer.`);

    let successConfig = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor("Changement effectué avec succès !")
    .setDescription(`Les changements ont été sauvegardés avec succès.`);


    if(args[0] === "logs") {
        if(!channel) return message.channel.send(errChannel);

        let logs = await logsSettings.findOne({ gid: message.guild.id });
        logs.channel = channel.id;
        await logs.save().catch(()=>{});

        message.channel.send(successConfig);
    }

    if(args[0] === "darknet") {
        if(!channel) return message.channel.send(errChannel);

        let darknet = await darknetSettings.findOne({ gid: message.guild.id });
        darknet.channel = channel.id;
        await darknet.save().catch(()=>{});

        message.channel.send(successConfig);
    }

    if(args[0] === "twitter") {
        if(!channel) return message.channel.send(errChannel);

        let twitter = await twitterSettings.findOne({ gid: message.guild.id });
        twitter.channel = channel.id;
        await twitter.save().catch(()=>{});

        message.channel.send(successConfig);
    }

    if(args[0] === "lspd") {
        if(!channel) return message.channel.send(errChannel);

        let lspd = await lspdSettings.findOne({ gid: message.guild.id });
        lspd.channel = channel.id;
        await lspd.save().catch(()=>{});

        message.channel.send(successConfig);
    }

    if(args[0] === "ems") {
        if(!channel) return message.channel.send(errChannel);

        let ems = await emsSettings.findOne({ gid: message.guild.id });
        ems.channel = channel.id ;
        await ems.save().catch(()=>{});

        message.channel.send(successConfig);
    }
}

module.exports.config = {
    name: "config",
    description: `/`,
    usage: "/config",
    accessableby: "Tous",
    aliases: ['']
}