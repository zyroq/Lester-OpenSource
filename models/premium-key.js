const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
  key: { type: String },
  date: { type: Number, default: Date.now() },
  user: { type: String }
});

// We export it as a mongoose model.
module.exports = model("premium_code", guildSettingSchema);