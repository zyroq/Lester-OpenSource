
  const Discord = require("discord.js");
  const GuildSettings = require("./settings");
  const PremiumKey = require("./premium-key");
  const twitterSettings = require("./twitter");
  const darknetSettings = require("./darknet");
  const economySettings = require("./economy");
  

 function checkVar(text) {

    if(text.includes("{user}")) {
    text = text.replace("{user}", message.author);
    };

    if(text.includes("{user_tag}")) {
      text = text.replace("{user_tag}", message.author.user.tag);
      };

  }


 function checkDb(id) {
    var storedSettings = GuildSettings.findOne({ gid: id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        gid: id
      });
      newSettings.save().catch(()=>{});
      storedSettings = GuildSettings.findOne({ gid: id });
    }

//twitter settings
var tSettings = twitterSettings.findOne({ gid: id });
if (!tSettings) {
  // If there are no settings stored for this guild, we create them and try to retrive them again.
  let newSettings = new twitterSettings({
    gid: id
  });
  newSettings.save().catch(()=>{});
  tSettings = twitterSettings.findOne({ gid: id });
}

//darknet Settings
var dSettings = darknetSettings.findOne({ gid: id });
if (!dSettings) {
  // If there are no settings stored for this guild, we create them and try to retrive them again.
  let newSettings = new darknetSettings({
    gid: id
  });
newSettings.save().catch(()=>{});
  dSettings = darknetSettings.findOne({ gid: id });
}

var eSettings = economySettings.findOne({ gid: id });
if (!eSettings) {
  // If there are no settings stored for this guild, we create them and try to retrive them again.
  let newSettings = new economySettings({
    gid: id
  });
  newSettings.save().catch(()=>{});
  eSettings = economySettings.findOne({ gid: id });
}
  };

module.exports = checkDb()
module.exports = checkVar()
