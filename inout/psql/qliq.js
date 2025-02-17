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

const query = `SELECT 'Beja ZA1' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 37) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc ='ZMC-ZA1' OR ramaisrua.zmc = 'ZMC-MOINHOS SANTA MARIA') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZA1 - Moinhos Santa Maria' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 997) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-MOINHOS SANTA MARIA') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZA2' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 512) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-ZA2') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZA3' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 536) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-ZA3') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZA4' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 537) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-ZA4') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZA5' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 538) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-ZA5') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB1' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 488) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-ZB1' or ramaisrua.zmc = 'ZMC-BAIRRO DA ESPERANÇA' or ramaisrua.zmc = 'ZMC-MOINHOS SANTA MARIA BAIXA' or ramaisrua.zmc = 'ZMC-PANDORA' or ramaisrua.zmc = 'ZMC-BEJAMOINHOSVELHOS' or ramaisrua.zmc = 'ZMC-FONTE MOURO' or ramaisrua.zmc = 'ZMC-PARQUE NOMADA') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB1 - Bairro Esperança' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 1076) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-BAIRRO DA ESPERANÇA' or ramaisrua.zmc = 'ZMC-FONTE MOURO') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB1 - Fonte Mouro' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 6493686) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-FONTE MOURO') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB1 - Moinhos Santa Maria' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 301) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-MOINHOS SANTA MARIA BAIXA') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB1 - Pandora' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 291) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-PANDORA') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB1 - Moinhos Velhos' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 202035132) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-BejaMoinhosVelhos' or ramaisrua.zmc = 'ZMC-PARQUE NOMADA') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB1 - Parque Nómada' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 285) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-PARQUE NOMADA') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB2' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 53) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-ZB2' or ramaisrua.zmc = 'ZMC-CIDADESAOPAULO' or ramaisrua.zmc = 'ZMC-CONDOMINIO' or ramaisrua.zmc = 'ZMC-FERREIRADECASTRO' or ramaisrua.zmc = 'ZMC-JULIAOQUINTINHA' or ramaisrua.zmc = 'ZMC-PADRÃO' or ramaisrua.zmc = 'ZMC-PATROCINIODIAS') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB2 - Cidade de São Paulo' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 992) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-CIDADESAOPAULO') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB2 - Condominio' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 988) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-CONDOMINIO' or ramaisrua.zmc = 'ZMC-PADRÃO') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB2 - Ferreira de Castro' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 1051) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-FERREIRADECASTRO') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB2 - Julião Quintinha' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 1047) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-JULIAOQUINTINHA') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB2 - Patrocinio Dias' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 232027341) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-PATROCINIODIAS') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB2 - Tenente Valadim' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 1040) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-TENENTEVALADIM') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB3' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 445) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-ZB3') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB4' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 446) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-ZB4' or ramaisrua.zmc = 'ZMC-RAMIROCORREIA') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZB5' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 182014161) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-ZB5') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZI - Saída do reservatório' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria-t3.rneves) as liq from 
(SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 145) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-PELAME' or ramaisrua.zmc = 'ZMC-URBANIZACAO DO PELAME' or ramaisrua.zmc = 'ZMC-ZI1' or ramaisrua.zmc = 'ZMC-BAIRRO DA CONCEIÇÃO' or ramaisrua.zmc = 'ZMC-BAIRROCONCEICAOSUBZONA' or ramaisrua.zmc = 'ZMC-SAIBREIRAS' or ramaisrua.zmc = 'ZMC-QUINTA DEL REI' or ramaisrua.zmc = 'ZMC-PARQUE INDUSTRIAL' or ramaisrua.zmc = 'ZMC-BAIRRO DE SÃO MIGUEL' or ramaisrua.zmc = 'ZMC-ALDEIANOVACOITOS' or ramaisrua.zmc = 'ZMC-BAIRRO DAS FLORES') AND date > now()-interval'48h' group by hour) as t2,
(SELECT date_trunc('hour', date) as hour, sum(flow) as rneves FROM zmcflowdis WHERE (tag_id = 395) and date > now()-interval'48h' group by hour) as t3
where t1.hour = t2.hour and t1.hour = t3.hour
UNION ALL
SELECT 'Beja ZI - Bairro da Conceição' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 984) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-BAIRRO DA CONCEIÇÃO' or ramaisrua.zmc = 'ZMC-BAIRROCONCEICAOSUBZONA' or ramaisrua.zmc = 'ZMC-SAIBREIRAS') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZI - Bairro da Conceição Subzona' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 1058) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-BAIRROCONCEICAOSUBZONA') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZI - Parque Industrial' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria-t3.rneves) as liq from 
(SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 1004) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-PARQUE INDUSTRIAL' or ramaisrua.zmc = 'ZMC-BAIRRO DE SÃO MIGUEL' or ramaisrua.zmc = 'ZMC-ALDEIANOVACOITOS' or ramaisrua.zmc = 'ZMC-BAIRRO DAS FLORES') AND date > now()-interval'48h' group by hour) as t2,
(SELECT date_trunc('hour', date) as hour, sum(flow) as rneves FROM zmcflowdis WHERE (tag_id = 395) and date > now()-interval'48h' group by hour) as t3
where t1.hour = t2.hour and t1.hour = t3.hour
UNION ALL
SELECT 'Beja ZI - Bairro de São Miguel' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 279) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-BAIRRO DE SÃO MIGUEL' or ramaisrua.zmc = 'ZMC-ALDEIANOVACOITOS' or ramaisrua.zmc = 'ZMC-BAIRRO DAS FLORES') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZI - Pelame vivendas' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 1000) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-URBANIZACAO DO PELAME') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Beja ZI - Quinta Del Rey' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 295) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-QUINTA DEL REI') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour
UNION ALL
SELECT 'Boavista' as zmc, t1.hour, t1.dist, t2.telemetria, (t1.dist-t2.telemetria) as liq from (SELECT date_trunc('hour', date) as hour, sum(flow) as dist FROM zmcflowdis
WHERE (tag_id = 1080) and date > now()-interval'48h' group by hour) as t1,
(SELECT date_trunc('hour', date) as hour, sum(flow) as telemetria FROM flow LEFT JOIN (SELECT infocontrato.ramal, infocontrato.device FROM infocontrato) AS infocontrato ON flow.device = infocontrato.device LEFT JOIN (SELECT ramaisrua.zmc, ramaisrua.ramal as ram from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ram
WHERE  (ramaisrua.zmc = 'ZMC-BOAVISTA') AND date > now()-interval'48h' group by hour) as t2
where t1.hour = t2.hour`;

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

const qliqdataTask = async () => {
    try {
        const qliqdata = await executeQuery(query);
        //console.log(qliqdata);
        //console.log(qliqdata.length, "records fetched successfully");
        return qliqdata;
    } catch (error) {
        console.error('Error fetching qliq data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};
    
export { qliqdataTask };
