const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
  gid: { type: String },
  user_id: { type: String },
  name: { type: String, default: "Non spécifié" },
  sexe: { type: String, default: "Non spécifié" },
  age: { type: String, default: "Non spécifié" },
  metier: { type: String, default: "Non spécifié" },
  peau: { type: String, default: "Non spécifié" },
  wanted: { type: String, default: "Non" },
  story: { type: String, default: "Non spécifié" },
  caract: { type: String, default: "Non spécifié" },
  p_car: { type: String, default: "Non" },
  p_hel: { type: String, default: "Non" },
  p_boat: { type: String, default: "Non" },
  p_mot: { type: String, default: "Non " },
  p_plane: { type: String, default: "Non" },
  ppa: { type: String, default: "Non" },

});

// We export it as a mongoose model.
module.exports = model("user_card_id", guildSettingSchema);