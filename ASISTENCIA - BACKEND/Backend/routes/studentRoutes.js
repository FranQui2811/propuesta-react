const express = require('express');
const router = express.Router();
const { getStudents, setStudents, updateStudents, deleteStudents} = require('../controllers/studentController');

// router.get('/', getGoals)
// router.post('/', setGoals)
// router.put('/:id', updateGoals)
// router.delete('/:id', deleteGoals)

// Una forma mas facil de hacerlo
router.route('/').get(getStudents).post(setStudents)
router.route('/:id').put(updateStudents).delete(deleteStudents)

module.exports = router