import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command(); 

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--persist <mode>', 'modo de persistencia', 'mongo')
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
program.parse();

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path: environment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
});


export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPsw: process.env.GMAIL_APP_PSW,
};