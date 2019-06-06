'use strict'

const User = require('../models').Usuario;
const services = require('../services');
const bcrypt = require('bcrypt');


var tokensillo = {
    id: 2,
    name: "vicente"
}
module.exports = {

  authenticate(req, res)
    {
        console.log("Hola " + services.createToken(tokensillo));
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
                    })
                    }else{
                        return res.status(400).send("Bycrpt catch")
                    ;
                }
            })
            .catch(error => res.status(400).send({message:'Datos insuficientes para realizar la validacion'},));;
    },
  
};
