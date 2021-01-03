const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
  gid: { type: String },
  channel: { type: String },
  time: { type: String, default: false},
  footer: { type: String, default: "Twitter"},
  footer_url: { type: String },
  title: { type: String },
  author: { type: String, default: "{user}" },
  author_url: { type: String }

});

// We export it as a mongoose model.
module.exports = model("twitter_settings", guildSettingSchema);