const express = require('express');
const router = express.Router();
const { registerUserAdmin, loginUserAdmin, getAdminMe, getProfessors } = require('../controllers/userAdminController')
const { protect, authorize } = require('../middleware/authMiddleware'); 

router.post('/registerAdmin', registerUserAdmin)
router.post('/loginAdmin', loginUserAdmin)
router.get('/meAdmin', getAdminMe) 
router.get('/professors', protect, authorize(['Admin']), getProfessors);

module.exports = router;