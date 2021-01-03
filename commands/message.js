const Discord = require("discord.js")


module.exports.run = async (bot, message, args) => {
    const checkMark = ":white_check_mark:"
    const crossMark = ":x:"
    try {

        
    message.delete()
    
    let embedUserFound = new Discord.MessageEmbed()
    .setDescription(`${crossMark} Utilisateur introuvable, réessayez.`)

    let NoMess = new Discord.MessageEmbed()
    .setDescription(`${crossMark} Veuillez inscrire à la suite de la commande le message que vous souhaitez envoyer`)

    let userCalled = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    if(!userCalled) return message.channel.send(embedUserFound).then(m => m.delete({ timeout: 6000}));

    let mess = args.slice(1).join(" ")
    if(!mess) return message.channel.send(NoMess).then(m => m.delete({ timeout: 6000 }))


    let embedDN = new Discord.MessageEmbed()
    .setTitle(`Nouveau message`)
    .setColor("#2F3136")
    .setDescription(`${mess}`)
    .addField("De", `${message.author}`)
    .setThumbnail()
    .setFooter(`${message.guild.name}`)
    
        let msgToUser = await userCalled.send(embedDN)
            .catch(() => message.channel.send(`${crossMark} Je ne peux pas envoyer de message à cet utilisateur. Celui-ci a sûrement bloqué ses MP.`))

        if(msgToUser) message.channel.send(`${checkMark} Message envoyé avec succès`).then(m => m.delete({ timeout: 5000}))
    



        let logs = false
        if(logs) {
            let embedLogs = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setAuthor(`Message privé envoyé`)
            .setThumbnail('https://zupimages.net/up/20/32/py07.png')
            .setDescription(`**De :** ${message.author}\n**Envoyé à :** ${userCalled}\n**Message :** *${mess}*
            `)
            .setTimestamp()
            logs.send(embedLogs)
            
        } else return;
    
    
    }
    catch(error) {
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${error}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
        console.log(error)
      }
}


module.exports.config = {
    name: "message",
    description: `Envoie un message au joueur via le bot.`,
    usage: "/message <@membre> <message>",
    accessableby: "Tous",
    aliases: ['m', 'mess', 'send']
}