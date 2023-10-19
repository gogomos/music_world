const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['manager', 'admin'],
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Number,
        default: 0,
    },
    creation_date: {
        type: Date, 
        default: Date.now,
    },
    last_login: {
        type: Date, 
    },
    last_update: {
        type: Date, 
    },
    active: {
        type: Boolean,
        default: true,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
