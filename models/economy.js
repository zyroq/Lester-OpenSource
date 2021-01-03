const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
  gid: { type: String },
  role: { type: String },
  currency: { type: String, default: "$" },
  amount_start: { type: Number, default: 0 },

});

// We export it as a mongoose model.
module.exports = model("economy_settings", guildSettingSchema);