'use strict'

const User = require('../models').Usuario;
const services = require('../services');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const crypto = require('crypto-js');
const path = require('path');
const saltRounds = 10;

var email = process.env.MAILER_EMAIL_ID || 'auth_email_address@gmail.com';
var pass = process.env.MAILER_PASSWORD || 'auth_email_pass';

/** 
 * Variables relacionadas con el manejo de correos
*/
var smtpTransport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
    auth: {
        user: email,
        pass: pass
    }
});

/*
var handlebarsOptions = {
    viewEngine: 'express-handlebars',
    viewPath: path.resolve('./templates/'),
    extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));*/

module.exports = {

    authenticate(req, res)
    {
        var email, password;

        email = req.body.email;
        password = req.body.password;

        User.findAll({
            where: {
                email: email
                },
                plain: true
            })
            .then(function(usuario){
                console.log('Password envidada: ' + password + "\nPassword almacenada: " + usuario.password);
                if(bcrypt.compareSync(password, usuario.password)){
                    return res.status(200).send({
                        success: true,
                        token: services.createToken(usuario),
                        user: usuario.name,
                        message: "Las contraseñas coinciden"
                    });
                    }else{
                        return res.status(400).send("Bycrpt catch");
                }
            })
            .catch(error => res.status(400).send({message:'Datos insuficientes para realizar la validacion'}));;
    },
    forgot_password(req, res)
    {
        User.findAll({
                where: {
                    email: req.body.email
                    },
                    plain: true
            }).then(usuario => {
                if(usuario.length == 0)
                    return res.status(400).send({message: 'Usuario no encontrado'});

                if(usuario.reset_password_token != null && new Date() <= usuario.reset_password_expires)
                    return res.status(200).send({message: 'Ya ha solicitado un cambio de password recientemente'});

                /**
                 * token : Token a enviar al usuario para validar su sesion (uso unico pendiente)
                 * bytes : Conversion a bytes del token encriptado
                 * plaintext : Conversion a texto plano de la variable bytes
                 */
                var token = crypto.AES.encrypt((new Date()) + usuario.password, usuario.password);
                var bytes  = crypto.AES.decrypt(token.toString(), usuario.password);
                //var plaintext = bytes.toString(crypto.enc.Utf8);

                User.findByPk(usuario.idUsuario)
                    .then(usuario => {
                        return usuario
                        .update({
                            reset_password_token: token.toString(),
                            reset_password_expires: (function() {
                                var date = new Date();
                                date.setDate(date.getDate() + 1);
                                return date;
                            }()),
                        })
                });

                /*
                var data = {
                    to: usuario.email,
                    from: email,
                    template: './templates/forgot-password-email',
                    subject: 'Solicitud de cambio de password',
                    context: {
                        url: 'http://localhost:3000/api/reset_password?token=' + usuario.reset_password_token,
                        name: usuario.nombre + ' ' + usuario.a_paterno + ' ' + usuario.a_materno
                    },
                    html: "<body><div><h3>Sr(a) " + usuario.nombre + ' ' + usuario.a_paterno + ' ' + usuario.a_materno +",</h3><p>Recientemente ha solicitado un cambio de password, si fue usted utilice el siguiente <a href=" + process.env.APP_URL + 'api/reset_password?token=' + token.toString() + ">enlace</a> para recuperar su password.<br><br>Si no ha solicitado un cambio de password, por favor ignore este mensaje.</p><br><p>Gracias!</p></div></body>" // html body
                };
            
                smtpTransport.sendMail(data, function(err) {
                    if (!err)
                        return res.status(200).send({ message: 'Verifique su correo para continuar con el cambio de password' });
                    return res.status(400).send({message: 'Error al enviar el correo'});
                });
                */

                return res.status(200).send(token.toString());
            })
            .catch(error => res.status(500).send(error));
    },
    reset_password(req, res)
    {
        if(req.body.token == null)
            return res.status(400).send({message:'Token no es valido'});
        if(req.body.password == null)
            return res.status(400).send({message:'La nueva password no puede estar en blanco'});

        User.findAll({
            where: {
                    reset_password_token: req.body.token
                },
                plain: true
        }).then(usuario => {
            if(usuario == null)
                return res.status(400).send({message:'Token no es valido'});

            if(new Date() > usuario.reset_password_expires)
            {
                return usuario
                        .update({
                            reset_password_token: null,
                            reset_password_expires: null
                        }).
                        then(res.status(400).send({message:'El token para realizar el cambio de password expiro. Intente nuevamente.'}))
            }

            var salt = bcrypt.genSaltSync(saltRounds);
            return usuario
                        .update({
                            reset_password_token: null,
                            reset_password_expires: null,
                            password: bcrypt.hashSync(req.body.password, salt),
                        }).
                        then(res.status(200).send({message:'Password cambiada con exito'}))
        })
        .catch(error => res.status(500).send(error));
    }
};
