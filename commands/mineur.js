const Discord = require("discord.js")
const talkedRecently = new Set();

module.exports.run = async (bot, message, args) => {
    try {
        await message.delete()
        const checkMark = '✅'
        const crossMark = '❌'

        let embed = new Discord.MessageEmbed()
        .setAuthor(`Mineur`)
        .setColor("ORANGE")
        .setDescription(`${message.author.username} veuillez selectionner une des réactions, en fonction de l'action souhaitée.\n\n⛏️ Récolte\n📝 Traitement\n💰 Vente\n❌ Annulé`);

        let spamEmbed = new Discord.MessageEmbed()
        .setAuthor(`Anti-Spam`)
        .setColor("ORANGE")
        .setDescription(`${crossMark} veuillez patienter 5 minutes !`);


        
        let msg = await message.channel.send(embed)     
        let reactRecolte = await msg.react('⛏️');
        let reactTraitement = await msg.react('📝');
        let reactVente = await msg.react('💰');
        let reactCancel = await msg.react('❌');


        msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '⛏️' || reaction.emoji.name == '📝' || reaction.emoji.name == '💰' || reaction.emoji.name == '❌'),
        { max: 1, time: 30000 }).then(collected => {
            
        if(collected.first().emoji.name == '⛏️') {
            msg.delete()
            if (talkedRecently.has(message.author.id)) {
                message.channel.send(spamEmbed).then(msg => {msg.delete({ timeout: 3000})});;
            } else {
            let bicon = bot.user.displayAvatarURL;
                let botembed = new Discord.MessageEmbed()
                .setTitle("Récolte")
                .setDescription(`${checkMark} ${message.author} Vous commencez la récolte !`)
                .setThumbnail()
                .setFooter('Veuillez patienter 5 minutes.')


            
                message.channel.send(botembed);
            }
            // Adds the user to the set so that they can't talk for a minute
            talkedRecently.add(message.author.id);
            setTimeout(() => {

                let finembed = new Discord.MessageEmbed()
                .setTitle("Fin récolte")
                .setDescription(`${checkMark} ${message.author} Vous avez fini de récolter !`)
                .setThumbnail()

              message.channel.send(finembed)

              talkedRecently.delete(message.author.id);
            }, 60000);


        };


        if(collected.first().emoji.name == '📝') {
            msg.delete()
            if (talkedRecently.has(message.author.id)) {
                message.channel.send(spamEmbed).then(msg => {msg.delete({ timeout : 3000 })});;
            } else {
            let bicon = bot.user.displayAvatarURL;
                let botembed = new Discord.MessageEmbed()
                .setTitle("Traitement")
                .setDescription(`${checkMark} ${message.author} Vous commencez le traitement !`)
                .setThumbnail()
                .setFooter('Veuillez patienter 5 minutes.')


            
                message.channel.send(botembed);
            }
            // Adds the user to the set so that they can't talk for a minute
            talkedRecently.add(message.author.id);
            setTimeout(() => {

                let finembed = new Discord.MessageEmbed()
                .setTitle("Fin traitement")
                .setDescription(`${checkMark} ${message.author} Vous avez fini de traiter !`)
                .setThumbnail()

              message.channel.send(finembed)

              talkedRecently.delete(message.author.id);
            }, 60000);



        };
        if(collected.first().emoji.name == '💰') {
            msg.delete()
            if (talkedRecently.has(message.author.id)) {
                message.channel.send(spamEmbed).then(msg => {msg.delete({ timeout: 3000 })});;
            } else {
            let bicon = bot.user.displayAvatarURL;
                let botembed = new Discord.MessageEmbed()
                .setTitle("Vente")
                .setDescription(`${checkMark} ${message.author} Vous commencez la vente !`)
                .setThumbnail()
                .setFooter('Veuillez patienter 5 minutes.')


            
                message.channel.send(botembed);
            }
            // Adds the user to the set so that they can't talk for a minute
            talkedRecently.add(message.author.id);
            setTimeout(() => {

                let finembed = new Discord.MessageEmbed()
                .setTitle("Fin vente")
                .setDescription(`${checkMark} ${message.author} Vous avez fini de vendre !`)
                .setThumbnail()

              message.channel.send(finembed)

              talkedRecently.delete(message.author.id);
            }, 60000);

        };

        if(collected.first().emoji.name == '❌') {
            msg.delete()
            let bicon = bot.user.displayAvatarURL;
                let botembed = new Discord.MessageEmbed()
                .setTitle("Action annulée")
                .setDescription(`${checkMark} annulée !`)
                .setThumbnail()
            
                message.channel.send(botembed).then(m => m.delete({ timeout: 5000 }))

        };

        
    }).catch((err) => msg.delete())
    
    } catch (err) {
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
        console.log(err)
    }
    
};
module.exports.config = {
    name: "mineur",
    description: `Effectue la récole/traitement/revente`,
    usage: "/mineur",
    accessableby: "Tous",
    aliases: ['mine']
}
