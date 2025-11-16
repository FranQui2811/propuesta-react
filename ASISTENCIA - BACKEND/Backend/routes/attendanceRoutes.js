const express = require('express');
const router = express.Router();
const { setAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    // POST: Solo Profesores pueden tomar asistencia
    .post(protect, authorize(['Professor']), setAttendance)

module.exports = router;