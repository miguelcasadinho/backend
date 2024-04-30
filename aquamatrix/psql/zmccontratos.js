import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const pool = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

const query = `
SELECT 'Albernoa - Saída do reservatório' as zmc, count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ALBERNOAZONAALTA' or ramaisrua.zmc = 'ALBERNOAZONABAIXA'
UNION ALL
SELECT 'Albernoa - Zona Alta' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ALBERNOAZONAALTA'
UNION ALL
SELECT 'Albernoa - Zona Baixa' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ALBERNOAZONABAIXA'
UNION ALL
SELECT 'Baleizão - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BALEIZÃO ZONA ALTA' or ramaisrua.zmc = 'BALEIZÃO ZONA BAIXA'
UNION ALL
SELECT 'Baleizão - Zona Alta' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BALEIZÃO ZONA ALTA'
UNION ALL
SELECT 'Baleizão - Zona Baixa' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BALEIZÃO ZONA BAIXA'
UNION ALL
SELECT 'Beja ZA1' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZA1' or ramaisrua.zmc = 'MOINHOS SANTA MARIA'
UNION ALL
SELECT 'Beja ZA1 - Moinhos Santa Maria' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'MOINHOS SANTA MARIA'
UNION ALL
SELECT 'Beja ZA2' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZA2'
UNION ALL
SELECT 'Beja ZA3' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZA3'
UNION ALL
SELECT 'Beja ZA4' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZA4'
UNION ALL
SELECT 'Beja ZA5' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZA5'
UNION ALL
SELECT 'Beja ZB1' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZB1' or ramaisrua.zmc = 'BAIRRO DA ESPERANÇA' or ramaisrua.zmc = 'MOINHOS SANTA MARIA BAIXA' or ramaisrua.zmc = 'PANDORA' or ramaisrua.zmc = 'PARQUE NOMADA' or ramaisrua.zmc = 'BEJAMOINHOSVELHOS' or ramaisrua.zmc = 'FONTE MOURO'
UNION ALL
SELECT 'Beja ZB1 - Bairro Esperança' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BAIRRO DA ESPERANÇA'
UNION ALL
SELECT 'Beja ZB1 - Fonte Mouro' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'FONTE MOURO'
UNION ALL
SELECT 'Beja ZB1 - Moinhos Santa Maria' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'MOINHOS SANTA MARIA BAIXA'
UNION ALL
SELECT 'Beja ZB1 - Pandora' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'PANDORA'
UNION ALL
SELECT 'Beja ZB1 - Parque Nómada' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'PARQUE NOMADA'
UNION ALL
SELECT 'Beja ZB2' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZB2' or ramaisrua.zmc = 'CIDADESAOPAULO' or ramaisrua.zmc = 'CONDOMINIO' or ramaisrua.zmc = 'FERREIRADECASTRO' or ramaisrua.zmc = 'JULIAOQUINTINHA' or ramaisrua.zmc = 'PADRÃO' or ramaisrua.zmc = 'PATROCINIODIAS'
UNION ALL
SELECT 'Beja ZB2 - Cidade de São Paulo' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'CIDADESAOPAULO'
UNION ALL
SELECT 'Beja ZB2 - Condominio' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'CONDOMINIO' or ramaisrua.zmc = 'PADRÃO'
UNION ALL
SELECT 'Beja ZB2 - Ferreira de Castro' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'FERREIRADECASTRO'
UNION ALL
SELECT 'Beja ZB2 - Julião Quintinha' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'JULIAOQUINTINHA'
UNION ALL
SELECT 'Beja ZB2 - Padrão' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'PADRÃO'
UNION ALL
SELECT 'Beja ZB2 - Patrocinio Dias' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'PATROCINIODIAS'
UNION ALL
SELECT 'Beja ZB2 - Tenente Valadim' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'TENENTEVALADIM'
UNION ALL
SELECT 'Beja ZB3' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZB3'
UNION ALL
SELECT 'Beja ZB4' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZB4' or ramaisrua.zmc = 'RAMIROCORREIA'
UNION ALL
SELECT 'Beja ZB5' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZB5'
UNION ALL
SELECT 'Beja ZI - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'PELAME' or ramaisrua.zmc = 'URBANIZAÇÃO DO PELAME' or ramaisrua.zmc = 'ZI1' or ramaisrua.zmc = 'BAIRRO DA CONCEIÇÃO' or ramaisrua.zmc = 'BAIRROCONCEICAOSUBZONA' or ramaisrua.zmc = 'SAIBREIRAS' or ramaisrua.zmc = 'QUINTA DEL REI' or ramaisrua.zmc = 'PARQUE INDUSTRIAL' or ramaisrua.zmc = 'BAIRRO DE SÃO MIGUEL' or ramaisrua.zmc = 'ALDEIANOVACOITOS' or ramaisrua.zmc = 'BAIRRO DAS FLORES'
UNION ALL
SELECT 'Beja ZI - Bairro da Conceição' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BAIRRO DA CONCEIÇÃO' or ramaisrua.zmc = 'BAIRROCONCEICAOSUBZONA' or ramaisrua.zmc = 'SAIBREIRAS'
UNION ALL
SELECT 'Beja ZI - Bairro da Conceição Subzona' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BAIRROCONCEICAOSUBZONA'
UNION ALL
SELECT 'Beja ZI - Bairro de São Miguel' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BAIRRO DE SÃO MIGUEL' or ramaisrua.zmc = 'ALDEIANOVACOITOS' or ramaisrua.zmc = 'BAIRRO DAS FLORES'
UNION ALL
SELECT 'Beja ZI - Parque Industrial' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'PARQUE INDUSTRIAL' or ramaisrua.zmc = 'BAIRRO DE SÃO MIGUEL' or ramaisrua.zmc = 'ALDEIANOVACOITOS' or ramaisrua.zmc = 'BAIRRO DAS FLORES'
UNION ALL
SELECT 'Beja ZI - Pelame vivendas' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'URBANIZACAO DO PELAME'
UNION ALL
SELECT 'Beja ZI - Quinta Del Rey' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'QUINTA DEL REI'
UNION ALL
SELECT 'Beringel - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BERINGEL ZONA ALTA 1' or ramaisrua.zmc = 'BERINGEL ZONA ALTA 2' or ramaisrua.zmc = 'BERINGEL ZONA BAIXA 1' or ramaisrua.zmc = 'BERINGEL ZONA BAIXA 2'
UNION ALL
SELECT 'Beringel - Zona Baixa 1' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BERINGEL ZONA BAIXA 1'
UNION ALL
SELECT 'Beringel - Zona Baixa 2' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BERINGEL ZONA BAIXA 2'
UNION ALL
SELECT 'Beringel - Zona Norte' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BERINGEL ZONA ALTA 1'
UNION ALL
SELECT 'Beringel - Zona Sul' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BERINGEL ZONA ALTA 2' or ramaisrua.zmc = 'BERINGEL ZONA BAIXA 1' or ramaisrua.zmc = 'BERINGEL ZONA BAIXA 2'
UNION ALL
SELECT 'Boavista' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'BOAVISTA'
UNION ALL
SELECT 'Cabeça Gorda - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'CABEÇA GORDA ZONA 1' or ramaisrua.zmc = 'CABEÇA GORDA ZONA 2' or ramaisrua.zmc = 'CABEÇA GORDA ZONA 3' or ramaisrua.zmc = 'SALVADA ZONA 1' or ramaisrua.zmc = 'SALVADA ZONA 2'
UNION ALL
SELECT 'Mina da Juliana' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'MINA DA JULIANA'
UNION ALL
SELECT 'Mombeja' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'MOMBEJA'
UNION ALL
SELECT 'Monte da Juliana' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'MONTE DA JULIANA'
UNION ALL
SELECT 'Neves - Geral' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'NEVES ZONA ALTA' or ramaisrua.zmc = 'NEVES ZONA BAIXA' or ramaisrua.zmc = 'VILA AZEDO'
UNION ALL
SELECT 'Neves - Porto Peles' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'PORTO PELES'
UNION ALL
SELECT 'Neves - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ADUTORA NEVES' or ramaisrua.zmc = 'NEVES ALDEIA DE CIMA' or ramaisrua.zmc = 'NEVES ZONA ALTA' or ramaisrua.zmc = 'NEVES ZONA BAIXA' or ramaisrua.zmc = 'VILA AZEDO' or ramaisrua.zmc = 'PORTO PELES'
UNION ALL
SELECT 'Neves - Vila Azedo' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'VILA AZEDO'
UNION ALL
SELECT 'Penedo Gordo - Geral' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'PENEDO GORDO' or ramaisrua.zmc = 'PENEDOGORDOMOINHO'
UNION ALL
SELECT 'Penedo Gordo - SubZona' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'PENEDOGORDOMOINHO'
UNION ALL
SELECT 'Quintos - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'QUINTOS'
UNION ALL
SELECT 'Salvada' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'SALVADA ZONA 1' or ramaisrua.zmc = 'SALVADA ZONA 2'
UNION ALL
SELECT 'Santa Vitória' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'SANTA VITÓRIA'
UNION ALL
SELECT 'São Brissos - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'SÃO BRISSOS'
UNION ALL
SELECT 'São Matias - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'SÃO MATIAS'
UNION ALL
SELECT 'Trigaches - Geral' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'TRIGACHES'
UNION ALL
SELECT 'Trigaches - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'TRIGACHES'
UNION ALL
SELECT 'Trindade - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'TRINDADE'
UNION ALL
SELECT 'Vale de Russins - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'VALE DE RUSSINS'
ORDER BY zmc ASC
`;

const executeQuery = async (query, params = []) => {
    const client = await pool.connect();
    try {
        const result = await client.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error; // Rethrow the error for the caller to handle
    } finally {
        client.release();
    }
};

const zmccontratosTask = async () => {
    try {
        const zmccontratosdata = await executeQuery(query);
        //console.log(zmccontratosdata.length, "records fetched successfully");
        return zmccontratosdata;
    } catch (error) {
        console.error('Error fetching zmc contracts data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { zmccontratosTask };
