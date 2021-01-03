const Discord = require("discord.js")
const GuildSettings = require("../models/settings");
const twitterSettings = require("../models/twitter");
const darknetSettings = require("../models/darknet");
const economySettings = require("../models/economy");


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

                    var settings = await GuildSettings.findOne({ gid: message.guild.id })

                    let prem = false;
                    if(settings.premium === "yes") prem = true;

                    var guildsettings = await GuildSettings.findOneAndDelete({ gid: message.guild.id })
                    var twitter = await twitterSettings.findOneAndDelete({ gid: message.guild.id })
                    var darknet = await darknetSettings.findOneAndDelete({ gid: message.guild.id })
                    var economy = await economySettings.findOneAndDelete({ gid: message.guild.id })

                    if (prem) {
                        // If there are no settings stored for this guild, we create them and try to retrive them again.
                        const newSettings = new GuildSettings({
                          gid: message.guild.id,
                          premium: "yes"
                        });
                        await newSettings.save().catch(()=>{});
                      }

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