const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
    gid: { type: String },
    user_id: { type: String },
    item_id: { type: Number },
    quantity: { type: Number, default: -1 },
    item_name: { type: String },
});

// We export it as a mongoose model.
module.exports = model("user_items", guildSettingSchema);