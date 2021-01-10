const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    try {
        await message.delete()

             
        const checkMark = bot.emojis.cache.get('706081611715837994');
        const crossMark = bot.emojis.cache.get('706081571781738576');

        let kissMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
        if(!kissMember) return message.channel.send(`${crossMark}**S'il vous plaît ! Identifier le membre que vous souhaitez embrassez !**`).then(m => m.delete({timeout: 5000}));

        if(kissMember === message.author) return message.channel.send(`**Ohoh.. ${kissMember} on dirait bien que ${message.author} souhaite t'embrasser... Attendez.. Vous voulez vous embrasser vous même ?**`).then(m => m.delete({ timeout: 5000}));

        let spamEmbed = new Discord.MessageEmbed()
        .setAuthor(`Anti-Spam`)
        .setColor(colours.orange)
        .setDescription(`${crossMark} veuillez patienter 5 minutes !`);


        
        let msg = await message.channel.send(`**Ohoh.. ${kissMember} on dirait bien que ${message.author} souhaite t'embrasser ! Acceptes-tu ?**`)     
        let yes = await msg.react('706081611715837994');
        let no = await msg.react('706081571781738576');


        msg.awaitReactions((reaction, user) => user.id == kissMember.id && (reaction.emoji.id == '706081611715837994' || reaction.emoji.id == '706081571781738576'),
        { max: 1, time: 120000 }).then(collected => {
            
        if(collected.first().emoji.id == '706081611715837994') {
            msg.delete()
            message.channel.send(`**${message.author} a embrassé ${kissMember}** !`);


        };
        if(collected.first().emoji.id == '706081571781738576') {
            msg.delete()
            message.channel.send(`**${kissMember} a requalé ${message.author}** !`)


        };
    }).catch((err) => msg.delete());
} catch(err) {
    const errEmote = bot.emojis.cache.get('706079974687375402');
    const errEmbed = new Discord.MessageEmbed()
    .setDescription(`${errEmote} Une erreur est survenue !\nCode erreur : \`${err}\``)
    .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
    message.channel.send(errEmbed);
    console.log(err)

        };
};

module.exports.config = {
    name: "kiss",
    description: `Effectue la récole/traitement/revente`,
    usage: "/mineur",
    accessableby: "Tous",
    aliases: ['mine']
}