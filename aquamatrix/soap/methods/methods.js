import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../../../.env');
config({ path: envPath });

// Get the current date
const date = new Date();
// Format the date (e.g., YYYY-MM-DD)
const formdate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
let date_2m = new Date();
date_2m = new Date(date_2m.setMonth(date_2m.getMonth() - 2));
const formdate_2m = `${date_2m.getFullYear()}-${(date_2m.getMonth() + 1).toString().padStart(2, '0')}-${date_2m.getDate().toString().padStart(2, '0')}`;

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

const GIS_DadosFaturacao =
    `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <GIS_DadosFaturacao xmlns="http://tempuri.org/">
        <Empresa>${process.env.aquaUser}</Empresa>
        <dataInicial>${formdate}</dataInicial>
        <dataFinal>${formdate}</dataFinal>
        <!--<local></local>-->
        <!--<ramal> </ramal>-->
        <itemInicial>1</itemInicial>
        <nrItemsObter>20000</nrItemsObter>
        </GIS_DadosFaturacao>
    </soap:Body>
    </soap:Envelope>`;

const GIS_InfoContrato =
    `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <GIS_InfoContrato xmlns="http://tempuri.org/">
        <Empresa>${process.env.aquaUser}</Empresa>
        <!--<ramalAgua></ramalAgua>-->
        <!--<zona>2</zona>-->
        <!--<area>15</area>-->
        <!--<cliente></cliente>-->
        <!--<local></local>-->
        </GIS_InfoContrato>
    </soap:Body>
    </soap:Envelope>`;

const GIS_RamaisRua =
    `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <GIS_RamaisRua xmlns="http://tempuri.org/">
        <Empresa>${process.env.aquaUser}</Empresa>
        <!--<nrRua></nrRua>-->
        <!--<localidade></localidade>-->
        <!--<ramal></ramal>-->
        <!--<zmc></zmc>-->
        </GIS_RamaisRua>
    </soap:Body>
    </soap:Envelope>`;

export { GIS_DadosContadores, GIS_Clientes, GIS_CoordenadasPorRamal, GIS_DadosFaturacao, GIS_InfoContrato, GIS_RamaisRua };