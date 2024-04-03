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
    ref: 'Exercise'
    }]
});

const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;