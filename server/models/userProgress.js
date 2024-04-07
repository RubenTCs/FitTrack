const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise' // Reference to predefined exercises
    },
    customExercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomExercise' // Reference to custom exercises
    },
    details: {
    kg: { type: Number, default: 0 }, // Weight in kg, default to 0
    reps: { type: Number, default: 0 }, // Number of repetitions, default to 0
    distance: { type: Number, default: 0 }, // Distance in meters, default to 0
    duration: { type: Number, default: 0 } // Duration in seconds, default to 0
    }
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
