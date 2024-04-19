const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const setSchema = new Schema({
    kg: { type: Number},
    reps: { type: Number },
    distance: { type: Number },
    duration: { type: String }
});

const routineSchema = new Schema({
    routinename: {
        type: String,
        required: true
    },
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exercises: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Exercise'
        },
        sets: [setSchema] // Array of sets for each exercise
    }],
    customexercises: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'CustomExercise'
        },
        sets: [setSchema] // Array of sets for each custom exercise
    }]
});

const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;