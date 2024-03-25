// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    // Add more fields as needed for fitness tracking data
});

module.exports = mongoose.model('User', userSchema);