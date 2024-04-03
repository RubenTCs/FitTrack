const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    exercises: {
        type: [{
            name: {
                type: String,
                required: true
            },
            sets: {
                type: Number,
                required: true
            },
            reps: {
                type: Number,
                required: true
            },
            weight: {
                type: Number,
                required: true
            }
        }],
        default: []
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;