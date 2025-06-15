import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../utils.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPsw
    }
})

// Verificamos la conexion
transporter.verify((error, success) => {
    if (error) {
        console.error('Error al verificar el transporter:', error);
    } else {
        console.log('Transporter verificado correctamente:', success);
    }
});