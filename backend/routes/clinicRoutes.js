const express = require('express');
const router = express.Router();
const { getClinicInfo, updateClinicInfo } = require('../controllers/clinicInfoController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');

router.get('/info', getClinicInfo);

router.put('/info', protect, authorizeRoles(3), updateClinicInfo);

module.exports = router;
