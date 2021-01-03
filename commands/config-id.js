const Discord = require("discord.js")
const userSettings = require("../models/user-cardId")
const guildSettings = require("../models/settings")


module.exports.run = async (bot, message, args) => {
    try {
        
        var settings = await guildSettings.findOne({ gid: message.guild.id })
        let messageArray = message.content.split(" ")
        let arj = messageArray.slice(3).join(" ");
        let role = settings.role;

        if (!message.member.permissions.has('MANAGE_ROLES')) {


            let idRole = message.guild.roles.cache.find(x => x.id === role );
            if(!idRole) return message.channel.send(`Vous n'avez pas les permissions.`)
            if(!message.member.roles.cache.some(r => r.id === role)) return message.channel.send(`Vous n'avez pas les permissions requises !`)
        }

        let prefix = settings.prefix;
        let member = message.mentions.members.first()
        if(!member) return message.channel.send(`Veuillez mentionner l'utilisateur que vous souhaitez modifier.`)

        var identity = await userSettings.findOne({ gid: message.guild.id, user_id: member.id })
        if(!identity) {
            const newID = new userSettings({
              gid: message.guild.id,
              user_id: member.id
            });
            await newID.save()
            identity = await userSettings.findOne({ gid: message.guild.id, user_id: member.id })
          }

        if(args[1]) {

            if(args[1] === "name") {
                if(!arj) return message.channel.send(`Veuillez spécifier un caractère. Pour en savoir plus, faites \`${prefix}help-config-id\`.`)
                if(arj.lenght > 75) return message.channel.send(`Cela ne peut pas dépasser plus de 50 caractères !`) 
    
               identity.name = arj;
                identity.save() 

            } else if (args[1] === "age") {
                if(!arj) return message.channel.send(`Veuillez spécifier un caractère. Pour en savoir plus, faites \`${prefix}help-config-id\`.`)
                if(arj.lenght > 50) return message.channel.send(`Cela ne peut pas dépasser plus de 50 caractères !`) 
    
                identity.age = arj;
                identity.save() 
            } else if (args[1] === "sexe") {
                if(!arj) return message.channel.send(`Veuillez spécifier un caractère. Pour en savoir plus, faites \`${prefix}help-config-id\`.`)
                if(arj.lenght > 50) return message.channel.send(`Cela ne peut pas dépasser plus de 50 caractères !`) 
    
                identity.sexe = arj;
                identity.save() 
            } else if (args[1] === "metier") {
                if(!arj) return message.channel.send(`Veuillez spécifier un caractère. Pour en savoir plus, faites \`${prefix}help-config-id\`.`)
                if(arj.lenght > 50) return message.channel.send(`Cela ne peut pas dépasser plus de 50 caractères !`) 
    
                identity.metier = arj;
                identity.save() 
            } else if (args[1] === "peau") {
                if(!arj) return message.channel.send(`Veuillez spécifier un caractère. Pour en savoir plus, faites \`${prefix}help-config-id\`.`)
                if(arj.lenght > 50) return message.channel.send(`Cela ne peut pas dépasser plus de 50 caractères !`) 
    
                identity.peau = arj;
                identity.save() 

            } else if (args[1] === "wanted") {

                if(identity.wanted === "Oui"){
                    identity.wanted = "Non";
                    identity.save() 
                } else if (identity.wanted === "Non"){
                    identity.wanted = "Oui";
                    identity.save() 
                    }

            }
/*
    p_mot:"Non",
    p_car:"Non",
    p_boat:"Non",
    p_hel:"Non",
    p_plane:"Non"
*/

            else if (args[1] === "permis-moto") {

                if(identity.p_mot === "Oui"){
                    identity.p_mot = "Non";
                    identity.save() 
                } else {
                    identity.p_mot = "Oui";
                    identity.save() 
                }

            } 
            else if (args[1] === "permis-voiture") {

                if(identity.p_car === "Oui"){
                    identity.p_car = "Non";
                    identity.save()
                     } else {
                        identity.p_car = "Oui";
                        identity.save()                 }

            } 
            else if (args[1] === "permis-bateau") {

                if(identity.p_boat === "Oui"){
                    identity.p_boat = "Non";
                    identity.save()
                     } else {
                        identity.p_boat = "Oui";
                        identity.save()                 }

            } 
            else if (args[1] === "permis-helicoptere") {
                if(identity.p_hel === "Oui"){
                    identity.p_hel = "Non";
                    identity.save()
                     } else {
                        identity.p_hel = "Oui";
                        identity.save()                 }

            } 
            else if (args[1] === "permis-avion") {
                if(identity.p_plane === "Oui"){
                    identity.p_plane = "Non";
                    identity.save()
                     } else {
                        identity.p_plane = "Oui";
                        identity.save()                 }

            } 
            
            
            else if (args[1] === "story") {
            if(!arj) return message.channel.send(`Veuillez spécifier un caractère. Pour en savoir plus, faites \`${prefix}help-config-id\`.`)
            if(arj.lenght > 1000) return message.channel.send(`Cela ne peut pas dépasser plus de 1000 caractères !`) 

            identity.story = arj;
            identity.save() 
        } else if (args[1] === "caract") {
            if(!arj) return message.channel.send(`Veuillez spécifier un caractère. Pour en savoir plus, faites \`${prefix}help-config-id\`.`)
            if(arj.lenght > 500) return message.channel.send(`Cela ne peut pas dépasser plus de 500 caractères !`) 

            identity.caract = arj;
            identity.save() 
            }else {
                return message.channel.send(`:x: Caractères invalides, veuillez réessayer. Pour en savoir plus, faites \`${prefix}help-config-id\`.`)
            }
            message.channel.send(`Changement effectué avec succès.`)
        } else return message.channel.send(`Veuillez spécifier un caractère. Pour en savoir plus, faites \`${prefix}help-config-id\`.`)


    } catch (err) {
        console.log(err)
        const errEmbed = new Discord.MessageEmbed()
        .setDescription(`Une erreur est survenue !\nCode erreur : \`${err}\``)
        .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
        message.channel.send(errEmbed);
    }
}



module.exports.config = {
    name: "config-id",
    description: `Effectuez une action.`,
    usage: "/action <message>",
    accessableby: "Tous",
    aliases: ['']
}