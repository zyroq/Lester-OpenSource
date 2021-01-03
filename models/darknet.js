const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
    gid: { type: String },
    channel: { type: String, default: "0000" },
    time: { type: String, default: false},
    footer: { type: String, default: "Darknet"},
    footer_url: { type: String },
    title: { type: String },
    author: { type: String, default: "• Utilisateur : *********" },
    author_url: { type: String },
});

// We export it as a mongoose model.
module.exports = model("darknet_settings", guildSettingSchema);