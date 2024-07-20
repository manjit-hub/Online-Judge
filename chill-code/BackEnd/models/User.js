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
    verified : {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
    },
    solvedProblems:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        default: []
    }],
    Admin:{
        type:Boolean,
        default:false,
    }
}, {timestamps : true});

module.exports = mongoose.model('User', userSchema);
