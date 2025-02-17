import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import { Parser } from 'json2csv'; 
import XLSX from 'xlsx';
import fs from 'fs';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});


// Define an async function to get readings
const getReadings = async () => {
    const query = {
        text: `
        SELECT 
            ROW_NUMBER() OVER () AS "Não.",
            resultado_final."Cliente",
            resultado_final."Morada",
            resultado_final."ID de Medidor",
            resultado_final."ID do Consumidor",
            resultado_final."N/S Medidor",
            resultado_final."ID Imovel",
            resultado_final."Leitura1",
            resultado_final."Ultima Leitura"
        FROM (
            SELECT
                distinct on (device)
                REPLACE(infocontrato.name, ',', ' ') as "Cliente",
                CONCAT(infocontrato.street,' ',infocontrato.num_pol, ' ',infocontrato.floor) as "Morada",
                infocontrato.local as "ID de Medidor",
                infocontrato.client as "ID do Consumidor",
                device as "N/S Medidor",
                clients.building as "ID Imovel",
                volume as "Leitura1",
                date as "Ultima Leitura"            
            FROM 
                volume
            LEFT JOIN (
                SELECT 
                    infocontrato.local,
                    infocontrato.client,
                    infocontrato.name,
                    infocontrato.street,
                    infocontrato.num_pol,
                    infocontrato.floor,
                    infocontrato.device as dev
                FROM 
                    infocontrato) AS infocontrato
                ON volume.device = infocontrato.dev
            left join (
                select 
                    clients.sensitivity, 
                    clients.building, 
                    clients.ramal, 
                    clients.client,
                    clients.situation
                from 
                    clients) as clients
                on infocontrato.client = clients.client
            left join (
                select 
                    ramaisrua.zmc, 
                    ramaisrua.ramal as ram 
                from 
                    ramaisrua) as ramaisrua
                on clients.ramal = ramaisrua.ram
            WHERE
            volume.date > now() - interval '15 days'
            AND
            (clients.situation != 'LIQUIDADO' or clients.situation != 'ANULADO')
            AND
            device != '8868310'
            order by 
                device, 
                date desc
            ) AS resultado_final;`
    };
  
    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw new Error('Failed to execute query');
    }
};

const changeFormat = async (values) => {
    try {
        for (let i = 0; i < values.length; i++){
            // Obter as partes da data
            const day = String(values[i]['Ultima Leitura'].getUTCDate()).padStart(2, '0');
            const month = String(values[i]['Ultima Leitura'].getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0, por isso soma 1
            const year = values[i]['Ultima Leitura'].getUTCFullYear();

            // Obter as partes do horário
            const hours = String(values[i]['Ultima Leitura'].getUTCHours()).padStart(2, '0');
            const minutes = String(values[i]['Ultima Leitura'].getUTCMinutes()).padStart(2, '0');

            // Formatar a data no estilo desejado
            values[i]['Ultima Leitura'] = `${day}/${month}/${year} ${hours}:${minutes}`;
            values[i]['Leitura1'] = Math.round(values[i]['Leitura1']);
        }
        return values;
    } catch (error) {
        console.error('Error in changeFormat: ', error);
    }
}

const changeQuotation = async (documents) => {
    try {
        // Extract values 
        const rows = documents.map((doc) => Object.values(doc));
        
        // Format rows 
        const processedData = rows.map(row => {
            return row.map((value) => {
                return String(value).replace(/"/g, '').trim(); // Remove quotes, trim spaces
            }).join(','); // Join values 
        }).join('\n'); // Join all rows with a new line
        
        return processedData;
    } catch (error) {
        console.error('Error in changeQuotation: ', error);
    }
}



const createCsv = async (documents) => {
    try {
        // Configure the parser with a tab as the delimiter
        const json2csvParser = new Parser({ delimiter: '\t' });
        const csv = json2csvParser.parse(documents);
        // Dynamic filename with timestamp
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15); 
        const filename = `csv_${timestamp}.csv`;
        // Save the CSV with UTF-16le encoding
        fs.writeFile(`/home/giggo/nodejs/events/${filename}`, csv, 'utf16le', (err) => {
            if (err) {
              console.error('Error saving CSV file:', err); 
              return; // Exit the callback if there's an error
            }
            console.log(`CSV file has been saved as ${filename}.`);
          });
        return filename; 
    } catch (error) {
        console.error('Error in createCsv:', error);
    }

}

const createCsv2 = async (rows) => {
    try {
        // Dynamic filename with timestamp
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15); 
        const filename = `csv_${timestamp}.csv`;
        // Save the CSV with UTF-16LE encoding
        fs.writeFile(`/home/giggo/nodejs/events/${filename}`, rows, 'utf16le', (err) => {
            if (err) {
              console.error('Error saving CSV file:', err); 
              return; // Exit the callback if there's an error
            }
            console.log(`CSV file has been saved as ${filename}.`);
          });
        return filename; 
    } catch (error) {
        console.error('Error in createCsv:', error);
    }

}

