const express = require('express');
const AuthController = require('../controllers/AuthController');

const authRoutes = express.Router();

authRoutes.post('/auth/login', AuthController.login);

module.exports = authRoutes;
