const Discord = require("discord.js")


module.exports.run = async (bot, message, args) => {
    const checkMark = '✅'
    const crossMark = '❌'
    try {

message.delete()

    if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES')) {

    let embedDN = new Discord.MessageEmbed()
    .setTitle(`Fin de session`)
    .setColor("#ffb70c")
    .setDescription(`Merci à **tous** d'avoir été présent ! La session RôlePlay est fini !`)
    .setTimestamp()
    .setFooter(`${message.guild.name}`)

    message.channel.send(embedDN)

        } else {
        message.channel.send(`${crossMark} **Vous n'avez pas accès à cette commande.**`);
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
    name: "end-session",
    description: `Annonce la fin d'une session.`,
    usage: "/end-session",
    accessableby: "Administrateur | Manage Message",
    aliases: ['es', 'fin-session', 'endsess']
}