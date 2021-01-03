const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
    gid: { type: String },
    bank_time: { type: Number, default: 30 },
    bank_amount: { type: Number, default: 100000},
    superette_time: { type: Number, default: 15 },
    superette_amount: { type: Number, default: 15000},
});

// We export it as a mongoose model.
module.exports = model("robbery_settings", guildSettingSchema);