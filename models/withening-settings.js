const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
    gid: { type: String },
    amount: { type: Number, default: 2000 },
    time: { type: Number, default: 10},
});

// We export it as a mongoose model.
module.exports = model("withening_settings", guildSettingSchema);