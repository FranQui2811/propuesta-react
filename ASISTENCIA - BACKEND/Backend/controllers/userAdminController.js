const UserAdmin = require('../model/userAdminModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken'); // Importar el generador de token

const registerUserAdmin = asyncHandler(async(req, res) => {
    // 1. Manejar array de usuarios o un objeto único
    const usersData = Array.isArray(req.body) ? req.body : [req.body];

    if (usersData.length === 0) {
        res.status(400);
        throw new Error('Please provide user data.');
    }

    const createdUsers = await Promise.all(usersData.map(async (userData) => {
        const { fullname, email, password, role } = userData;

        if (!fullname || !email || !password) {
            console.warn(`Skipping user due to missing fields: ${JSON.stringify(userData)}`);
            return null; 
        }

        const userExists = await UserAdmin.findOne({ email });
        if (userExists) {
            console.warn(`User with email ${email} already exists and will be skipped.`);
            return null;
        }

        // 2. Crear el usuario (el model hashea la contraseña)
        // Se respeta el rol si viene (como 'Admin' o 'Professor') o se asigna 'Student'.
        const user = await UserAdmin.create({ 
            fullname, 
            email, 
            password, 
            role: role || 'Student'
        });

        return user;
    }));
    
    const validUsers = createdUsers.filter(user => user !== null);

    if (validUsers.length === 0) {
        res.status(400).json({ message: 'No new users were created. Check for existing emails or missing fields.' });
    } else if (validUsers.length === 1 && !Array.isArray(req.body)) {
        // 3. Respuesta para una sola creación (como en el login inicial de Admin)
        const userAdmin = validUsers[0];
        res.status(201).json({
            _id: userAdmin.id,
            fullname: userAdmin.fullname,
            email: userAdmin.email,
            role: userAdmin.role,
            token: generateToken(userAdmin._id),
        });
    } else {
        // 4. Respuesta para la creación masiva
        res.status(201).json(validUsers.map(u => ({ _id: u._id, fullname: u.fullname, email: u.email, role: u.role })));
    }
});

const loginUserAdmin = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    const userAdmin = await UserAdmin.findOne({ email })

    // Usar matchPassword para comparar el hash
    if (userAdmin && (await userAdmin.matchPassword(password))) { 
        res.json({
            _id: userAdmin.id,
            fullname: userAdmin.fullname,
            email: userAdmin.email,
            role: userAdmin.role,
            token: generateToken(userAdmin._id), // DEVOLVER EL TOKEN
        })
    } else {
        res.status(401)
        throw new Error('Invalid credentials') // Mensaje genérico por seguridad
    }
})

const getAdminMe = asyncHandler(async(req, res) => {
    // req.user es inyectado por el middleware 'protect'
    const { _id, fullname, email, role } = req.user;
    res.status(200).json({
        id: _id,
        fullname,
        email,
        role,
    })
});

module.exports = {
    registerUserAdmin,
    loginUserAdmin,
    getAdminMe,
}