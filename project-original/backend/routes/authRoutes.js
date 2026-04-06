const express = require('express');
const router = express.Router();
const { register, login, getDemoCredentials } = require('../controllers/authController');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/demo-credentials', getDemoCredentials);

module.exports = router;
