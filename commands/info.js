const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {


    try{  
        let members;
        bot.shard.fetchClientValues('users.cache.size')
	.then(resultsMembers => {
        members = resultsMembers.reduce((acc, memberCount) => acc + memberCount, 0)


        
        let servers;
        bot.shard.fetchClientValues('guilds.cache.size')
        .then(resultsGuilds => {
            servers = resultsGuilds.reduce((prev, guildCount) => prev + guildCount, 0)


      let embed = new Discord.MessageEmbed()
      .setAuthor(`Instance #${bot.shard.ids}`)
      .setColor("GREEN")
      .setDescription(`Instance :\n\n**Serveurs :** ${bot.guilds.cache.size}\n**Utilisateurs :** ${bot.users.cache.size}\n\nTotal:\n\n**Serveurs :** ${servers}\n**Nombre d'instance du bot :** ${bot.shard.count}`)
    
      message.channel.send(embed)
    })
})




} catch(err) {
    const errEmbed = new Discord.MessageEmbed()
    .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
    .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
    message.channel.send(errEmbed);
}
}


module.exports.config = {
    name: "info",
    aliases: [""],
    usage: "!info",
    description: "",
    accessableby: "Membres"
}