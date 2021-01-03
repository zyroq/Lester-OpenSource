const Discord = require("discord.js")
const addStaff = require("../models/staffData");

module.exports.run = async (bot, message, args) => {
    if(message.author.id === "313768730700152833") {
    
    let member = message.mentions.members.first();
    if(!member) {
        message.channel.send("Aucun utilisateur séléctionné.")
        return
    }
    let staffData = await addStaff.findOne({ user_id: member.id });

    if(!staffData) {
        const newSettings = new addStaff({
            user_id: member.id,
            staff: true
        });
        await newSettings.save().catch(()=>{});
        staffData = await addStaff.findOne({ user_id: member.id });

        let embed = new Discord.MessageEmbed()
        .setDescription(`${member} a été ajouté à la liste du staff de Lester.`)

        message.channel.send(embed)
    }
} else return;
    
};

   module.exports.config = {
    name: "add-staff",
    description: `/`,
    usage: "/",
    accessableby: "Bot Admin",
    aliases: ['']
}