const jwt = require('jwt-simple');
const moment = require('moment');

module.exports = {
    createToken (user, permisos) 
    {
        const payload = {
            sub: user.idUsuario,
            permiso: permisos,
            iat: moment().unix(),
            exp: moment().add(process.env.TOKEN_DURATION, 'days').unix()
        }
        return jwt.encode(payload, process.env.JWT_SECRET);
    },
    decodeToken(token, require_level) 
    {
      const decoded = new Promise((resolve, reject) => {
        try {
          const payload = jwt.decode(token, process.env.JWT_SECRET);
          if (payload.exp <= moment().unix())
            reject({ status: 403, message: 'Invalid Token' });
          if (payload.permiso < require_level)
            reject({ status: 403, message: 'Permisos insuficientes' });
          resolve(payload.sub);
        }
        catch (err) {
          reject({ status: 403, message: 'Invalid Token' });
        }
      })
      return decoded;
  }
}