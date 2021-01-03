const Discord = require("discord.js")
const GuildSettings = require("../models/settings");


module.exports.run = async (bot, message, args) => {
    const crossMark = ':x:'

        
    message.delete()
                   
    var settings = await GuildSettings.findOne({ gid: message.guild.id })
    let modrole = settings.role;

if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES') || message.member.roles.cache.some(r => r.id === modrole)) {
        let argsresult = args.join(" ");
        if(!args[0]) {

            let embedFindOut = new Discord.MessageEmbed()
            .setDescription(`${crossMark} Veuillez préciser le PSN du lanceur.\n\nExemple \`!start-session Tseacen\``)
            .setColor("#ffab2c")
    
            message.channel.send(embedFindOut)
        } else {
        

    let embedDN = new Discord.MessageEmbed()
    .setTitle(`Session en cours`)
    .setColor("#ffb70c")
    .setDescription(`Une **nouvelle session** vient d'être lancé !\nPour nous **rejoindre**, **demande en ami** *(si ce n'est pas fait)* l'hôte indiqué ci-dessous. Toutes nos sessions sont **sur amis**, il faudra donc avoir l'**hôte** comme **ami**, et tu pourras **rejoindre la session** par **toi même**.\n\n\n*Tu n'arrives pas à nous rejoindre ? Contacte un membre du support dans #tickets*`)
    .addField("Hôte (PSN)", `${argsresult}`)
    .setTimestamp()
    .setFooter(`${message.guild.name}`)

    message.channel.send("@everyone");
    message.channel.send(embedDN);   
        }
        } else {
        message.channel.send(`${crossMark} **Vous n'avez pas accès à cette commande.**`);
    };
};

module.exports.config = {
    name: "start-session",
    description: `Envoyer un message à partir du bot.`,
    usage: "/start-session <PSN>",
    accessableby: "Administrateur | Manage Message",
    aliases: ['s', 'startsession', 'startsess']
};