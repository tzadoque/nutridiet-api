const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.js');

module.exports = function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
};
