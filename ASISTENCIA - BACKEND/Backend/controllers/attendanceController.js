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

const getAttendance = asyncHandler(async (req, res) => {
    const { courseId, startDate, endDate } = req.query;
    let filter = {};
    
    // Lógica de filtrado por rol
    if (req.user.role === 'Professor') {
        // Profesor solo ve asistencia de los cursos que imparte
        const courses = await Course.find({ professor: req.user._id }).select('_id');
        filter.course = { $in: courses.map(c => c._id) };
    } else if (req.user.role === 'Student') {
        // Estudiante solo ve sus registros. Se filtra después.
        filter['records.student'] = req.user._id; 
    }
    
    // Filtros de consulta
    if (courseId) {
        filter.course = courseId;
    }
    if (startDate && endDate) {
        filter.sessionDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const records = await Attendance.find(filter)
        .populate('course', 'name')
        .populate('professor', 'fullname')
        .populate('records.student', 'fullname email')
        .sort({ sessionDate: -1 });

    // Filtrado final para Estudiantes (para solo mostrar su registro dentro de la sesión)
    let finalRecords = records;
    if (req.user.role === 'Student') {
        finalRecords = records.map(record => ({
            _id: record._id,
            sessionDate: record.sessionDate,
            course: record.course,
            professor: record.professor,
            // Solo devolvemos el registro que le pertenece
            myRecord: record.records.find(r => r.student._id.toString() === req.user._id.toString())
        })).filter(r => r.myRecord); // Solo sesiones donde el estudiante tiene registro
    }

    res.status(200).json(finalRecords);
});

const updateAttendance = asyncHandler(async (req, res) => {
    const attendanceId = req.params.id; // ID de la SESIÓN de asistencia
    const { attendanceRecords } = req.body; // Array de { student: ID, status: 'NewStatus' }

    if (!attendanceRecords || attendanceRecords.length === 0) {
        res.status(400);
        throw new Error('Please provide attendanceRecords to update.');
    }
    
    // Buscar la sesión de asistencia
    const attendance = await Attendance.findById(attendanceId).populate('course');

    if (!attendance) {
        res.status(404);
        throw new Error('Attendance record not found.');
    }

    // 1. Verificar Autorización: Debe ser el profesor que tomó la asistencia o un Admin
    const isAuthorizedProfessor = attendance.professor.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'Admin';
    
    if (!isAuthorizedProfessor && !isAdmin) {
        res.status(403);
        throw new Error('Not authorized to update this attendance record.');
    }

    const validStatuses = ['Present', 'Absent', 'Late/Excused'];

    // 2. Iterar y actualizar el estado de la asistencia
    attendanceRecords.forEach(newRecord => {
        const existingRecord = attendance.records.find(r => r.student.toString() === newRecord.student);
        
        if (existingRecord && validStatuses.includes(newRecord.status)) {
            existingRecord.status = newRecord.status; 
            // Guardar la razón si el estado es Excused y se proporcionó una razón
            if (newRecord.status === 'Late/Excused' && newRecord.excuseReason) {
                existingRecord.excuseReason = newRecord.excuseReason;
            } else {
                existingRecord.excuseReason = undefined; // Limpiar si cambia a Presente/Ausente
            }
        }
    });

    await attendance.save();
    
    // Recargar con populate para una respuesta completa y útil
    const updatedAttendance = await Attendance.findById(attendanceId)
        .populate('course', 'name')
        .populate('records.student', 'fullname email');

    res.status(200).json(updatedAttendance);
});


module.exports = {
    setAttendance,
    getAttendance,
    updateAttendance
};