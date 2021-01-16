const Discord = require("discord.js")
const GuildSettings = require("../models/settings");
const twitterSettings = require("../models/twitter");
const darknetSettings = require("../models/darknet");
const economySettings = require("../models/economy");

const userBank = require("../models/user-bank");
const logsSettings = require("../models/logs");
const robbery = require("../models/robbery");
const lspdSettings = require("../models/lspd");
const emsSettings = require("../models/ems");
const userSettings = require("../models/user-cardId")
const witheningSettings = require("../models/withening-settings")
const joinLeaveSettings = require("../models/join-leave-data")


module.exports.run = async (bot, message, args) => {

    try {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(`Vous n'avez pas les permissions requises !`);
        let filter = m => m.author.id === message.author.id;

        const warn = ':warning:'
        message.channel.send(`${warn} **| Êtes-vous sûr de vouloir réinitialiser les données de Lester ? Cette étape est irréversible.** \`(oui / non)\``).then(msg => {
              
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 90000,
              errors: ['time']
            })
            .then(collected => {
                if (collected.first().content.toLowerCase() == 'oui') {

                    async function resetData() {
                    let msg = await message.channel.send(`**Réinitialisation en cours..** Cette étape peut prendre quelques minutes.`);

                    await GuildSettings.findOneAndDelete({ gid: message.guild.id });
                    await twitterSettings.findOneAndDelete({ gid: message.guild.id });
                    await darknetSettings.findOneAndDelete({ gid: message.guild.id });
                    await lspdSettings.findOneAndDelete({ gid: message.guild.id });
                    await emsSettings.findOneAndDelete({ gid: message.guild.id });
                    await robbery.findOneAndDelete({ gid: message.guild.id });
                    await witheningSettings.findOneAndDelete({ gid: message.guild.id });

                    await msg.edit("Réinitialisation terminée.");
                    
                    };

                    resetData();
                    
            } else if (collected.first().content.toLowerCase() == 'non') {  
                message.channel.send(`Opération annulée.`);      
        }
        }).catch(() =>{
            message.channel.send(`Vous avez mis trop de temps pour répondre.`)
        })
        });
        
        
    } catch (err) {
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
        };
};

module.exports.config = {
    name: "reset",
    description: `Réinitialise les données de Lester pour le serveur.`,
    usage: "/reset",
    accessableby: "Administrateur",
    aliases: ['']
}