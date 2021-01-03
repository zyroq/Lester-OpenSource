const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
        bot: { type: String, default: "lester" },
        commandsCounter: { type: Number, default: 0 },
});

// We export it as a mongoose model.
module.exports = model("botData", guildSettingSchema);