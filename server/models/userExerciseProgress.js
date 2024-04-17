//useless
const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    routine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Routine',
    },
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
    },
    customExercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CustomExercise'
    },
    sets: [{
            kg: { type: Number }, 
            reps: { type: Number }, 
            distance: { type: Number }, 
            duration: { type: Number }
    }]
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
