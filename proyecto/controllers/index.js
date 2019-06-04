const users = require('./users');
const areas = require('./area');
const cargos = require('./cargo');
const roles = require('./rol');
const fnUsers = require('./FnUsers');

module.exports = {

    // Controlladores con referencias unicas
    users,
    areas,
    cargos,
    roles,

    // Controladores con mutiples referencias
    fnUsers,
};