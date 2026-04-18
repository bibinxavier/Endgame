const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Register user
router.post('/register', UserController.register);

// Login user
router.post('/login', UserController.login);

// Logout user
router.post('/logout', UserController.logout);

// Get all modules
router.get('/modules', UserController.getModules);

module.exports = router;