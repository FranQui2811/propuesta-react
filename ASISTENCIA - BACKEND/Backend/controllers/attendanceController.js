const asyncHandler = require('express-async-handler');
const Attendance = require('../model/attendanceModel');
const Course = require('../model/courseModel');
const UserAdmin = require('../model/userAdminModel');


const setAttendance = asyncHandler(async (req, res) => {
    // attendanceRecords es un array de { student: ID_Estudiante, status: 'Present' }
    const { courseId, sessionDate, attendanceRecords } = req.body; 
    
    if (!courseId || !sessionDate || !attendanceRecords || attendanceRecords.length === 0) {
        res.status(400);
        throw new Error('Please provide courseId, sessionDate, and attendanceRecords.');
    }

    // 1. Verificar que el usuario sea el profesor del curso
    const course = await Course.findById(courseId);
    if (!course || course.professor.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Not authorized to take attendance for this course.');
    }

    // 2. Verificar que no haya asistencia tomada para esta fecha (duplicidad)
    // Buscamos registros de asistencia en el rango de un día completo
    const dateOnly = new Date(sessionDate).setHours(0, 0, 0, 0);
    const existingAttendance = await Attendance.findOne({
        course: courseId,
        sessionDate: { 
            $gte: new Date(dateOnly), 
            $lt: new Date(new Date(dateOnly).setHours(24, 0, 0, 0)) 
        }
    });

    if (existingAttendance) {
        res.status(400);
        throw new Error('Attendance has already been taken for this course on this date.');
    }

    // 3. Crear la nueva asistencia
    let newAttendance = await Attendance.create({
        course: courseId,
        sessionDate: new Date(sessionDate),
        professor: req.user.id,
        records: attendanceRecords, 
    });

    // Opcional: Popular la respuesta para que el frontend obtenga el nombre del curso inmediatamente
    newAttendance = await newAttendance.populate('course', 'name');

    res.status(201).json(newAttendance);
});


module.exports = {
setAttendance
};