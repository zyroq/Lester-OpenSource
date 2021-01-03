const Discord = require("discord.js")
const blacklist = require("../models/blacklist");

module.exports.run = async (bot, message, args) => {
    
    let role = "776191503457714227";
    let idRole = message.guild.roles.cache.find(x => x.id === role );
    if(!idRole) return;
    if(!message.member.roles.cache.some(r => r.id === role)) return;

   

    if(!args[0]) {
        let embedMenu = new Discord.MessageEmbed()
        .setColor("BLACK")
        .addField("Ajouter un utilisateur", "/blacklist add <id>")
        .addField("Retirer un utilisateur", "/blacklist remove <id>")
        .addField("Consulter un casier d'un utilisateur", "/blacklist show <id>")
        message.channel.send(embedMenu)
        return;
    }

    let messageArray = message.content.split(" ")

    if(args[0] === "add") {
        let userId = args[1];
        if(!userId) return message.channel.send(":x: Veuillez ajouter l'ID d'un utilisateur à la suite de la commande.")
        
        let reasonCase = messageArray.slice(3).join(" ");
        if(!reasonCase) reasonCase = "Non spécifiée."

        let userCase = await blacklist.findOne({ id: userId });
        if(userCase) {
            let embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(":x: Cet utilisateur est déjà blacklist !");
            message.channel.send(embed);
            return;
        }
        let findUser = await bot.users.fetch(`${userId}`);



        const newBalance = new blacklist({
            id: userId,
            moderator: message.author.id,
            reason: reasonCase,
            date: Date.now()
        });
        await newBalance.save().catch(()=>{});
        userCase = await blacklist.findOne({ id: userId });

        let embed = new Discord.MessageEmbed();
        if(findUser) {
            embed.setDescription(`:white_check_mark: L'utilisateur **${findUser.tag}** a été ajouté à la blacklist de Lester avec succès !`);
        } else {
            embed.setDescription(`:white_check_mark: L'ID **${userId}** a été ajouté à la blacklist de Lester avec succès !`);
        };
        message.channel.send(embed);
        return;
    };


    if(args[0] === "remove") {
        let userId = args[1];
        if(!userId) return message.channel.send(":x: Veuillez ajouter l'ID d'un utilisateur à la suite de la commande.")

        let userCase = await blacklist.findOne({ id: userId });
        if(!userCase) {
            let embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(":x: Cet utilisateur/ID n'apparaît pas dans la blacklist !");
            message.channel.send(embed);
            return;
        }
        let findUser = await bot.users.fetch(`${userId}`);

        let delUser = await blacklist.findOneAndDelete({ id: userId });

        if(delUser) {

        let embed = new Discord.MessageEmbed();
        if(findUser) {
            embed.setDescription(`:white_check_mark: L'utilisateur **${findUser.tag}** a été retiré à la blacklist de Lester avec succès !`);
        } else {
            embed.setDescription(`:white_check_mark: L'ID **${userId}** a été retiré à la blacklist de Lester avec succès !`);
        };
        message.channel.send(embed);

    } else {
        message.channel.send(":x: Une erreur s'est produite.")
    }
    return;
    };


    
    if(args[0] === "show") {
        let userId = args[1];
        if(!userId) return message.channel.send(":x: Veuillez ajouter l'ID d'un utilisateur à la suite de la commande.")

        let userCase = await blacklist.findOne({ id: userId });
        if(!userCase) {
            let embed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setDescription("Cet utilisateur/ID n'apparaît pas dans la blacklist.");
            message.channel.send(embed);
            return;
        }
        let findUser = await bot.users.fetch(`${userId}`);

        let embed = new Discord.MessageEmbed();
        if(findUser) {
            embed.setAuthor(`${findUser.tag}`, `${findUser.displayAvatarURL()}`)
            embed.setDescription(`**Casier**\n\nUtilisateur : ${findUser.tag}\nModérateur : ${userCase.moderator}\nDate : ${userCase.date}\nRaison : ${userCase.reason}`)
        } else {
            embed.setAuthor(`${userId}`)
            embed.setDescription(`**Casier**\n\nUtilisateur : ${userId}\nModérateur : ${userCase.moderator}\nDate : ${userCase.date}\nRaison : ${userCase.reason}`)
 
        };
        message.channel.send(embed);
        return;
    };
};

   module.exports.config = {
    name: "blacklist",
    description: `/`,
    usage: "/",
    accessableby: "Bot Admin",
    aliases: ['']
}