const express = require('express');
const router = express.Router();
const { registerUserAdmin, loginUserAdmin, getAdminMe } = require('../controllers/userAdminController')

router.post('/', registerUserAdmin)
router.post('/loginAdmin', loginUserAdmin)
router.get('/meAdmin', getAdminMe)


module.exports = router