const asyncHandler = require('express-async-handler');
const Student = require('../model/studentModel');

const getStudents = asyncHandler(async(req, res) => {
    const students = await Student.find()

    res.status(200).json(students)
})

const setStudents = asyncHandler(async(req, res) => {
    if (!req.body.fullname) {
        res.status(400)
        throw new Error('Please add a text field')
    };

    const students = await Student.create({
        fullname: req.body.fullname
    })
    res.status(200).json(students)
})

const updateStudents = asyncHandler(async(req, res) => {
    const students = await Student.findById(req.params.id)

    if (!students) {
        res.status(400)
        throw new Error('Student not found')
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedStudent)
})

const deleteStudents = asyncHandler(async(req, res) => {
    const students = await Student.findById(req.params.id)

    if (!students) {
        res.status(400)
        throw new Error('Student not found')
    }

    const deletedStudent = await Goal.findByIdAndDelete(req.params.id);

    res.status(200).json(deletedStudent)
})

module.exports = {
    getStudents,
    setStudents,
    updateStudents,
    deleteStudents
}