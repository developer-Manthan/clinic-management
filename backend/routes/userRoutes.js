const express = require('express');
const router = express.Router();
const { getAllDoctors } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');

router.get('/doctors', protect, authorizeRoles(3), getAllDoctors);

module.exports = router;
