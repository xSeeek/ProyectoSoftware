/* USUARIO */
const users = require('./users');
const fnUsers = require('./FnUsers');

/* AREAS */
const areas = require('./area');

/* BENEFICIOS */
const beneficios = require('./beneficio');

/* NOTICIAS */
const noticias = require('./noticia');

/* CARGOS */
const cargos = require('./cargo');

/* ROLES */
const roles = require('./rol');

/*NOTIFICACIONES */
const notificaciones = require('./notificacion');

module.exports = {
    // Controlladores con referencias unicas
    users,
    areas,
    cargos,
    roles,
    beneficios,
    noticias,

    // Controladores con mutiples referencias
    fnUsers,

    // Funcionalidades del sistema
    notificaciones
};