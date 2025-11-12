const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const UserAdmin = require('../model/userAdminModel');

// 1. Middleware para verificar el token JWT y adjuntar el usuario
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Obtener token del encabezado (ej. "Bearer eyJhbG...")
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token con la clave secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener el usuario del payload del token (decoded.id)
            // Se usa .select('-password') para excluir la contraseña del objeto req.user
            req.user = await UserAdmin.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// 2. Middleware para Control de Acceso basado en Roles (RBAC)
const authorize = (roles = []) => {
    // roles debe ser un array (ej: ['Admin', 'Professor'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        // Verificar si el rol del usuario actual (req.user.role) está en la lista de roles permitidos
        if (!roles.includes(req.user.role)) {
            res.status(403); // 403 Forbidden
            throw new Error(`User role (${req.user.role}) is not authorized to access this route`);
        }
        next();
    };
};

module.exports = { protect, authorize };