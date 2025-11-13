const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userAdminSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add a email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    // Rol añadido para la lógica de negocio (Admin, Professor, Student)
    role: { 
        type: String,
        enum: ['Admin', 'Professor', 'Student'],
        default: 'Student'
    }
}, {
    timestamps: true 
});

// Middleware (Hook): Hashear la contraseña antes de guardar
userAdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar la contraseña hasheada en el login
userAdminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('UserAdmin', userAdminSchema);