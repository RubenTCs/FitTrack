const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
    exercisename: {
        type: String,
        required: true
    },
    equipment: {
        type: String,
        enum: ['none', 'barbell', 'dumbbell', 'kettlebell', 'machine', 'bodyweight', 'cable', 'medicine ball', 'plate', 'suspension', 'bands', 'other'],
        required: true
    },
    type: {
        type: String,
        enum: ['reps', 'repsOnly', 'repsPlusKg', 'repsMinusKg', 'duration', 'distanceDuration', 'kgDistance'],
        required: true
    },
    muscle: {
        type: String,
        enum: ['chest', 'tricep', 'bicep', 'back', 'shoulder', 'abs', 'hamstring', 'glute', 'calf', 'cardio', 'other'],
        required: true
    },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
