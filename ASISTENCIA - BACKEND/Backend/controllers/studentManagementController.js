const asyncHandler = require('express-async-handler');
const UserAdmin = require('../model/userAdminModel'); 

const getStudents = asyncHandler(async(req, res) => {
    // Solo buscar usuarios con rol 'Student'
    const students = await UserAdmin.find({ role: 'Student' }).select('-password'); 
    res.status(200).json(students);
});

const setStudent = asyncHandler(async(req, res) => {
    // Verifica si req.body es un array (para múltiples) o un objeto (para uno)
    const studentsData = Array.isArray(req.body) ? req.body : [req.body];
    
    if (studentsData.length === 0) {
        res.status(400);
        throw new Error('Please include at least one student or an array of students.');
    }

    // Usaremos Promise.all para crear todos los estudiantes en paralelo,
    // garantizando que se ejecute el hasheo de contraseña antes de guardar cada uno.
    const createdStudents = await Promise.all(studentsData.map(async (student) => {
        const { fullname, email, password } = student;

        if (!fullname || !email || !password) {
            // Se asume que la validación de campos obligatorios es necesaria
            throw new Error(`Missing fields in one student record: ${JSON.stringify(student)}`);
        }

        const userExists = await UserAdmin.findOne({ email });
        if (userExists) {
            // Puede querer manejar esto con un log y omitir, o lanzar un error. 
            // Para fines de inicialización, es mejor omitir el que ya existe.
            console.warn(`User with email ${email} already exists and will be skipped.`);
            return null; 
        }

        // El rol 'Student' se asigna por defecto en el modelo si no se especifica.
        return UserAdmin.create({ fullname, email, password });
    }));
    
    // Filtrar los nulos (usuarios que ya existían)
    const validStudents = createdStudents.filter(student => student !== null);

    if (validStudents.length === 0) {
        res.status(400).json({ message: 'No new students were created. Check for existing emails.' });
    } else {
        res.status(201).json(validStudents.map(s => ({ _id: s._id, fullname: s.fullname, email: s.email })));
    }
});

const updateStudent = asyncHandler(async(req, res) => {
    const student = await UserAdmin.findOne({ _id: req.params.id, role: 'Student' });

    if (!student) {
        res.status(404);
        throw new Error('Student not found or user is not a Student.');
    }
    
    // Se excluye la actualización del rol y password aquí, se manejan los demás campos.
    const { password, role, ...updateFields } = req.body; 

    const updatedStudent = await UserAdmin.findByIdAndUpdate(req.params.id, updateFields, {
        new: true,
    }).select('-password'); 

    res.status(200).json(updatedStudent);
});

const deleteStudent = asyncHandler(async(req, res) => {
    const student = await UserAdmin.findOne({ _id: req.params.id, role: 'Student' });

    if (!student) {
        res.status(404);
        throw new Error('Student not found or user is not a Student.');
    }

    await UserAdmin.deleteOne({ _id: req.params.id });

    res.status(200).json({ id: req.params.id, message: 'Student deleted successfully' });
});


module.exports = {
    getStudents,
    setStudent,
    updateStudent,
    deleteStudent
};