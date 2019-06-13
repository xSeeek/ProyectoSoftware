const User = require('../models').Usuario;
const services = require('../services');
const bcrypt = require('bcrypt');
const moment = require('moment');
const crypto = require('crypto-js');
const saltRounds = 10;

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
                if(bcrypt.compareSync(password, usuario.password)){
                    return res.status(200).send({
                        success: true,
                        token: services.createToken(usuario),
                        user: usuario.name,
                        message: "Las contraseñas coinciden"
                    });
                }
                return res.status(400).send({message: "La contraseña no es valida"});
            })
            .catch(error => res.status(400).send({message:'Datos insuficientes para realizar la validación'}));;
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
                    return res.status(200).send({message: 'Ya ha solicitado un cambio de contraseña recientemente'});

                /**
                 * token : Token a enviar al usuario para validar su sesion
                 * bytes : Conversion a bytes del token encriptado
                 * plaintext : Conversion a texto plano de la variable bytes
                 */
                var token = crypto.AES.encrypt(usuario.email + usuario.rut + (new Date()), process.env.JWT_SECRET);
                var bytes  = crypto.AES.decrypt(token.toString(), process.env.JWT_SECRET);
                var plaintext = bytes.toString(crypto.enc.Utf8);

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

                var mailOptions = {
                    to: usuario.email,
                    subject: 'Solicitud de cambio de contraseña',
                    template: 'forgot_password',
                    context: {
                        url: process.env.FRONT_API + 'recuperar?token=' + token.toString(),
                        name: usuario.nombre + ' ' + usuario.a_paterno + ' ' + usuario.a_materno,
                        token: token.toString()
                    }
                };

                if(services.email.sendEmail(mailOptions) == true)
                    return res.status(200).send({ message: 'Verifique su correo para continuar con el cambio de contraseña' });
                return res.status(400).send({message: 'Error al enviar el correo'});
            })
            .catch(error => res.status(500).send(error));
    },
    reset_password(req, res)
    {
        if(req.body.token == null)
            return res.status(400).send({message:'Token no es válido'});
        if(req.body.password == null)
            return res.status(400).send({message:'La nueva contraseña no puede estar en blanco'});

        User.findAll({
            where: {
                    reset_password_token: req.body.token
                },
                plain: true
        }).then(usuario => {
            if(usuario == null)
                return res.status(400).send({message:'Token no es válido'});

            if(new Date() > usuario.reset_password_expires)
            {
                return usuario
                        .update({
                            reset_password_token: null,
                            reset_password_expires: null
                        }).
                        then(res.status(400).send({message:'El token para realizar el cambio de contraseña expiró. Intente nuevamente.'}))
            }

            var salt = bcrypt.genSaltSync(saltRounds);
            return usuario
                        .update({
                            reset_password_token: null,
                            reset_password_expires: null,
                            password: bcrypt.hashSync(req.body.password, salt),
                        }).
                        then(sendMail => {
                            
                            var mailOptions = {
                                to: usuario.email,
                                subject: 'Confirmación cambio de contraseña',
                                template: 'change_password',
                                context: {
                                    name: usuario.nombre + ' ' + usuario.a_paterno + ' ' + usuario.a_materno,
                                    date: (function(){
                                        var date = moment().locale('es').format('LLLL');
                                        return date;
                                    })()
                                }
                            };
                        
                            if(services.email.sendEmail(mailOptions) == true)
                                return res.status(200).send({ message: 'Se ha enviado un correo para confirmar los cambios' });
                            return res.status(400).send({message: 'Error al enviar el correo'});
                        });
        })
        .catch(error => res.status(500).send(error));
    },
    changePassword(req, res)
    {
        if(req.body.newPassword == null || req.body.newPassword == "" || req.body.currentPassword == "" || req.body.currentPassword == null)
            return res.status(400).send({message:'La contraseña no puede estar en blanco.'});

        User
            .findByPk(req.body.idUsuario,
                {
                    plain: true
                })
            .then(user => {
                if(!user)
                    return res.status(400).send({message:'Usuario no existe en el sistema'});
                
                if(!bcrypt.compareSync(req.body.currentPassword, user.password))
                    return res.status(400).send({message:'La contraseña actual no coincide con la que está registrada en el sistema.'});

                if(bcrypt.compareSync(req.body.newPassword, user.password))
                    return res.status(400).send({message:'La nueva contraseña no puede ser igual a la contraseña actual.'});

                var salt = bcrypt.genSaltSync(saltRounds);
                return user
                    .update({
                        password: bcrypt.hashSync(req.body.newPassword, salt)
                    })
                    .then(sendMail => {
                        var mailOptions = {
                            to: user.email,
                            subject: 'Confirmación cambio de contraseña',
                            template: 'change_password',
                            context: {
                                name: user.nombre + ' ' + user.a_paterno + ' ' + user.a_materno,
                                date: (function(){
                                    var date = moment().locale('es').format('LLLL');
                                    return date;
                                })()
                            }
                        };
                    
                        if(services.email.sendEmail(mailOptions) == true)
                            return res.status(200).send({ message: 'Se ha enviado un correo para confirmar los cambios' });
                        return res.status(400).send({message: 'Error al enviar el correo'});
                    })
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
};
