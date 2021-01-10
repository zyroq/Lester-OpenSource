const Discord = require("discord.js")
const fs = require("fs");

module.exports.run = async (bot, message, args) => {


        if(message.guild.id === "570192130601910272") {

    try {
    
   let serverID = args[0]

   if(!serverID) return message.channel.send(`:x: Veuillez indiquer l'**ID** de votre serveur à la suite.`)
   if(isNaN(serverID)) return message.channel.send(`:x: Veuillez indiquer l'**ID** de votre serveur à la suite.`)

   if(!bot.guilds.cache.get(serverID)) return message.channel.send(`:x: Je ne trouve pas ce serveur, réessayez.`)

   let server = bot.guilds.cache.get(serverID)

   if(server.owner.id === message.author.id) {
    const role = message.guild.roles.cache.find(x => x.id === "729006358099263609");

       message.member.roles.add(role)
       message.channel.send(`**Serveur trouvé** ! Vous obtenez à présent le rôle de "Propriétaire de serveur"`)
   } else {
    message.channel.send(`Vous n'avez pas l'air d'être le propriétaire de ce serveur ${message.author}"`)
}




} catch(err) {
    const errEmote = bot.emojis.cache.get('706079974687375402');
    const errEmbed = new Discord.MessageEmbed()
    .setDescription(`${errEmote} Une erreur est survenue !\nCode erreur : \`${err}\``)
    .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
    message.channel.send(errEmbed);
};
        }
    }

module.exports.config = {
    name: "server-check",
    description: ``,
    usage: "",
    accessableby: "Tous",
    aliases: ['check-server', 'sc', 'cs']
}