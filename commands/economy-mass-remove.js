const Discord = require("discord.js")
const GuildSettings = require("../models/settings");
const economySettings = require("../models/economy");
const userBank = require("../models/user-bank");
const massAddTime = new Set();


module.exports.run = async (bot, message, args) => {
    try {

        if (massAddTime.has(message.author.id)) {
            message.channel.send("Veuillez patienter 1 minute avant de réutiliser cette commande.").then(msg => msg.delete({ timeout: 3000 }));;
        } else {
        massAddTime.add(message.author.id);

    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if(storedSettings.premium === "no") return;

    var economy = await economySettings.findOne({ gid: message.guild.id });
    let currency = economy.currency

        if(!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) {

            let role = economy.role;

            if(!role) return message.channel.send(`Vous n'avez pas les permissions.`);
            
            let idRole = message.guild.roles.cache.find(x => x.id === role );
            if(!idRole) return message.channel.send(`Vous n'avez pas les permissions.`);
            if(!message.member.roles.cache.some(r => r.id === role)) return message.channel.send(`Vous n'avez pas les permissions requises !`)
        
        };

    
        let role = message.mentions.roles.first();
        let amount;

        let dmGuild = message.guild;
        let memberarray;
        if(!role)  {
            if(args[0] === "everyone") {
                memberarray = dmGuild.members.cache.array();
                role = "@everyone"
            } else return message.channel.send(`:x: **Veuillez mentionner un rôle existant, ou préciser everyone sans mention.**`)

        } else {
            memberarray = role.members.array();
        }
            let type;

        let membercount = memberarray.length;
        let errorCount = 0;
        let successcount = 0;
        
 
        let msgWait = await message.channel.send("Veuillez patienter. Cette opération peut prendre quelques instants.")
        
        for (var i = 0; i < membercount; i++) {
            let member = memberarray[i];

            /*let timeout = Math.floor((Math.random() * (config.wait - 0.01)) * 1000) + 10;
            
            await sleep(timeout);*/

            

            try {
                
                        var balance = await userBank.findOne({ gid: message.guild.id, user_id: member.id });
                        if(!balance) {
                            const newBalance = new userBank({
                                gid: message.guild.id,
                                user_id: member.id,
                                banque: economy.amount_start
                            });
                            await newBalance.save().catch(()=>{});
                            balance = await userBank.findOne({ gid: message.guild.id, user_id: member.id });

                        }

                        if(args[0] === "banque") {
                            amount = args[2]
                            type = balance.banque
                        } else if(args[0] === "liquide") {
                            amount = args[2]
                            type = balance.liquide
            
                        } else if(args[0] === "sale") {
                            amount = args[2]
                            type = balance.sale
            
                        } else {
                            amount = args[1]
                            type = balance.liquide
                        };

                        if(!amount) return message.channel.send(`:x: **Veuillez indiquer la somme que vous souhaitez ajouter !**`)

                        if(isNaN(amount)) return message.channel.send(`:x: **Ce n'est pas un nombre, l'action est donc impossible à réaliser.**`)
                
                        let argent = type

                        let newAmount = parseInt(argent) + parseInt(amount)
                                            
                            if(argent >= amount) {
                                newAmount = parseInt(argent) - parseInt(amount)
                                } else {
                                    newAmount = parseInt(argent) - parseInt(argent)
                                }
                                    
                        
                        if(args[0] === "banque") {
                            balance.banque = newAmount
                        } else if(args[0] === "liquide") {
                            balance.liquide = newAmount
                
                        } else if(args[0] === "sale") {
                            balance.sale = newAmount
                
                        } else {
                            balance.liquide = newAmount
                        };
                
                        await balance.save().catch(()=>{});
                        successcount++;


            } catch (error) {
                ++errorCount
            }
        }

        let embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL)
        .setDescription(`:white_check_mark: Vous venez de retirer avec succès **${n(amount)}${currency}** à ${role} (${successcount} membre(s))`)
        .setTimestamp()
        .setFooter(`Succès : ${successcount} | Echecs : ${errorCount}`)

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        if(msgWait) {
            await msgWait.delete()
        }

        await message.channel.send(embed);

        function n(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }

        let logs = false
        if(logs) {
            let embedLogs = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setAuthor(`Compte banquaire mis à jour`, 'https://zupimages.net/up/20/28/aht6.png')
            .setDescription(`**Utilisateur :** ${user}\n**Effectuée par :** ${message.author}\n**Action :** Ajout d'argent | \`+${n(amount)}\` | ${type}`)
            .setTimestamp()
            logs.send(embedLogs)
            
        } else return;
        
    }
        setTimeout(() => {
    
            massAddTime.delete(message.author.id);
        }, 60000);
    } catch (err) {
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "mass-add-remove",
    description: `Consulter le compte en banque d'un joueur.`,
    usage: "/add-money [type (banque, liquide, sale) <@joueur> <montant>]",
    accessableby: "Tous",
    aliases: ['mass-remove', 'mass-removemoney']
}