const updateCsv = async (rows) => {
    try {
        // Read the existing file content
        const existingContent = fs.readFileSync('/home/giggo/nodejs/events/base.csv', 'utf16le');

        // Split the content into lines to separate header and body
        const lines = existingContent.split('\n');

        // Preserve the first line (header)
        const header = lines[0];

        // Combine the header with the new content
        const newContent = [header, rows].join('\n');

        // Save the CSV with UTF-16LE encoding
        fs.writeFile(`/home/giggo/nodejs/events/base.csv`, newContent, 'utf16le', (err) => {
            if (err) {
              console.error('Error saving CSV file:', err); 
              return; // Exit the callback if there's an error
            }
            console.log(`CSV file has been updated.`);
          });
    } catch (error) {
        console.error('Error in createCsv:', error);
    }
}

const updateXlsx = async (rows) => {
    try {
        // Read the existing file content
        const filePath = '/home/giggo/nodejs/events/base.csv';
        const workbook = XLSX.readFile(filePath);

        // Select the first sheet in the workbook
        const sheetName = workbook.SheetNames[0]; // Get the name of the first sheet
        const worksheet = workbook.Sheets[sheetName];

        console.log(worksheet['B2']);
        worksheet['B2'].t = 'n';
        worksheet['B2'].w = '123';
        worksheet['B2'].v = 123; // Update the raw value
        
        // Write the updated workbook back to the file
        XLSX.writeFile(workbook, filePath);
        console.log(worksheet['B2']);

        /*
            // Update specific cells in the worksheet
            updates.forEach(({ cell, value }) => {
                if (worksheet[cell]) {
                    // Update the existing cell
                    worksheet[cell].v = value; // Update the raw value
                    worksheet[cell].w = String(value); // Update the formatted value (optional)
                } else {
                    // If the cell does not exist, create it
                    worksheet[cell] = {
                        t: typeof value === 'string' ? 's' : 'n', // Set the type based on value
                        v: value,
                        w: String(value), // Set the formatted value (optional)
                    };
                }
            });
    
            // Write the updated workbook back to the file
            XLSX.writeFile(workbook, filePath);

        */



    } catch (error) {
        console.error('Error in XLSS:', error);
    }

}

const readingsTask = async () => {
    try {
        const readings = await getReadings();
        const form_readings = await changeFormat(readings);
        //console.log(form_readings);
        //const changeQuotes = await changeQuotation(form_readings);
        //console.log(changeQuotes);
        //const update_file = await updateXlsx(form_readings);
        //const save_file = await createCsv2(changeQuotes);
        const save_file = await createCsv(readings);
        //return save_file;
    } catch (error) {
        // Handle any errors in the Promise chain
        console.error('Error in readingsTask:', error);
    }
};

export { readingsTask };
readingsTask();