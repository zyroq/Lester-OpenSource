const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
    gid: { type: String },
    channel: { type: String, default: "0000" },
});

// We export it as a mongoose model.
module.exports = model("ems_settings", guildSettingSchema);