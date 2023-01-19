const express = require('express');
const FoodController = require('../controllers/FoodController');

const foodRoutes = express.Router();

foodRoutes.get('/foods/name/', FoodController.findFoodsByName);
foodRoutes.get('/foods', FoodController.findAllFoods);
foodRoutes.get('/foods/:food_id', FoodController.findFoodById);

foodRoutes.post('/foods', FoodController.create);

foodRoutes.put('/foods/:food_id', FoodController.update);

foodRoutes.delete('/foods/:food_id', FoodController.delete);

module.exports = foodRoutes;
