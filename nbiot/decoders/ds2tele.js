import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import TelegramBot from 'node-telegram-bot-api';

// Carregar as variáveis de ambiente
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const token = process.env.telegramGiggoToken;
const chatId = process.env.telegramGiggochatId;

const bot = new TelegramBot(token, { polling: false });

// Função que verifica se deve haver um alarme
function isAlarm() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Domingo, 6 = Sábado

    const isNight = hour >= 19 || hour < 7;
    const isWeekend = day === 0 || day === 6;

    return isWeekend || (!isWeekend && isNight) ? "Alarm" : "No Alarm";
}

// Função para enviar mensagem ao Telegram
const alarm2telegram = async (data) => {
    const data_tr = new Date();
    const formattedDate = data_tr.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit'
    });

    const telegrambot = async (message, body) => {
        try {
            await bot.sendMessage(chatId, `${message}\n<pre>${body}</pre>`, {
                parse_mode: 'HTML'
            });
        } catch (err) {
            console.error('Error sending Telegram notification:', err);
        }
    };

    const asset = data.asset;
    const status = data.door_status;

    if (status === 1){
        const text = `${asset} - A porta foi aberta`;
        const message = 'Alarme de intrusão';
        const body = text;
    
    await telegrambot(message, body);
    console.log(`${formattedDate} => ${asset} - Intrusion alarm sent!`);
    }
    
};

// Decodifica a mensagem e verifica se é necessário enviar um alarme
const ds2teleDecoder = (message) => {
    try {
        const alarm = isAlarm();
        if (alarm === 'Alarm') {
            alarm2telegram(message);
        } else {
            //console.log('No alarm triggered.');
        }
    } catch (error) {
        console.error("Error decoding message:", error);
        return null;
    }
};

export { ds2teleDecoder };
