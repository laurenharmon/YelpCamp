const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLM = require("passport-local-mongoose");


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLM);
module.exports = mongoose.model("User", userSchema);