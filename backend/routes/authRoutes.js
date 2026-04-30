const express = require('express');
const router = express.Router();
const { signup, login, getUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/users', protect, adminOnly, getUsers);

module.exports = router;