const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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

    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },

    creation_date: {
        type: Date,
        default: Date.now,
    },

    last_login: {
        type: Date,
        default: Date.now,
    },

    valid_account: {
        type: Boolean,
        default: false,
    },

    active: {
        type: Boolean,
        default: false,
    },
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;