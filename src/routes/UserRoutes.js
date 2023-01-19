const express = require('express');
const UserController = require('../controllers/UserController');

const userRoutes = express.Router();

userRoutes.post('/users', UserController.create);

userRoutes.get('/users', UserController.findAll);
userRoutes.get('/users/:id', UserController.findById);
userRoutes.get('/users/role/:role', UserController.findByRole);

userRoutes.put('/users/:id', UserController.update);

userRoutes.delete('/users/:id', UserController.delete);

module.exports = userRoutes;
