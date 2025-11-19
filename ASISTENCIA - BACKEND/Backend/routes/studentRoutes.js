const express = require('express');
const router = express.Router();
const { getStudents, setStudent, updateStudent, deleteStudent } = require('../controllers/studentManagementController'); 
const { protect, authorize } = require('../middleware/authMiddleware'); 

router.route('/')
    // GET: Listar estudiantes (para Admin/Profesor/Estudiante - Estudiante para verificar su propio perfil)
    .get(protect, getStudents) 
    // POST: Crear Estudiante (Solo Admin)
    .post(protect, authorize(['Admin', 'Professor']), setStudent) 

router.route('/:id')
    // PUT: Actualizar estudiante (Admin/Professor)
    .put(protect, authorize(['Admin', 'Professor']), updateStudent)
    // DELETE: Eliminar estudiante (Solo Admin)
    .delete(protect, authorize(['Admin']), deleteStudent)

module.exports = router;