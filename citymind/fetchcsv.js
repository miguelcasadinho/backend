import puppeteer from 'puppeteer';
import schedule from 'node-schedule';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import fs, { read } from 'fs';
import path from 'path';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});


const fetchData = async () => {

    const readingsFile = './downloads/Read.csv';

    // Check if the file exists and delete it if it does
    if (fs.existsSync(readingsFile)) {
        fs.unlinkSync(readingsFile);
        console.log('File deleted!')
    }
    else {
        console.log('File do not exists!')
    }


    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium', 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const downloadPath = './downloads'; // Define the download folder

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36');
        
        // Create the download directory if it doesn't exist
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath);
        }

        // Navigate to the login page
        await page.goto('https://city-mind.com/default.aspx', { waitUntil: 'networkidle0' });

        // Log the content of the page for debugging
        //const pageContent = await page.content();
        //console.log(pageContent); // Check if the page loaded correctly

        // Wait for the username input to be visible and fill it
        await page.waitForSelector('#AtusLogin_UserName', { visible: true });
        await page.type('#AtusLogin_UserName', process.env.cityMindUser); // Fill username

        // Wait for the password input to be visible and fill it
        await page.waitForSelector('#AtusLogin_Password', { visible: true });
        await page.type('#AtusLogin_Password', process.env.cityMindPass); // Fill password

        // Wait for the login button to be visible and click it
        await page.waitForSelector('#AtusLogin_LoginButton', { visible: true });
        await Promise.all([page.click('#AtusLogin_LoginButton'), page.waitForNavigation({ waitUntil: 'networkidle0' })]);

        // Navigate to the specific report URL
        await page.goto('https://city-mind.com/Pages/ReadReport.aspx?rid=13&from=m')

        // Select values from dropdowns 
        await page.select('#ctl00_mainArea_rpw_srcbr_ddlentity1', '-1');
        await page.select('#ctl00_mainArea_rpw_srcbr_ddlentity2', '-1');

        // Wait for the 'hora da leitura' dropdown and select 'Yesterday'
        await page.waitForSelector('#ctl00_mainArea_rpw_srcbr_ctl54_ddlOperators', { visible: true });
        await page.select('#ctl00_mainArea_rpw_srcbr_ctl54_ddlOperators', 'Yesterday');

        // Wait for the mostrar button to be visible and click it
        await page.waitForSelector('#ctl00_mainArea_rpw_srcbr_btnShow', { visible: true });
        await Promise.all([
            page.click('#ctl00_mainArea_rpw_srcbr_btnShow'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);
   
        // Setup file download behavior before clicking the export button
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath  // Save the file in the download directory
        });

        // Wait for the export csv button to be visible and click it
        await page.waitForSelector('#ctl00_mainArea_rpw_ActionMenu1_pMenu_ctl01_pItem', { visible: true });
        await page.click('#ctl00_mainArea_rpw_ActionMenu1_pMenu_ctl01_pItem');

        // Wait for the file to download (you may want to implement a delay or wait for the file to appear in the directory)
        const csvFilePath = path.join(downloadPath, 'Read.csv'); // Use the actual file name or detect it dynamically

        // Wait until the file appears (you can use a loop to check for the file or set a timeout)
        await new Promise((resolve, reject) => {
            const checkFile = setInterval(() => {
                if (fs.existsSync(csvFilePath)) {
                    clearInterval(checkFile);
                    resolve();
                }
            }, 100); // Check every 100 ms
        });
        console.log('File downloaded successfully!');
    }catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        await browser.close(); 
    }
};



