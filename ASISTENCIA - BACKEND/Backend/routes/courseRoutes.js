const express = require('express');
const router = express.Router();
const { getCourses, setCourse, enrollStudent } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Requerir la lógica de protección

router.route('/')
    .get(protect, getCourses) 
    .post(protect, authorize(['Admin']), setCourse) 


module.exports = router;