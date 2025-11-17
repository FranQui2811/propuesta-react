const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    course: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    sessionDate: { // Fecha específica de la clase
        type: Date,
        required: true
    },
    professor: { // Profesor que tomó la asistencia
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAdmin',
        required: true
    },
    records: [{ // Array con el estado de asistencia de cada estudiante
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserAdmin',
            required: true
        },
        status: { // Presente, Ausente, Tarde/Excusado
            type: String,
            enum: ['Present', 'Absent', 'Late/Excused', 'presente', 'ausente', 'excusa'],
            default: 'Absent'
        },
        excuseReason: { // Razón de la excusa si el status es 'Late/Excused'
            type: String,
            required: false // Opcional
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);