const cleanData = async () => {
    try {
        const csvFilePath = './downloads/Read.csv';
        // Read the CSV file into a variable
        let csvData = fs.readFileSync(csvFilePath, 'utf16le');

        // Transforming the CSV data into an array of objects
        const headers = [
            'Não.',
            'ID de Medidor',
            'Device',
            'Endereço do Imóvel',
            'Nome do Consumidor',
            'Date',
            'Volume',
            'Consumo',
            'Situação do Medidor'
        ];

        // Split the CSV data into rows
        const rows = csvData.split('\n').map(row => row.trim()).filter(row => row.length > 0);

        // Transforming the lines into objects
        const dataArray = rows.map(row => {
            const values = row.split('\t'); // Split by tab character
            const obj = {};
            
            // Create an object mapping headers to values
            headers.forEach((header, index) => {
                obj[header] = values[index] ? values[index].trim() : null; // Remove spaces
            });

            return obj;
        });

        // Log the resulting array
        console.log('Records to insert:', dataArray.length);

        let readings = [];
        const targetDevices = ['9020829','9015063','9016166','9015421','9022436','9015271'];
        const targetDevices4 = ['9020853','9020749','8985615'];
        const targetDevices14 = ['8983557','9051776','8593365','8984678','8593923','8592380','8985180','8985326','8985239','8591276','8594527','8985202','8596716','8592377','8982808','8985154','8597558','8984146','8596182','9051709','8976434','8597351','8985057','8985251','8985238','8988810','8985250','8985303','8984121','8985124','8595865','8985092','8985307','8596179','8593370','8592353','8596643','8590484','8984094','8591491','8591477','8985110','8977918','8985232','8977918','8985110'];
        const targetDevices15 = ['8967071','8985230','8985287','8598029','8593652','8985195','8555352'];
        for (let i=1; i<dataArray.length; i++){
            if (targetDevices.includes(dataArray[i].Device)) {
                const dateParts = dataArray[i].Date.split(/[/ :]/); // Split by /, space, and :
                readings.push({
                    "Date": new Date(dateParts[2], dateParts[1] - 1, dateParts[0], dateParts[3], dateParts[4]),
                    "Device": dataArray[i].Device,
                    "Volume": parseFloat(dataArray[i].Volume)
                });
            }
            else if (targetDevices14.includes(dataArray[i].Device)) {
                const dateParts = dataArray[i].Date.split(/[/ :]/); // Split by /, space, and :
                readings.push({
                    "Date": new Date(dateParts[2], dateParts[1] - 1, dateParts[0], dateParts[3], dateParts[4]),
                    "Device": `${dataArray[i].Device}14`,
                    "Volume": parseFloat(dataArray[i].Volume)
                });
            }
            else if (targetDevices15.includes(dataArray[i].Device)) {
                const dateParts = dataArray[i].Date.split(/[/ :]/); // Split by /, space, and :
                readings.push({
                    "Date": new Date(dateParts[2], dateParts[1] - 1, dateParts[0], dateParts[3], dateParts[4]),
                    "Device": `${dataArray[i].Device}15`,
                    "Volume": parseFloat(dataArray[i].Volume)
                });
            }
            else if (targetDevices4.includes(dataArray[i].Device)) {
                const dateParts = dataArray[i].Date.split(/[/ :]/); // Split by /, space, and :
                readings.push({
                    "Date": new Date(dateParts[2], dateParts[1] - 1, dateParts[0], dateParts[3], dateParts[4]),
                    "Device": `0000${dataArray[i].Device}`,
                    "Volume": parseFloat(dataArray[i].Volume)
                });
            }   
            else {
                const dateParts = dataArray[i].Date.split(/[/ :]/); // Split by /, space, and :
                readings.push({
                    "Date": new Date(dateParts[2], dateParts[1] - 1, dateParts[0], dateParts[3], dateParts[4]),
                    "Device": `00000000${dataArray[i].Device}`,
                    "Volume": parseFloat(dataArray[i].Volume)
                });
            }
        };
        console.log('Clean records to insert:', readings.length);
        return readings;
    }catch (error) {
            console.error('Error fetching data:', error);
    } 
};

// Define an async function to insert readings
const insReadings = async (data) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      const data_tr = new Date();
      const year = data_tr.getFullYear();
      const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
      const day = String(data_tr.getDate()).padStart(2, '0');
      const hour = String(data_tr.getHours()).padStart(2, '0');
      const min = String(data_tr.getMinutes()).padStart(2, '0');
      var formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
      // Iterate over the data and execute insert queries
      for (let i=0; i < data.length ; i++){
          await client.query(`INSERT INTO readings2(device, date, volume)  VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`, 
            [data[i].Device, new Date(data[i].Date), Number(data[i].Volume)]);  
      }
      // Commit the transaction
      await client.query('COMMIT');
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      console.log(`${formattedDate} => ${data.length} readings inserted successfully!`);
      // Release the client back to the pool
      client.release();
    }
  };



const fetch = async() => {
    try {
        await fetchData();
    const csv2obj = await cleanData();
    await insReadings(csv2obj);
    }catch (error) {
        console.error('Error fetch:', error);
    } 
};

/*
//schedule rules
const rule = new schedule.RecurrenceRule();
rule.second = 0; //(0-59, OPTIONAL)
rule.minute = 0; //(0-59)
rule.hour = 0; //(0-23)
rule.date = 1; //(1-31)
rule.month = 1; //(1-12)
rule.dayOfWeek = 0; //(0 - 7) (0 or 7 is Sun)
rule.tz = 'Europe/Lisbon';
*/


const rule = new schedule.RecurrenceRule();
rule.minute = 5; //(0-59)
rule.hour = 7; //(0-23)
// Schedule the tasks
const job = schedule.scheduleJob(rule, fetch);



            
        
