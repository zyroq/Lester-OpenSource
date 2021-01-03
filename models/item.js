const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
    gid: { type: String },
    item_id: { type: Number },
    item_name: { type: String },

});

// We export it as a mongoose model.
module.exports = model("userItems", guildSettingSchema);