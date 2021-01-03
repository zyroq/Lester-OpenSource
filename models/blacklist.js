const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
        id: { type: String },
        date: { type: Date, default: Date.now },
        reason: { type: String, default: "Non précisée."},
        moderator: { type: String },
});

// We export it as a mongoose model.
module.exports = model("blacklist", guildSettingSchema);