const Discord = require("discord.js")
const premiumKey = require("../models/premium-key");

module.exports.run = async (bot, message, args) => {
    
    let role = "728518037174616066";
    let idRole = message.guild.roles.cache.find(x => x.id === role );
    if(!idRole) return;
    if(!message.member.roles.cache.some(r => r.id === role)) return;
   message.delete()

    function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  let key1 = makeid(4);
  let key2 = makeid(4);
  let key3 = makeid(4);
  let key4 = makeid(4);

  const theKey = `${key1}-${key2}-${key3}-${key4}`

   const keyVar = new premiumKey({
    key: theKey
  });
   await keyVar.save().catch(()=>{});

   await message.channel.send(`${theKey}`)


   let embed = new Discord.MessageEmbed()
   .setAuthor("Clé premium")
   .setDescription(`Clé : \`${theKey}\``)
   .setColor("GOLD")
   await message.channel.send(embed)
};

   module.exports.config = {
    name: "premium-key",
    description: `/`,
    usage: "/",
    accessableby: "Bot Admin",
    aliases: ['']
}