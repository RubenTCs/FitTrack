const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        type: Schema.Types.ObjectId,
        ref: 'Exercise', 
    }],
    customexercises: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CustomExercise' // Reference to the CustomExercise model
    }]
});

const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;