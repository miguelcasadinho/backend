import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import ExcelJS from 'exceljs';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const pool = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

const query = `
select distinct on (volume.device) infocontrato.local, volume.device, infocontrato.name, infocontrato.morada, volume.date, volume.volume - vol72.vol72 as consumo, volume.volume
from volume 
left join (
  select infocontrato.local, infocontrato.device, infocontrato.name, CONCAT(infocontrato.street,' ',infocontrato.num_pol, ' ',infocontrato.floor) as morada from infocontrato) as infocontrato on volume.device = infocontrato.device
left join (
  select clients.local, clients.sensitivity from clients) as clients on infocontrato.local = clients.local
left join (
select distinct on (volume.device) volume.device, volume.volume as vol72
from volume where volume.date >= now() - interval '168 hours' order by volume.device, volume.date asc) as vol72 on volume.device = vol72.device
where 
volume.date >= now() - interval '24 hours'
and
clients.sensitivity = 'REGA'
and volume.volume - vol72.vol72 = 0
order by volume.device, volume.date desc
`;

const executeQuery = async (query, params = []) => {
    const client = await pool.connect();
    try {
        const result = await client.query(query, params);
        const array = result.rows.map(obj => Object.values(obj)); //convert json array in array of arrays
        return array;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error; // Rethrow the error for the caller to handle
    } finally {
        client.release();
    }
};

const convertToXlsx = async (data, fileName) => {
    try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');
    sheet.addRow(['Local', 'Device', 'Nome', 'Morada', 'Data', 'Consumo', 'Leitura']).eachCell({ includeEmpty: true }, (cell) => {
        cell.alignment = { horizontal: 'center' };
    });
    sheet.getColumn(2).width = 12;
    sheet.getColumn(3).width = 25;
    sheet.getColumn(4).width = 45;
    sheet.getColumn(5).width = 12;
    data.forEach(row => {
      sheet.addRow(row);
    });
    await workbook.xlsx.writeFile(fileName);
    console.log(fileName, 'written successfully.');
    } catch (error) {
    console.error('Error converting to XLSX:', error);
    }
};
  
const zeroregasdataTask = async () => {
    try {
        const zeroregasdata = await executeQuery(query);
        console.log(zeroregasdata.length, "records fetched successfully");
        await convertToXlsx(zeroregasdata, '/home/giggo/regas.xlsx');
    } catch (error) {
        console.error('Error fetching zero regas data:', error);
    }
};

export { zeroregasdataTask };