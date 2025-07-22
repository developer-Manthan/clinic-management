const express = require('express');
const router = express.Router();
const {
  registerPatient,
  registerDoctor,
  registerAdmin,
  authUser,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');

router.post('/login', authUser);
router.post('/register-patient', registerPatient);

router.post('/register-doctor', protect, authorizeRoles(3), registerDoctor);

router.post('/register-admin', protect, authorizeRoles(3), registerAdmin);

module.exports = router;
