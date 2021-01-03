const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
  gid: { type: String },
  user_id: { type: String },
  liquide: { type: Number, default: 0 },
  banque: { type: Number, default: 0 },
  sale: { type: Number, default: 0 },
});

// We export it as a mongoose model.
module.exports = model("user_bank", guildSettingSchema);