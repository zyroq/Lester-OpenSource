const Discord = require("discord.js")
const GuildSettings = require("../models/settings");
const economySettings = require("../models/economy");
const userBank = require("../models/user-bank");


module.exports.run = async (bot, message, args) => {
    try {
        let msg = await message.channel.send("Récuperation des données..")
        var bankLeaderboard = await userBank.find({ gid: message.guild.id });
        var economy = await economySettings.findOne({ gid: message.guild.id });

        let counter = 0;
    
        const items = (await Promise.all(
          bankLeaderboard.map(async (account) => {
            
            let [owner] = (await bot.shard.broadcastEval(`this.users.cache.get('${account.user_id}')`)).filter(Boolean);
            if(!owner) return;
            counter++
            
            return {
              name: owner.username,
              tag: owner.discriminator,
              banque: account.banque,
              liquide: account.liquide,
              liquide: account.sale,
              total: parseInt(account.banque) + parseInt(account.liquide) + parseInt(account.sale),
              count: counter
            }
          })
        )).filter(Boolean).flat()
    
    
    
              let leaderboardarray = items.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
              var size = 10;
              var leaderboard = leaderboardarray.slice(0, size).map(i => {
                  return `${i.count}. ${i.name}#${i.tag} - Total : \`${n(i.total)}${economy.currency}\``
              });
    
              leaderboard = leaderboard.flat()
              
              let embed = new Discord.MessageEmbed()
              .setTitle(`Classement`)
              .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
              .setColor("ORANGE")
              .setDescription(`${leaderboard.join('\n')}\n\nDécouvrez les **100** premiers du classement, ainsi que plus de détails sur https://lester-bot.fr/${message.guild.id}/leaderboard.`)
              .setFooter(`${message.guild.name}`)
              .setTimestamp()
              
              await msg.edit(" ", embed);
              
              
        function n(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }
} catch(err) {
    const errEmote = bot.emojis.cache.get('706079974687375402');
    const errEmbed = new Discord.MessageEmbed()
    .setDescription(`${errEmote} Une erreur est survenue !\nCode erreur : \`${err}\``)
    .addField('Que faire ?', `Si l'erreur persiste, contactez le support avec le code erreur ci-dessus si possible afin de prévenir les développeurs de la faille, ce qui nous permettra de corriger le soucis. Faites la commande \`/invite\` pour recevoir le lien d'invitation au serveur de support. Vous pouvez également trouver le lien dans la documentation.`)
    message.channel.send(errEmbed);
    console.log(err)

        };
};

module.exports.config = {
    name: "leaderboard",
    description: `Effectue la récole/traitement/revente`,
    usage: "/mineur",
    accessableby: "Tous",
    aliases: ['lb', 'top']
}