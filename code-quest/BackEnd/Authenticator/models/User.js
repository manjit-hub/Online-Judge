const mongoose = require('mongoose');

const userSchema = new mangoose.Schema({
    fullName: {
        type:String,
        default: null,
        required: true, // MUST REQUIRE ELSE SHOW ERROR
    },
    email: {
        type: String,
        default: null,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
    
});

module.exports = mongoose.model("user", userSchema);