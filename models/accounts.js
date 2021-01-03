const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
        gid: { type: String },
        name: { type: String },
        banque: { type: Number, default: 0 },
        owner: { type: String },
        co_owner2: { type: String },
        co_owner3: { type: String }
});

// We export it as a mongoose model.
module.exports = model("accounts", guildSettingSchema);