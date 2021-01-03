const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
        user_id: { type: String },
        staff: { type: String },
        support: { type: String },
        billing: { type: String },
        admin: { type: String },
});

// We export it as a mongoose model.
module.exports = model("staffData", guildSettingSchema);