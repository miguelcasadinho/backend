import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { zerogcdataTask } from './class/zerogc.js';
import { zeroregasdataTask } from './class/zeroregas.js';
import { unauthdataTask } from './class/unauth.js';
import { falhas4hdataTask } from './class/falhas4h.js';
import { requestdataTask } from './class/request.js';
import { asbestosdataTask } from './class/asbestos.js';
import { dpeirqTask  } from './class/dpeirq.js';
import { execPython } from './class/readings.js';
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
            const { id_service_order, intervencao, int_sintoma, work, morada, data_termino } = entry;
            let now = new Date(data_termino);
            let year = now.getFullYear();
            let month = ('0' + (now.getMonth() + 1)).slice(-2); // Using slice to pad with leading zero
            let day = ('0' + now.getDate()).slice(-2); // Using slice to pad with leading zero
            let hour = ('0' + (now.getHours())).slice(-2); // Using slice to pad with leading zero, and incrementing hour properly
            let minute = ('0' + now.getMinutes()).slice(-2); // Using slice to pad with leading zero
            let second = ('0' + now.getSeconds()).slice(-2); // Using slice to pad with leading zero
            let data = day + '-' + month + '-' + year + ' pelas ' + hour + ':' + minute + ':' + second;
            const formattedDate = `${day}-${month}-${year} ${hour}:${minute}`;
            const mailOptions = {
                from: 'mciot.pt@gmail.com',
                to: 'pedro.rodrigues@emas-beja.pt,luis.janeiro@emas-beja.pt,sabrina.dores@emas-beja.pt,helio.placido@emas-beja.pt,nuno.barnabe@emas-beja.pt',
                bcc: 'miguel.casadinho@emas-beja.pt',
                subject: work,
                html:`
                <h3>Prezados colegas da EMAS de Beja,</h3>
                <p>No dia ${data} a intervenção ${intervencao}, com o sintoma ${int_sintoma} e trabalho ${work}, na morada ${morada} foi concluida, para mais informações consultar a aplicação Navia.</p>
                <a href="https://navia.emas-beja.pt/Tarefas/Intervencoes/verDetalhes.php?id_intervencao=${id_service_order}&referer=consulta_os target="_blank">Visualizar intervenção</a>
                `
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
            to: 'luis.janeiro@emas-beja.pt,Helio.Placido@emas-beja.pt,pedro.rodrigues@emas-beja.pt',
            bcc: 'miguel.casadinho@emas-beja.pt',
            subject: 'Anómalia regas',
            html:`
            <h3>Prezados colegas da EMAS de Beja,</h3>
            <p>Encontrarão em anexo as regas sem consumos nos últimos 7 dias.</p>
            `,
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
                to: 'luis.janeiro@emas-beja.pt,Helio.Placido@emas-beja.pt,pedro.rodrigues@emas-beja.pt',
                bcc: 'miguel.casadinho@emas-beja.pt',
                subject: 'Anómalia grande cliente',
                html:`
                <h3>Prezados colegas da EMAS de Beja,</h3>
                <p>O contador <b>${device}</b> instalado no local <b>${local}</b> com o nome ${name} e morada <i>${morada}</i> teve um consumo de ${consumo} m3 nas últimas 72 horas, para mais informações consultar o local de consumo.</p>
                <a href="http://172.16.16.15:3000/d/c977129a-f05f-45e4-98da-57639a855c52/detalhes-do-contador?orgId=2&var-device=${device}&from=now-7d&to=now" target="_blank">Visualizar local de consumo</a>
                `
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
            const { int_date, id_service_order, numero, sintoma, morada, duracao } = entry;
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
                to: 'artur.janeiro@emas-beja.pt,goncalo.candeias@emas-beja.pt',
                cc: 'gabriela.palma@emas-beja.pt,joao.pirata@emas-beja.pt,j.dias@emas-beja.pt',
                bcc: 'miguel.casadinho@emas-beja.pt',
                subject: `Falha superior a 4 horas`,
                html:`
                <h3>Prezados colegas da EMAS de Beja,</h3>
                <p>No dia ${date}, a intervenção ${numero}, com o sintoma ${sintoma} e morada ${morada}, teve uma interrupção de abastecimento de ${duracao_hours} horas, para mais informações consultar a aplicação Navia.</p>
                <a href="https://navia.emas-beja.pt/Tarefas/Intervencoes/verDetalhes.php?id_intervencao=${id_service_order}&referer=consulta_os target="_blank">Visualizar intervenção</a>
                `
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

const asbestossendEmail = async (data) => {
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    try {
        for (const entry of data) {
            const { id_service_order, number, date, creator, responsible, sympton, address, begin, end, operator1, operator2, operator3, supervisor } = entry;
            let now = new Date(date);
            let year = now.getFullYear();
            let month = ('0' + (now.getMonth() + 1)).slice(-2); // Using slice to pad with leading zero
            let day = ('0' + now.getDate()).slice(-2); // Using slice to pad with leading zero
            let hour = ('0' + (now.getHours() )).slice(-2); // Using slice to pad with leading zero, and incrementing hour properly
            let min = ('0' + now.getMinutes()).slice(-2); // Using slice to pad with leading zero
            let second = ('0' + now.getSeconds()).slice(-2); // Using slice to pad with leading zero
            let int_date = day + '-' + month + '-' + year + ' pelas ' + hour + ':' + min + ':' + second;
            const mailOptions = {
                from: 'mciot.pt@gmail.com',
                to: 'joao.pirata@emas-beja.pt',//'donatila.marques@emas-beja.pt,ricardo.gomes@emas-beja.pt',
                //cc: 'ana.madeira@emas-beja.pt,antonio.conceicao@emas-beja.pt,joao.pirata@emas-beja.pt,carlos.guerreiro@emas-beja.pt',
                bcc: 'miguel.casadinho@emas-beja.pt',
                subject: 'Intervenção em amianto',
                html:`
                <h3>Prezados colegas da EMAS de Beja,</h3>
                <p>No dia ${int_date}, foi executada a ordem de serviço ${number}, com o sintoma ${sympton} e localização em ${address}. Esta intervenção, criada pelo sr. ${creator} e entregue ao sr. ${responsible}, foi efectuada em tubagens contendo amianto, para mais informações consultar a aplicação Navia.</p>
                <a href="https://navia.emas-beja.pt/Tarefas/Intervencoes/verDetalhes.php?id_intervencao=${id_service_order}&referer=consulta_os" target="_blank">Visualizar intervenção</a>
                `
            };
            const info = await transporter.sendMail(mailOptions);
            console.log(`${formattedDate} => Asbestos events executed, Email sent:, ${info.response}`);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        // Consider adding retries or other error handling mechanisms here
    }
};

const readingsSendEmail = async (csv_name) => {
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
            to: 'rui.fernandes@emas-beja.pt',
            bcc: 'miguel.casadinho@emas-beja.pt',
            subject: 'Leituras de telemetria',
            html:`
            <h3>Caro Rui,</h3>
            <p>Segue em anexo o ficheiro csv das leituras de telemetria.</p>
            `,
            attachments: [
                {
                    filename: csv_name,
                    path: '/home/giggo/nodejs/events/' + csv_name,
                    cid: 'csv_name'
                }
            ]
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`${formattedDate} => Readings sent, Email sent:, ${info.response}`);
    } catch (error) {
        console.error('Error sending email:', error);
        // Consider adding retries or other error handling mechanisms here
    }
};

