import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { zerogcdataTask } from './class/zerogc.js';
import { zeroregasdataTask } from './class/zeroregas.js';
import nodemailer from 'nodemailer';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.gmailUser,
        pass: process.env.gmailPass
    }
});

const zerogcsendEmail = async (data) => {
    try {
        for (const entry of data) {
            const { local, device, name, morada, consumo } = entry;
            const mailOptions = {
                from: 'mciot.pt@gmail.com',
                to: 'miguel.casadinho@emas-beja.pt',//luis.janeiro@emas-beja.pt,Helio.Placido@emas-beja.pt,pedro.rodrigues@emas-beja.pt',
                subject: 'Anómalia grande cliente',
                text: `Olá, o contador ${device} instalado no local ${local} com o nome ${name} e morada ${morada} teve um consumo de ${consumo} m3 nas últimas 72 horas.`
            };
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        // Consider adding retries or other error handling mechanisms here
    }
};

const zeroregassendEmail = async () => {
    try {
        const mailOptions = {
            from: 'mciot.pt@gmail.com',
            to: 'miguel.casadinho@emas-beja.pt',
            subject: 'Anómalia regas',
            text: 'Bom dia, segue em anexo as regas sem consumos nos últimos 7 dias.',
            attachments: [
                {
                    filename: 'regas.xlsx',
                    path: './class' + '/regas.xlsx',
                    cid: 'uniq-regas.xlsx'
                }
            ]
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        // Consider adding retries or other error handling mechanisms here
    }
};

const diszerogc = async () => {
    try {
        const zerogcdata = await zerogcdataTask();
        await zerogcsendEmail(zerogcdata);
    } catch (error) {
        console.error('Error:', error);
    }
};

const diszeroregas = async () => {
    try {
        const zeroregasdata = await zeroregasdataTask();
        await zeroregassendEmail();
    } catch (error) {
        console.error('Error:', error);
    }
};

export { diszerogc, diszeroregas };
