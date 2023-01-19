const express = require('express');
const AddressController = require('../controllers/AddressController');

const addressRoutes = express.Router();

addressRoutes.get('/addresses', AddressController.findAllAddresses);
addressRoutes.get('/addresses/:address_id', AddressController.findAddressById);
addressRoutes.get(
  '/users/:user_id/addresses',
  AddressController.findAllUserAddresses
);

addressRoutes.post('/users/:user_id/addresses', AddressController.create);

addressRoutes.put('/addresses/:address_id', AddressController.update);

addressRoutes.delete('/addresses/:address_id', AddressController.delete);

module.exports = addressRoutes;
