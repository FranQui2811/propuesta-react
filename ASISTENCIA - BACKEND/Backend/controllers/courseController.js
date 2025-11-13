const asyncHandler = require('express-async-handler');
const Course = require('../model/courseModel');
const UserAdmin = require('../model/userAdminModel'); 


const getCourses = asyncHandler(async (req, res) => {
    let filter = {};

    if (req.user.role === 'Student') {
        filter = { students: req.user._id }; 
    } else if (req.user.role === 'Professor') {
        filter = { professor: req.user._id }; 
    }

    const courses = await Course.find(filter)
        .populate('professor', 'fullname email')
        .populate('students', 'fullname email');

    res.status(200).json(courses);
});

const setCourse = asyncHandler(async (req, res) => {
    // 1. Manejar array de cursos o un objeto único
    const coursesData = Array.isArray(req.body) ? req.body : [req.body];

    if (coursesData.length === 0) {
        res.status(400);
        throw new Error('Please provide course data.');
    }

    const createdCourses = await Promise.all(coursesData.map(async (courseData) => {
        const { name, professorId } = courseData;

        if (!name || !professorId) {
            console.warn(`Skipping course due to missing fields: ${JSON.stringify(courseData)}`);
            return null;
        }

        // 2. Verificar que el ID proporcionado sea un usuario con el rol 'Professor'
        const professor = await UserAdmin.findOne({ _id: professorId, role: 'Professor' });
        if (!professor) {
            console.warn(`Skipping course ${name}: Professor ID ${professorId} not found or role is not 'Professor'.`);
            return null;
        }

        // 3. Verificar si el curso ya existe (por nombre único)
        const courseExists = await Course.findOne({ name });
        if (courseExists) {
            console.warn(`Course with name ${name} already exists and will be skipped.`);
            return null;
        }

        // 4. Crear el curso
        const course = await Course.create({ 
            name, 
            professor: professorId, 
        });
        
        // Popular el profesor para la respuesta
        const populatedCourse = await course.populate('professor', 'fullname email');
        return populatedCourse;
    }));
    
    const validCourses = createdCourses.filter(course => course !== null);

    if (validCourses.length === 0) {
        res.status(400).json({ message: 'No new courses were created. Check for existing names or invalid Professor IDs.' });
    } else if (validCourses.length === 1 && !Array.isArray(req.body)) {
        // Respuesta para creación simple
        res.status(201).json(validCourses[0]);
    } else {
        // Respuesta para creación masiva
        res.status(201).json(validCourses);
    }
});




module.exports = {
    getCourses,
    setCourse,
};