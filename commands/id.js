const Discord = require("discord.js")
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {
    try {
    

        if(args[0] === "channel") {
            await message.channel.send(`${message.channel.id}`)

            let guildId = new Discord.MessageEmbed()
            .setDescription(`ID du salon : \`${message.channel.id}\``)

            await message.channel.send(guildId)
            return;
            } else {
                await message.channel.send(`${message.guild.id}`);

                let guildId = new Discord.MessageEmbed()
                .setDescription(`ID du serveur : \`${message.guild.id}\``);
    
                await message.channel.send(guildId);
                return;
            }

            

    } catch (err) {
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "id",
    description: `/`,
    usage: "/",
    accessableby: "Tous",
    aliases: ['']
}