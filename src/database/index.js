const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/Users');
const Address = require('../models/Addresses');
const Foods = require('../models/Foods');

const connection = new Sequelize(dbConfig);

User.init(connection);
Address.init(connection);
Foods.init(connection);

User.associate(connection.models);
Address.associate(connection.models);

module.exports = connection;
