import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../../../.env');
config({ path: envPath });

const GIS_DadosContadores = 
    `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <GIS_DadosContadores xmlns="http://tempuri.org/">
        <Empresa>${process.env.aquaUser}</Empresa>
        <!--<ramal></ramal>-->
        <!--<local></local>-->
        <itemInicial>1</itemInicial>
        <nrItemsObter>50000</nrItemsObter>
        </GIS_DadosContadores>
    </soap:Body>
    </soap:Envelope>`;

export { GIS_DadosContadores };