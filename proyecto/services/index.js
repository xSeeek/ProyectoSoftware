'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = "";

function createToken (user) {
  const payload = {
    sub: user.idUsuario,
    iat: moment().unix(),
    exp: moment().add(process.env.TOKEN_DURATION, 'days').unix()
  }
  return jwt.encode(payload, process.env.JWT_SECRET );
}

function decodeToken (token) {
  const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, process.env.JWT_SECRET)
      if (payload.exp <= moment().unix()) reject({ status: 403, message: 'Invalid Token' });

      resolve(payload.sub);
    }
    catch (err) {
      reject({ status: 403, message: 'Invalid Token' });
    }
  })
  return decoded
}

module.exports = {
  createToken,
  decodeToken
}
