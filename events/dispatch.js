import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { zerogcdataTask } from './class/zerogc.js';
import { zeroregasdataTask } from './class/zeroregas.js';
import { unauthdataTask } from './class/unauth.js';
import { falhas4hdataTask } from './class/falhas4h.js';
import { requestdataTask } from './class/request.js';
import nodemailer from 'nodemailer';
import TelegramBot from 'node-telegram-bot-api';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.gmailUser,
        pass: process.env.gmailPass
    }
});

const token = process.env.telegramNaviaToken;
const chatId = process.env.telegramNaviachatId;
const bot = new TelegramBot(token, { polling: false });

const unauthsendEmail = async (data) => {
    try {
        for (const entry of data) {
            const { intervencao, int_sintoma, work, morada, data_termino } = entry;
            let now = new Date(data_termino);
            let year = now.getFullYear();
            let month = ('0' + (now.getMonth() + 1)).slice(-2); // Using slice to pad with leading zero
            let day = ('0' + now.getDate()).slice(-2); // Using slice to pad with leading zero
            let hour = ('0' + (now.getHours() + 1)).slice(-2); // Using slice to pad with leading zero, and incrementing hour properly
            let minute = ('0' + now.getMinutes()).slice(-2); // Using slice to pad with leading zero
            let second = ('0' + now.getSeconds()).slice(-2); // Using slice to pad with leading zero
            let data = day + '-' + month + '-' + year + ' pelas ' + hour + ':' + minute + ':' + second;
            const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
            const mailOptions = {
                from: 'mciot.pt@gmail.com',
                to: 'miguel.casadinho@emas-beja.pt,pedro.rodrigues@emas-beja.pt,luis.janeiro@emas-beja.pt,sabrina.dores@emas-beja.pt,helio.placido@emas-beja.pt,nuno.barnabe@emas-beja.pt',
                subject: work,
                text: 'Olá, no dia ' + data + ' a intervenção ' + intervencao + ", com o sintoma " + int_sintoma + " e trabalho " + work + ", na morada "  + morada + " foi concluida."
            };
            const info = await transporter.sendMail(mailOptions);
            console.log(`${formattedDate} => ${work} executed, Email sent:, ${info.response}`);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        // Consider adding retries or other error handling mechanisms here
    }
};

const zeroregassendEmail = async () => {
    try {
        const data_tr = new Date();
        const year = data_tr.getFullYear();
        const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
        const day = String(data_tr.getDate()).padStart(2, '0');
        const hour = String(data_tr.getHours()).padStart(2, '0');
        const min = String(data_tr.getMinutes()).padStart(2, '0');
        const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
        const mailOptions = {
            from: 'mciot.pt@gmail.com',
            to: 'miguel.casadinho@emas-beja.pt,luis.janeiro@emas-beja.pt,Helio.Placido@emas-beja.pt,pedro.rodrigues@emas-beja.pt',
            subject: 'Anómalia regas',
            text: 'Bom dia, segue em anexo as regas sem consumos nos últimos 7 dias.',
            attachments: [
                {
                    filename: 'regas.xlsx',
                    path: '/home/giggo' + '/regas.xlsx',
                    cid: 'uniq-regas.xlsx'
                }
            ]
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`${formattedDate} => Green spaces events executed, Email sent:, ${info.response}`);
    } catch (error) {
        console.error('Error sending email:', error);
        // Consider adding retries or other error handling mechanisms here
    }
};

const zerogcsendEmail = async (data) => {
    try {
        const data_tr = new Date();
        const year = data_tr.getFullYear();
        const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
        const day = String(data_tr.getDate()).padStart(2, '0');
        const hour = String(data_tr.getHours()).padStart(2, '0');
        const min = String(data_tr.getMinutes()).padStart(2, '0');
        const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
        for (const entry of data) {
            const { local, device, name, morada, consumo } = entry;
            const mailOptions = {
                from: 'mciot.pt@gmail.com',
                to: 'miguel.casadinho@emas-beja.pt,luis.janeiro@emas-beja.pt,Helio.Placido@emas-beja.pt,pedro.rodrigues@emas-beja.pt',
                subject: 'Anómalia grande cliente',
                text: `Olá, o contador ${device} instalado no local ${local} com o nome ${name} e morada ${morada} teve um consumo de ${consumo} m3 nas últimas 72 horas.`
            };
            const info = await transporter.sendMail(mailOptions);
            console.log(`${formattedDate} => Big consumers events executed, Email sent:, ${info.response}`);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        // Consider adding retries or other error handling mechanisms here
    }
};

const falhas4hsendEmail = async (data) => {
    try {
        for (const entry of data) {
            const { int_date, numero, sintoma, morada, duracao } = entry;
            let duracao_hours = parseFloat((duracao/60/60).toFixed(2));
            let now = new Date(int_date);
            let year = now.getFullYear();
            let month = ('0' + (now.getMonth() + 1)).slice(-2); // Using slice to pad with leading zero
            let day = ('0' + now.getDate()).slice(-2); // Using slice to pad with leading zero
            let hour = ('0' + (now.getHours() + 1)).slice(-2); // Using slice to pad with leading zero, and incrementing hour properly
            let min = ('0' + now.getMinutes()).slice(-2); // Using slice to pad with leading zero
            let second = ('0' + now.getSeconds()).slice(-2); // Using slice to pad with leading zero
            let date = day + '-' + month + '-' + year + ' pelas ' + hour + ':' + min + ':' + second;
            const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
            const mailOptions = {
                from: 'mciot.pt@gmail.com',
                to: 'miguel.casadinho@emas-beja.pt,artur.janeiro@emas-beja.pt,goncalo.candeias@emas-beja.pt,joao.pirata@emas-beja.pt,gabriela.palma@emas-beja.pt,j.dias@emas-beja.pt',
                subject: 'Falha superior a 4 horas',
                text: 'Olá, no dia ' + date + ' a intervenção ' + numero + ' com o sintoma ' + sintoma + ' e morada '  + morada + ' teve uma interrupção de abastecimento de ' + duracao_hours + ' horas.'            
            };
            const info = await transporter.sendMail(mailOptions);
            console.log(`${formattedDate} => 4 hours failures events executed, Email sent:, ${info.response}`);
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const request2telegram = async (data) => {
    if (data.length > 0) {
        const data_tr = new Date();
        const year = data_tr.getFullYear();
        const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
        const day = String(data_tr.getDate()).padStart(2, '0');
        const hour = String(data_tr.getHours()).padStart(2, '0');
        const min = String(data_tr.getMinutes()).padStart(2, '0');
        const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
        const telegrambot = async (message, body) => {
          try {
            await bot.sendMessage(chatId, `${message}\n<pre>${body}</pre>`, {
              parse_mode: 'HTML'
            });
          } catch (err) {
            console.log('Something went wrong when trying to send a Telegram notification', err);
          }
        };
        for (const { sintoma, requisicao, morada } of data) {
            const message = sintoma;
            const body = `${requisicao}, ${morada}`;
            await telegrambot(message, body);
            console.log(`${formattedDate} => New ${sintoma} requests registed!`);
        };
    };
};

const disunauth = async () => {
    try {
        const unauthdata = await unauthdataTask();
        await unauthsendEmail(unauthdata);
    } catch (error) {
        console.error('Error:', error);
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

const disfalhas4h = async () => {
    try {
        const falhas4hdata = await falhas4hdataTask();
        await falhas4hsendEmail(falhas4hdata);
    } catch (error) {
        console.error('Error:', error);
    }
};

const disrequest = async () => {
    try {
        const requestdata = await requestdataTask();
        await request2telegram(requestdata);
    } catch (error) {
        console.error('Error:', error);
    }
};

export { disunauth, diszerogc, diszeroregas, disfalhas4h, disrequest };
