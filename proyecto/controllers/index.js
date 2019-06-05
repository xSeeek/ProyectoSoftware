/* USUARIO */
const users = require('./users');
const fnUsers = require('./FnUsers');

/* AREAS */
const areas = require('./area');

/* BENEFICIOS */

/* NOTICIAS */

/* CARGOS */
const cargos = require('./cargo');

/* ROLES */

/*NOTIFICACIONES */
const roles = require('./rol');
const notificaciones = require('./notificacion');

module.exports = {
    // Controlladores con referencias unicas
    users,
    areas,
    cargos,
    roles,

    // Controladores con mutiples referencias
    fnUsers,

    // Funcionalidades del sistema
    notificaciones,
};