const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
        gid: { type: String },
        joinChannel: { type: String },
        leaveChannel: { type: String },
        joinMessage: { type: String, default: "Bienvenue {user}" },
        leaveMessage: { type: String, default: "Aurevoir {user}" }


});

// We export it as a mongoose model.
module.exports = model("join-leave-data", guildSettingSchema);