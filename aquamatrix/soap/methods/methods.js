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

const GIS_Clientes =
    `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <GIS_Clientes xmlns="http://tempuri.org/">
        <Empresa>${process.env.aquaUser}</Empresa>
        <!--<ramalAgua></ramalAgua>-->
        <!--<zona>2</zona>-->
        <!--<area>15</area>-->
        <!--<cliente>1838415</cliente>-->
        <!--<local>8015</local>-->
        </GIS_Clientes>
    </soap:Body>
    </soap:Envelope>`;

const GIS_CoordenadasPorRamal =
    `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <GIS_CoordenadasPorRamal xmlns="http://tempuri.org/">
        <Empresa>${process.env.aquaUser}</Empresa>
        <!--<local></local>-->
        <!--<ramal></ramal>-->
        <itemInicial>1</itemInicial>
        <nrItemsObter>50000</nrItemsObter>
        </GIS_CoordenadasPorRamal>
    </soap:Body>
    </soap:Envelope>`;

export { GIS_DadosContadores, GIS_Clientes, GIS_CoordenadasPorRamal };