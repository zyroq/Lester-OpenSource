const Discord = require("discord.js")
const userSettings = require("../models/user-cardId")
const Canvas = require('canvas');


module.exports.run = async (bot, message, args) => {
    try {
        let member = message.mentions.members.first() ? message.mentions.members.first() : message.author
        let userA;

        if(member === message.mentions.members.first()) {
            userA = member.user
        }

        if(member === message.author) {
            userA = member
        }

        var identity = await userSettings.findOne({ gid: message.guild.id, user_id: member.id })
        if(!identity) {
            const newID = new userSettings({
              gid: message.guild.id,
              user_id: member.id
            });
            await newID.save()
          }

        let id = new Discord.MessageEmbed()
        .setAuthor(`Citoyen ${userA.username}`, userA.displayAvatarURL())
        .setThumbnail(message.guild.iconURL)
        .setDescription(`―――――――――――――
        **__Identité__**
        
        Nom / Prénom : *${identity.name}*
        Âge : *${identity.age}*
        Sexe : *${identity.sexe}*
        Couleur de peau : *${identity.peau}*

        ―――――――――――――
        **__Permis__**

        Moto : ${identity.p_mot}
        Voiture : ${identity.p_car}
        Bateau : ${identity.p_boat}
        Hélicoptère : ${identity.p_hel}
        Avion : ${identity.p_plane}
        `)
        .setColor('#2F3136')
        .setFooter(`Citoyenneté : ${message.guild.name}`)

        const image = require('./wallpaper.jpg');

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage("./wallpaper.jpg");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
        // Slightly smaller text placed above the member's display name
        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);
    
        // Add an exclamation point here and below
        ctx.font = applyText(canvas, `${message.author.displayName}!`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${message.author.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);
    
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
    
        const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);
    
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    

        await message.channel.send(attachment)
        //identity.wanted
        
    } catch (err) {
        console.log(err)
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "identity",
    description: `Effectuez une action.`,
    usage: "/action <message>",
    accessableby: "Tous",
    aliases: ['']
}