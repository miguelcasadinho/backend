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
where ramaisrua.zmc = 'ZMC-ALBERNOAZONAALTA' or ramaisrua.zmc = 'ZMC-ALBERNOAZONABAIXA'
UNION ALL
SELECT 'Albernoa - Zona Alta' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ALBERNOAZONAALTA'
UNION ALL
SELECT 'Albernoa - Zona Baixa' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ALBERNOAZONABAIXA'
UNION ALL
SELECT 'Baleizão - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BALEIZÃO ZONA ALTA' or ramaisrua.zmc = 'ZMC-BALEIZÃO ZONA BAIXA'
UNION ALL
SELECT 'Baleizão - Zona Alta' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BALEIZÃO ZONA ALTA'
UNION ALL
SELECT 'Baleizão - Zona Baixa' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BALEIZÃO ZONA BAIXA'
UNION ALL
SELECT 'Beja ZA1' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ZA1' or ramaisrua.zmc = 'ZMC-MOINHOS SANTA MARIA'
UNION ALL
SELECT 'Beja ZA1 - Moinhos Santa Maria' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-MOINHOS SANTA MARIA'
UNION ALL
SELECT 'Beja ZA2' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ZA2'
UNION ALL
SELECT 'Beja ZA3' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ZA3'
UNION ALL
SELECT 'Beja ZA4' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ZA4'
UNION ALL
SELECT 'Beja ZA5' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ZA5'
UNION ALL
SELECT 'Beja ZB1' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ZB1' or ramaisrua.zmc = 'ZMC-BAIRRO DA ESPERANÇA' or ramaisrua.zmc = 'ZMC-MOINHOS SANTA MARIA BAIXA' or ramaisrua.zmc = 'ZMC-PANDORA' or ramaisrua.zmc = 'ZMC-PARQUE NOMADA' or ramaisrua.zmc = 'ZMC-BEJAMOINHOSVELHOS' or ramaisrua.zmc = 'ZMC-FONTE MOURO'
UNION ALL
SELECT 'Beja ZB1 - Bairro Esperança' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BAIRRO DA ESPERANÇA'
UNION ALL
SELECT 'Beja ZB1 - Fonte Mouro' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-FONTE MOURO'
UNION ALL
SELECT 'Beja ZB1 - Moinhos Santa Maria' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-MOINHOS SANTA MARIA BAIXA'
UNION ALL
SELECT 'Beja ZB1 - Pandora' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-PANDORA'
UNION ALL
SELECT 'Beja ZB1 - Moinhos Velhos' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BEJAMOINHOSVELHOS' or ramaisrua.zmc = 'ZMC-PARQUE NOMADA'
UNION ALL
SELECT 'Beja ZB1 - Parque Nómada' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-PARQUE NOMADA'
UNION ALL
SELECT 'Beja ZB2' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ZB2' or ramaisrua.zmc = 'ZMC-CIDADESAOPAULO' or ramaisrua.zmc = 'ZMC-CONDOMINIO' or ramaisrua.zmc = 'ZMC-FERREIRADECASTRO' or ramaisrua.zmc = 'ZMC-JULIAOQUINTINHA' or ramaisrua.zmc = 'ZMC-PADRÃO' or ramaisrua.zmc = 'ZMC-PATROCINIODIAS' or ramaisrua.zmc = 'ZMC-TENENTEVALADIM'
UNION ALL
SELECT 'Beja ZB2 - Cidade de São Paulo' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-CIDADESAOPAULO'
UNION ALL
SELECT 'Beja ZB2 - Condominio' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-CONDOMINIO' or ramaisrua.zmc = 'ZMC-PADRÃO'
UNION ALL
SELECT 'Beja ZB2 - Ferreira de Castro' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-FERREIRADECASTRO'
UNION ALL
SELECT 'Beja ZB2 - Julião Quintinha' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-JULIAOQUINTINHA'
UNION ALL
SELECT 'Beja ZB2 - Padrão' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-PADRÃO'
UNION ALL
SELECT 'Beja ZB2 - Patrocinio Dias' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-PATROCINIODIAS'
UNION ALL
SELECT 'Beja ZB2 - Tenente Valadim' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-TENENTEVALADIM'
UNION ALL
SELECT 'Beja ZB3' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ZB3'
UNION ALL
SELECT 'Beja ZB4' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ZB4' or ramaisrua.zmc = 'ZMC-RAMIROCORREIA'
UNION ALL
SELECT 'Beja ZB5' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ZB5'
UNION ALL
SELECT 'Beja ZI - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-PELAME' or ramaisrua.zmc = 'ZMC-URBANIZAÇÃO DO PELAME' or ramaisrua.zmc = 'ZMC-ZI1' or ramaisrua.zmc = 'ZMC-BAIRRO DA CONCEIÇÃO' or ramaisrua.zmc = 'ZMC-BAIRROCONCEICAOSUBZONA' or ramaisrua.zmc = 'ZMC-SAIBREIRAS' or ramaisrua.zmc = 'ZMC-QUINTA DEL REI' or ramaisrua.zmc = 'ZMC-PARQUE INDUSTRIAL' or ramaisrua.zmc = 'ZMC-BAIRRO DE SÃO MIGUEL' or ramaisrua.zmc = 'ZMC-ALDEIANOVACOITOS' or ramaisrua.zmc = 'ZMC-BAIRRO DAS FLORES'
UNION ALL
SELECT 'Beja ZI - Bairro da Conceição' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BAIRRO DA CONCEIÇÃO' or ramaisrua.zmc = 'ZMC-BAIRROCONCEICAOSUBZONA' or ramaisrua.zmc = 'ZMC-SAIBREIRAS'
UNION ALL
SELECT 'Beja ZI - Bairro da Conceição Subzona' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BAIRROCONCEICAOSUBZONA'
UNION ALL
SELECT 'Beja ZI - Bairro de São Miguel' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BAIRRO DE SÃO MIGUEL' or ramaisrua.zmc = 'ZMC-ALDEIANOVACOITOS' or ramaisrua.zmc = 'ZMC-BAIRRO DAS FLORES'
UNION ALL
SELECT 'Beja ZI - Parque Industrial' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-PARQUE INDUSTRIAL' or ramaisrua.zmc = 'ZMC-BAIRRO DE SÃO MIGUEL' or ramaisrua.zmc = 'ZMC-ALDEIANOVACOITOS' or ramaisrua.zmc = 'ZMC-BAIRRO DAS FLORES'
UNION ALL
SELECT 'Beja ZI - Pelame vivendas' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-URBANIZACAO DO PELAME'
UNION ALL
SELECT 'Beja ZI - Quinta Del Rey' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-QUINTA DEL REI'
UNION ALL
SELECT 'Beringel - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BERINGEL ZONA ALTA 1' or ramaisrua.zmc = 'ZMC-BERINGEL ZONA ALTA 2' or ramaisrua.zmc = 'ZMC-BERINGEL ZONA BAIXA 1' or ramaisrua.zmc = 'ZMC-BERINGEL ZONA BAIXA 2'
UNION ALL
SELECT 'Beringel - Zona Baixa 1' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BERINGEL ZONA BAIXA 1'
UNION ALL
SELECT 'Beringel - Zona Baixa 2' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BERINGEL ZONA BAIXA 2'
UNION ALL
SELECT 'Beringel - Zona Norte' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BERINGEL ZONA ALTA 1'
UNION ALL
SELECT 'Beringel - Zona Sul' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BERINGEL ZONA ALTA 2' or ramaisrua.zmc = 'ZMC-BERINGEL ZONA BAIXA 1' or ramaisrua.zmc = 'ZMC-BERINGEL ZONA BAIXA 2'
UNION ALL
SELECT 'Boavista' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-BOAVISTA'
UNION ALL
SELECT 'Cabeça Gorda - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-CABEÇA GORDA ZONA 1' or ramaisrua.zmc = 'ZMC-CABEÇA GORDA ZONA 2' or ramaisrua.zmc = 'ZMC-CABEÇA GORDA ZONA 3' or ramaisrua.zmc = 'SALVADA ZONA 1' or ramaisrua.zmc = 'SALVADA ZONA 2'
UNION ALL
SELECT 'Mina da Juliana' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-MINA DA JULIANA'
UNION ALL
SELECT 'Mombeja' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-MOMBEJA'
UNION ALL
SELECT 'Monte da Juliana' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-MONTE DA JULIANA'
UNION ALL
SELECT 'Neves - Geral' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-NEVES ZONA ALTA' or ramaisrua.zmc = 'ZMC-NEVES ZONA BAIXA' or ramaisrua.zmc = 'ZMC-VILA AZEDO'
UNION ALL
SELECT 'Neves - Porto Peles' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-PORTO PELES'
UNION ALL
SELECT 'Neves - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-ADUTORA NEVES' or ramaisrua.zmc = 'ZMC-NEVES ALDEIA DE CIMA' or ramaisrua.zmc = 'ZMC-NEVES ZONA ALTA' or ramaisrua.zmc = 'ZMC-NEVES ZONA BAIXA' or ramaisrua.zmc = 'ZMC-VILA AZEDO' or ramaisrua.zmc = 'ZMC-PORTO PELES'
UNION ALL
SELECT 'Neves - Vila Azedo' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-VILA AZEDO'
UNION ALL
SELECT 'Penedo Gordo - Geral' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-PENEDO GORDO' or ramaisrua.zmc = 'ZMC-PENEDOGORDOMOINHO'
UNION ALL
SELECT 'Penedo Gordo - SubZona' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-PENEDOGORDOMOINHO'
UNION ALL
SELECT 'Quintos - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-QUINTOS'
UNION ALL
SELECT 'Salvada' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-SALVADA ZONA 1' or ramaisrua.zmc = 'ZMC-SALVADA ZONA 2'
UNION ALL
SELECT 'Santa Vitória' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-SANTA VITÓRIA'
UNION ALL
SELECT 'São Brissos - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-SÃO BRISSOS'
UNION ALL
SELECT 'São Matias - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-SÃO MATIAS'
UNION ALL
SELECT 'Trigaches - Geral' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-TRIGACHES'
UNION ALL
SELECT 'Trigaches - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-TRIGACHES'
UNION ALL
SELECT 'Trindade - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-TRINDADE'
UNION ALL
SELECT 'Vale de Russins - Saída do reservatório' as zmc,count(infocontrato.local) as contratos FROM infocontrato left join (SELECT ramaisrua.zmc, ramaisrua.ramal from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
where ramaisrua.zmc = 'ZMC-VALE DE RUSSINS'
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
        //console.log(zmccontratosdata);
        return zmccontratosdata;
    } catch (error) {
        console.error('Error fetching zmc contracts data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { zmccontratosTask };
