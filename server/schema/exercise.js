const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    exerciseName: {
        type: String,
        required: true,
    },
    muscleCategory: {
        type: String,
        required: true,
    },
    equipment: {
        type: String,
        required: true,
    },
    exerciseType: {
        type: String,
        required: true,
    },
    }
    
);

const User = mongoose.model('User', userSchema);
module.exports = User;