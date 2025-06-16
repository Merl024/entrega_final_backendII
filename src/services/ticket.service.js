import { ticketModel } from '../models/ticket.model.js';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPsw
    }
});

export const generateTicket = async ({ user, products, amount }) => {
    // 1. Crear ticket en la base de datos
    const ticket = await ticketModel.create({
        code: uuidv4(),
        amount,
        purchaser: user.email,
        products
    });

    // 2. Enviar factura al correo del usuario
    await transporter.sendMail({
        from: config.gmailAccount,
        to: user.email,
        subject: 'Factura de compra',
        html: `
            <h2>¡Gracias por tu compra!</h2>
            <p>ID de compra: <b>${ticket.code}</b></p>
            <p>Total: <b>$${ticket.amount}</b></p>
            <ul>
                ${products.map(p => `<li>${p.product.title} x ${p.quantity}</li>`).join('')}
            </ul>
            <p>Fecha: ${ticket.purchase_datetime.toLocaleString()}</p>
        `
    });

    return ticket;
};