const dpeirqsendEmail = async (data) => {
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    try {
        for (const entry of data) {
            const { id_service_order, number, address, symptom, work, user_execute, date_hour_end } = entry;
            let now = new Date(date_hour_end);
            let year = now.getFullYear();
            let month = ('0' + (now.getMonth() + 1)).slice(-2); // Using slice to pad with leading zero
            let day = ('0' + now.getDate()).slice(-2); // Using slice to pad with leading zero
            let hour = ('0' + (now.getHours() )).slice(-2); // Using slice to pad with leading zero, and incrementing hour properly
            let min = ('0' + now.getMinutes()).slice(-2); // Using slice to pad with leading zero
            let second = ('0' + now.getSeconds()).slice(-2); // Using slice to pad with leading zero
            let int_date = day + '-' + month + '-' + year + ' pelas ' + hour + ':' + min + ':' + second;
            const mailOptions = {
                from: 'mciot.pt@gmail.com',
                to: 'sabrina.amaro@emas-beja.pt,luis.janeiro@emas-beja.pt,helio.placido@emas-beja.pt,pedro.rodrigues@emas-beja.pt,nuno.barnabe@emas-beja.pt',
                //cc: 'joao.pirata@emas-beja.pt',
                bcc: 'miguel.casadinho@emas-beja.pt',
                subject: 'Intervenção DOM concluída',
                html:`
                <h3>Prezados colegas da EMAS de Beja,</h3>
                <p>No dia ${int_date}, foi executada a ordem de serviço ${number}, com o sintoma <b>${symptom}</b> e localização em <i>${address}</i>. Esta intervenção, foi executada pelo sr. ${user_execute} com o trabalho ${work}, para mais informações consultar a aplicação Navia.</p>
                <a href="https://navia.emas-beja.pt/Tarefas/Intervencoes/verDetalhes.php?id_intervencao=${id_service_order}&referer=consulta_os" target="_blank">Visualizar intervenção</a>
                `
                };
            const info = await transporter.sendMail(mailOptions);
            console.log(`${formattedDate} => DPEI Requests to DOM events executed, Email sent:, ${info.response}`);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        // Consider adding retries or other error handling mechanisms here
    }
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

const disasbestos = async () => {
    try {
        const asbestosdata = await asbestosdataTask();
        await asbestossendEmail(asbestosdata);
    } catch (error) {
        console.error('Error:', error);
    }
};

const disdpeirq = async () => {
    try {
        const requests = await dpeirqTask();
        //console.log(requests);
        await dpeirqsendEmail(requests);
    } catch (error) {
        console.error('Error:', error);
    }
};

const disreadings = async () => {
    try {
        const readings = await execPython();
        //console.log(readings);
        await readingsSendEmail(readings);
    } catch (error) {
        console.error('Error:', error);
    }
};

export { disunauth, diszerogc, diszeroregas, disfalhas4h, disrequest, disasbestos, disdpeirq, disreadings };
