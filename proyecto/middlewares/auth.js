'use strict'

const services = require('../services')

function isAuth (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'Unauthorized' })
  }
  
  const token = req.headers.authorization.split(' ')[1].trim()
  console.log("EL TOKEN ES: "+ token);
  services.token.decodeToken(token)
    .then(response => {
      req.user = response
      next();
    })
    .catch(response => {
      return res.status(response.status).send({ message: response.message });
    })
}

module.exports = isAuth;
