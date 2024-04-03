// exercise.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    exercisename: {
        type: String,
        required: true
    },
    equipment: String,
    type: {
        type: String,
        enum: ['reps', 'repsOnly', 'repsPlusKg', 'repsMinusKg', 'duration', 'distanceDuration', 'kgDistance'],
        required: true
    },
    details: {
        kg: { type: Number, default: 0 }, // Weight in kg, default to 0
        reps: { type: Number, default: 0 }, // Number of repetitions, default to 0
        distance: { type: Number, default: 0 }, // Distance in meters, default to 0
        duration: { type: Number, default: 0 } // Duration in seconds, default to 0
    }
    });

module.exports = mongoose.model('Exercise', exerciseSchema);
