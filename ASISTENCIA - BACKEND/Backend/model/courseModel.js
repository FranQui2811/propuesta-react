const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a course name'],
        unique: true
    },
    professor: { // Referencia al usuario (rol Professor)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAdmin', 
        required: [true, 'Please assign a professor']
    },
    students: [{ // Array de estudiantes matriculados (rol Student)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAdmin' // Utilizamos UserAdmin para todos los actores
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);