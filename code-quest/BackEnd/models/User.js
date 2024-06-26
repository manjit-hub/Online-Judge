const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        default: null,
        required: true, // MUST REQUIRE ELSE SHOW ERROR
    },
    email: {
        type: String,
        default: null,
        required: true,
        unique: true, // EMAIL OF EVERY USER SHOULD BE UNIQUE
    },
    password: {
        type: String,
        required: true,
    },
    solvedProblems:{
        type:Array,
        default:[],
    },
    Admin:{
        type:Boolean,
        default:false,
    }
});

module.exports = mongoose.model('User', userSchema);
