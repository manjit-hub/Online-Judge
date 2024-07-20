const mongoose = require('mongoose');

const TempUserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1h' // This will automatically delete the temp user after 1 hour
    }
}, { timestamps: true });

module.exports = mongoose.model("TempUser", TempUserSchema);
