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

const query = `SELECT 'Albernoa - Saída do reservatório' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ALBERNOAZONAALTA' or tag_id = 'ALBERNOAZONABAIXA'
UNION ALL
SELECT 'Albernoa - Zona Alta' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ALBERNOAZONAALTA'
UNION ALL
SELECT 'Albernoa - Zona Baixa' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ALBERNOAZONABAIXA'
UNION ALL
SELECT 'Baleizão - Saída do reservatório' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BALEIZÃO ZONA ALTA' or tag_id = 'BALEIZÃO ZONA BAIXA'
UNION ALL
SELECT 'Baleizão - Zona Alta' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BALEIZÃO ZONA ALTA'
UNION ALL
SELECT 'Baleizão - Zona Baixa' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BALEIZÃO ZONA BAIXA'
UNION ALL
SELECT 'Beja ZA1' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ZA1' or tag_id = 'MOINHOS SANTA MARIA'
UNION ALL
SELECT 'Beja ZA1 - Moinhos Santa Maria' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'MOINHOS SANTA MARIA'
UNION ALL
SELECT 'Beja ZA2' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ZA2'
UNION ALL
SELECT 'Beja ZA3' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ZA3'
UNION ALL
SELECT 'Beja ZA4' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ZA4'
UNION ALL
SELECT 'Beja ZA5' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ZA5'
UNION ALL
SELECT 'Beja ZB1' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ZB1' or tag_id = 'BAIRRO DA ESPERANÇA' or tag_id = 'MOINHOS SANTA MARIA BAIXA' or tag_id = 'PANDORA' or tag_id = 'PARQUE NOMADA' or tag_id = 'BEJAMOINHOSVELHOS' or tag_id = 'FONTE MOURO'
UNION ALL
SELECT 'Beja ZB1 - Bairro Esperança' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BAIRRO DA ESPERANÇA' or tag_id = 'FONTE MOURO'
UNION ALL
SELECT 'Beja ZB1 - Moinhos Santa Maria' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'MOINHOS SANTA MARIA BAIXA'
UNION ALL
SELECT 'Beja ZB1 - Pandora' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'PANDORA'
UNION ALL
SELECT 'Beja ZB1 - Parque Nómada' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'PARQUE NOMADA'
UNION ALL
SELECT 'Beja ZB2' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ZB2' or tag_id = 'CIDADESAOPAULO' or tag_id = 'CONDOMINIO' or tag_id = 'FERREIRADECASTRO' or tag_id = 'JULIAOQUINTINHA' or tag_id = 'PATROCINIODIAS' or tag_id = 'PADRÃO'
UNION ALL
SELECT 'Beja ZB2 - Cidade de São Paulo' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'CIDADESAOPAULO'
UNION ALL
SELECT 'Beja ZB2 - Condominio' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'CONDOMINIO' or tag_id = 'PADRÃO'
UNION ALL
SELECT 'Beja ZB2 - Ferreira de Castro' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'FERREIRADECASTRO'
UNION ALL
SELECT 'Beja ZB2 - Julião Quintinha' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'JULIAOQUINTINHA'
UNION ALL
SELECT 'Beja ZB2 - Patrocinio Dias' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'PATROCINIODIAS'
UNION ALL
SELECT 'Beja ZB2 - Padrão' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'PADRÃO'
UNION ALL
SELECT 'Beja ZB3' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ZB3'
UNION ALL
SELECT 'Beja ZB4' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ZB4' or tag_id = 'RAMIROCORREIA'
UNION ALL
SELECT 'Beja ZB5' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ZB5'
UNION ALL
SELECT 'Beja ZI - Bairro da Conceição' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BAIRRO DA CONCEIÇÃO' or tag_id = 'BAIRROCONCEICAOSUBZONA' or tag_id = 'SAIBREIRAS'
UNION ALL
SELECT 'Beja ZI - Bairro da Conceição Subzona' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BAIRROCONCEICAOSUBZONA'
UNION ALL
SELECT 'Beja ZI - Bairro de São Miguel' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BAIRRO DE SÃO MIGUEL' or tag_id = 'ALDEIANOVACOITOS' or tag_id = 'BAIRRO DAS FLORES'
UNION ALL
SELECT 'Beja ZI - Parque Industrial' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'PARQUE INDUSTRIAL' or tag_id = 'BAIRRO DE SÃO MIGUEL' or tag_id = 'ALDEIANOVACOITOS' or tag_id = 'BAIRRO DAS FLORES'
UNION ALL
SELECT 'Beja ZI - Pelame vivendas' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'URBANIZACAO DO PELAME'
UNION ALL
SELECT 'Beja ZI - Quinta Del Rey' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'QUINTA DEL REI'
UNION ALL
SELECT 'Beja ZI - Saída do reservatório' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'PELAME' or tag_id = 'URBANIZACAO DO PELAME' or tag_id = 'ZI1' or tag_id = 'QUINTA DEL REI' or tag_id = 'PARQUE INDUSTRIAL' or tag_id = 'BAIRRO DE SÃO MIGUEL' or tag_id = 'ALDEIANOVACOITOS' or tag_id = 'BAIRRO DAS FLORES' or tag_id = 'BAIRRO DA CONCEIÇÃO' or tag_id = 'BAIRROCONCEICAOSUBZONA' or tag_id = 'SAIBREIRAS'
UNION ALL
SELECT 'Beringel - Saída do reservatório' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BERINGEL ZONA ALTA 1' or tag_id = 'BERINGEL ZONA ALTA 2' or tag_id = 'BERINGEL ZONA BAIXA 1' or tag_id = 'BERINGEL ZONA BAIXA 2'
UNION ALL
SELECT 'Beringel - Zona Baixa 1' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BERINGEL ZONA BAIXA 1'
UNION ALL
SELECT 'Beringel - Zona Baixa 2' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BERINGEL ZONA BAIXA 2'
UNION ALL
SELECT 'Beringel - Zona Norte' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BERINGEL ZONA ALTA 1'
UNION ALL
SELECT 'Beringel - Zona Sul' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BERINGEL ZONA ALTA 2' or tag_id = 'BERINGEL ZONA BAIXA 1' or tag_id = 'BERINGEL ZONA BAIXA 2'
UNION ALL
SELECT 'Boavista' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'BOAVISTA'
UNION ALL
SELECT 'Cabeça Gorda - Saída do reservatório' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'CABEÇA GORDA ZONA 1' or tag_id = 'CABEÇA GORDA ZONA 2' or tag_id = 'CABEÇA GORDA ZONA 3' or tag_id = 'SALVADA ZONA 1' or tag_id = 'SALVADA ZONA 2'
UNION ALL
SELECT 'Mina da Juliana' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'MINA DA JULIANA'
UNION ALL
SELECT 'Mombeja' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'MOMBEJA'
UNION ALL
SELECT 'Monte da Juliana' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'MONTE DA JULIANA'
UNION ALL
SELECT 'Neves - Geral' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'NEVES ZONA ALTA' or tag_id = 'NEVES ZONA BAIXA' or tag_id = 'VILA AZEDO'
UNION ALL
SELECT 'Neves - Porto Peles' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'PORTO PELES'
UNION ALL
SELECT 'Neves - Saída do reservatório' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'ADUTORA NEVES' or tag_id = 'NEVES ALDEIA DE CIMA' or tag_id = 'NEVES ZONA ALTA' or tag_id = 'NEVES ZONA BAIXA' or tag_id = 'VILA AZEDO' or tag_id = 'PORTO PELES'
UNION ALL
SELECT 'Neves - Vila Azedo' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'VILA AZEDO'
UNION ALL
SELECT 'Penedo Gordo - Geral' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'PENEDO GORDO' or tag_id = 'PENEDOGORDOMOINHO'
UNION ALL
SELECT 'Penedo Gordo - SubZona' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'PENEDOGORDOMOINHO'
UNION ALL
SELECT 'Quintos - Saída do reservatório' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'QUINTOS'
UNION ALL
SELECT 'Salvada' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'SALVADA ZONA 1' or tag_id = 'SALVADA ZONA 2'
UNION ALL
SELECT 'Santa Vitória' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'SANTA VITÓRIA'
UNION ALL
SELECT 'São Brissos - Saída do reservatório' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'SÃO BRISSOS'
UNION ALL
SELECT 'São Matias - Saída do reservatório' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'SÃO MATIAS'
UNION ALL
SELECT 'Trigaches - Geral' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'TRIGACHES'
UNION ALL
SELECT 'Trigaches - Saída do reservatório' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'TRIGACHES'
UNION ALL
SELECT 'Trindade - Saída do reservatório' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'TRINDADE'
UNION ALL
SELECT 'Vale de Russins - Saída do reservatório' as zmc, avg(age) as age, sum(meters) as meters, sum(bad) as bad, sum(tocheck) as check FROM infometers where tag_id = 'VALE DE RUSSINS'
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
    
const zmcinfometersTask = async () => {
    try {
        const zmcinfometersdata = await executeQuery(query);
        console.log(zmcinfometersdata.length, "records fetched successfully");
        return zmcinfometersdata;
    } catch (error) {
        console.error('Error fetching zmc meters data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};
    
export { zmcinfometersTask };
