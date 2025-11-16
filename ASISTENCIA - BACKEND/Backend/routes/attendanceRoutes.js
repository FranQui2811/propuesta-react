const express = require('express');
const router = express.Router();
const { setAttendance, getAttendance, updateAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    // GET: Todos los roles pueden consultar
    .get(protect, getAttendance) 
    // POST: Solo Profesores pueden tomar asistencia
    .post(protect, authorize(['Professor']), setAttendance)

router.route('/:id')
    .put(protect, authorize(['Admin', 'Professor']), updateAttendance)

module.exports = router;