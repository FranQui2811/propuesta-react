const jwt = require('jsonwebtoken'); 
const generateToken = (id) => {
    // Utiliza jwt.sign para crear el token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // El token expirará en 30 días
    });
};

module.exports = generateToken;