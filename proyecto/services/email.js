const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

/** 
 * Variables relacionadas con el manejo de correos
*/
var email = process.env.MAILER_EMAIL_ID;
var pass = process.env.MAILER_PASSWORD;

var smtpTransport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER,
    auth: {
        user: email,
        pass: pass
    },
    debug: true
});

var options = {
    viewEngine: {
        extname: '.hbs',
        layoutsDir: path.resolve('./emails/'),
        defaultLayout : 'template',
        partialsDir : path.resolve('./emails/partials/')
    },
    viewPath: path.resolve('./emails/templates'),
    extName: '.hbs'
};

smtpTransport.use('compile', hbs(options));

module.exports = {
    sendEmail(emailOptions)
    {
        var errorMail = false;
        smtpTransport.sendMail(emailOptions, (error, info) => {
            console.log(info);
            if (error)
            {
                console.log(error);
                errorMail = true;
            }
        });
        if(errorMail == true)
            return false;
        return true;
    }
}