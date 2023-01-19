const express = require('express');

// middlewares
const authMiddleware = require('../middlewares/auth.js');

// routes
const authRoutes = require('./AuthRoutes');
const userRoutes = require('./UserRoutes');
const addressRoutes = require('./AddressRoutes');
const foodRoutes = require('./FoodRoutes');
const consultationRoutes = require('./ConsultationRoutes');

const routes = express.Router();

routes.get('/protected', authMiddleware, (req, res) => {
  return res.json({ message: 'Você está logado!' });
});

routes.use('/', userRoutes);
routes.use('/', authRoutes);
routes.use('/', addressRoutes);
routes.use('/', foodRoutes);
routes.use('/', consultationRoutes);

module.exports = routes;
