const Discord = require("discord.js")
const GuildSettings = require("../models/settings");

module.exports.run = async (bot, message, args) => {

    try {
            let argsresult = args.join(" ");
            message.delete()
                    
            var settings = await GuildSettings.findOne({ gid: message.guild.id })
            let modrole = settings.role;

if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES') || message.member.roles.cache.some(r => r.id === modrole)) {

        if(!args[0]) {
            let embedNN = new Discord.MessageEmbed()
            .setTitle(`Session RôlePlay suspendu`)
            .setColor("#ffb70c")
            .setDescription(`La session RôlePlay est **suspendu** pour le moment !\n\n**Raison :** ${argsresult}`)
            .setTimestamp()
            .setFooter(`${message.guild.name}`)
        
            message.channel.send(embedNN)

        } else {
    let embedDN = new Discord.MessageEmbed()
    .setTitle(`Session RôlePlay suspendu`)
    .setColor("#ffb70c")
    .setDescription(`La session RôlePlay est **suspendu** pour le moment !`)
    .setTimestamp()
    .setFooter(`${message.guild.name}`)

    message.channel.send(embedDN)
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
    name: "pause-session",
    description: `Annonce la session mit sur pause.`,
    usage: "/pause-session <raison>",
    accessableby: "Administrateur | Manage Message",
    aliases: ['ps', 'pausesess']
}