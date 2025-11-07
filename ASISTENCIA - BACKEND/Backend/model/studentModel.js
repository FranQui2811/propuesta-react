const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please add a text value']
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Student', studentSchema)