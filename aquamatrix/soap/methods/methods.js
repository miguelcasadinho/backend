import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../../.env') });

const GIS_DadosContadores = 
    `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <GIS_DadosContadores xmlns="http://tempuri.org/">
        <Empresa>${process.env.aquaUser}</Empresa>
        <!--<ramal>1209002</ramal>-->
        <!--<local>17460</local>-->
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

const GIS_DadosFaturacao = async (date) => {
    let method = 
    `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <GIS_DadosFaturacao xmlns="http://tempuri.org/">
        <Empresa>${process.env.aquaUser}</Empresa>
        <dataInicial>${date}</dataInicial>
        <dataFinal>${date}</dataFinal>
        <!--<local></local>-->
        <!--<ramal> </ramal>-->
        <itemInicial>1</itemInicial>
        <nrItemsObter>20000</nrItemsObter>
        </GIS_DadosFaturacao>
    </soap:Body>
    </soap:Envelope>`;
    return method;
};

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