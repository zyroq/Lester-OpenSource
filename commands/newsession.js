const Discord = require("discord.js")
const GuildSettings = require("../models/settings");

module.exports.run = async (bot, message, args) => {
    const checkMark = '✅'
    const crossMark = '❌'
    try {

        var settings = await GuildSettings.findOne({ gid: message.guild.id })
        let modrole = settings.role;

    if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES') || message.member.roles.cache.some(r => r.id === modrole)) {
        let argsresult = args.join(" ");
        
        if(!args[0]) {

            let embedFindOut = new Discord.MessageEmbed()
            .setDescription(`${crossMark} Veuillez préciser l'horaire.\n\nExemple \`!new-session 17h30\``)
            .setColor("#ffab2c")
    
            message.channel.send(embedFindOut)
        } else {
            if (argsresult.length > 1024) return message.channel.send(`${crossMark} **Votre message contient plus de 1024 caractères. Je ne peux donc pas l'envoyer sous forme d'embed.**`);

    let embedDN = new Discord.MessageEmbed()
    .setTitle(`Session programmée`)
    .setColor("#ffb70c")
    .setDescription(`Nous avons programmé une nouvelle **session**, merci de bien vouloir cliquer sur l'une des **réactions**.\n\nHoraire : **${argsresult}**\n\n${checkMark} Je suis là\n🕐 Je serais en retard\n${crossMark} Je ne suis pas là`)
    .setTimestamp()
    .setFooter(`${message.guild.name}`)

    message.delete()
    let onemess = await message.channel.send("@everyone");
    let twomess = await message.channel.send(embedDN);
        await twomess.react(checkMark);
        await twomess.react('🕐');
        await twomess.react(crossMark);
        };
        } else {
        message.channel.send(`:x: **Vous n'avez pas accès à cette commande.**`);
    };
    
} catch(err) {
    const errEmbed = new Discord.MessageEmbed()
    .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
    .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
    message.channel.send(errEmbed);
    console.log(err)
};
};

module.exports.config = {
    name: "new-session",
    description: `Envoyer un message à partir du bot.`,
    usage: "/new-session <horaire>",
    accessableby: "Administrateur | Manage Message",
    aliases: ['ns', 'newsession', 'newsess']
}