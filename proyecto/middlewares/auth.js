'use strict'

const services = require('../services')

function checkPermission(require_level){
  if(require_level < 0 || require_level > 10)
    require_level = 0;
  return function isAuth (req, res, next) {
    if (!req.headers.authorization) {
      return res.status(403).send({ message: 'Unauthorized' })
    }
    
    const token = req.headers.authorization.split(' ')[1].trim();
    services.token.decodeToken(token, require_level)
      .then(response => {
        req.user = response
        next();
      })
      .catch(response => {
        return res.status(response.status).send({ message: response.message });
      })
  }
}

module.exports = checkPermission;
