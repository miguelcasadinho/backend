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

const query = `SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Albernoa - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ALBERNOAZONAALTA' or zmc = 'ALBERNOAZONABAIXA') as t1,
(SELECT 'Albernoa - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ALBERNOAZONAALTA' or zmc = 'ALBERNOAZONABAIXA') ) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Albernoa - Zona Alta' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ALBERNOAZONAALTA') as t1,
(SELECT 'Albernoa - Zona Alta' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ALBERNOAZONAALTA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Albernoa - Zona Baixa' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ALBERNOAZONABAIXA') as t1,
(SELECT 'Albernoa - Zona Alta' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ALBERNOAZONABAIXA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Baleizão - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BALEIZÃO ZONA ALTA' or zmc = 'BALEIZÃO ZONA BAIXA') as t1,
(SELECT 'Baleizão - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BALEIZÃO ZONA ALTA' or zmc = 'BALEIZÃO ZONA BAIXA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Baleizão - Zona Alta' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BALEIZÃO ZONA ALTA') as t1,
(SELECT 'Baleizão - Zona Alta' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BALEIZÃO ZONA ALTA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Baleizão - Zona Baixa' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BALEIZÃO ZONA BAIXA') as t1,
(SELECT 'Baleizão - Zona Baixa' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BALEIZÃO ZONA BAIXA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZA1' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZA1' or zmc = 'MOINHOS SANTA MARIA') as t1,
(SELECT 'Beja ZA1' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZA1' or zmc = 'MOINHOS SANTA MARIA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZA1 - Moinhos Santa Maria' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'MOINHOS SANTA MARIA') as t1,
(SELECT 'Beja ZA1 - Moinhos Santa Maria' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'MOINHOS SANTA MARIA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZA2' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZA2') as t1,
(SELECT 'Beja ZA2' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZA2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZA3' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZA3') as t1,
(SELECT 'Beja ZA3' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZA3')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZA4' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZA4') as t1,
(SELECT 'Beja ZA4' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZA4')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZA5' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZA5') as t1,
(SELECT 'Beja ZA5' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZA5')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB1' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZB1' or zmc = 'BAIRRO DA ESPERANÇA' or zmc = 'MOINHOS SANTA MARIA BAIXA' or zmc = 'PANDORA' or zmc = 'PARQUE NOMADA' or zmc = 'BEJAMOINHOSVELHOS' or zmc = 'FONTE MOURO') as t1,
(SELECT 'Beja ZB1' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZB1' or zmc = 'BAIRRO DA ESPERANÇA' or zmc = 'MOINHOS SANTA MARIA BAIXA' or zmc = 'PANDORA' or zmc = 'PARQUE NOMADA' or zmc = 'BEJAMOINHOSVELHOS' or zmc = 'FONTE MOURO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB1 - Bairro Esperança' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BAIRRO DA ESPERANÇA' or zmc = 'FONTE MOURO') as t1,
(SELECT 'Beja ZB1 - Bairro Esperança' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BAIRRO DA ESPERANÇA' or zmc = 'FONTE MOURO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB1 - Moinhos Santa Maria' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'MOINHOS SANTA MARIA BAIXA') as t1,
(SELECT 'Beja ZB1 - Moinhos Santa Maria' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'MOINHOS SANTA MARIA BAIXA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB1 - Pandora' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'PANDORA') as t1,
(SELECT 'Beja ZB1 - Pandora' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'PANDORA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB1 - Parque Nómada' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'PARQUE NOMADA') as t1,
(SELECT 'Beja ZB1 - Parque Nómada' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'PARQUE NOMADA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZB2' or zmc = 'CIDADESAOPAULO' or zmc = 'CONDOMINIO' or zmc = 'FERREIRADECASTRO' or zmc = 'JULIAOQUINTINHA' or zmc = 'PADRÃO' or zmc = 'PATROCINIODIAS') as t1,
(SELECT 'Beja ZB2' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZB2' or zmc = 'CIDADESAOPAULO' or zmc = 'CONDOMINIO' or zmc = 'FERREIRADECASTRO' or zmc = 'JULIAOQUINTINHA' or zmc = 'PADRÃO' or zmc = 'PATROCINIODIAS')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Cidade de São Paulo' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'CIDADESAOPAULO') as t1,
(SELECT 'Beja ZB2 - Cidade de São Paulo' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'CIDADESAOPAULO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Condominio' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'CONDOMINIO' or zmc = 'PADRÃO') as t1,
(SELECT 'Beja ZB2 - Condominio' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'CONDOMINIO' or zmc = 'PADRÃO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Ferreira de Castro' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'FERREIRADECASTRO') as t1,
(SELECT 'Beja ZB2 - Ferreira de Castro' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'FERREIRADECASTRO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Julião Quintinha' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'JULIAOQUINTINHA') as t1,
(SELECT 'Beja ZB2 - Julião Quintinha' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'JULIAOQUINTINHA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Padrão' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'PADRÃO') as t1,
(SELECT 'Beja ZB2 - Padrão' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'PADRÃO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Patrocinio Dias' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'PATROCINIODIAS') as t1,
(SELECT 'Beja ZB2 - Patrocinio Dias' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'PATROCINIODIAS')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB3' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZB3') as t1,
(SELECT 'Beja ZB3' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZB3')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB4' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZB4' or zmc = 'RAMIROCORREIA') as t1,
(SELECT 'Beja ZB4' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZB4' or zmc = 'RAMIROCORREIA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB5' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZB5') as t1,
(SELECT 'Beja ZB5' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZB5')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'PELAME' or zmc = 'URBANIZACAO DO PELAME' or zmc = 'ZI1' or zmc = 'BAIRRO DA CONCEIÇÃO' or zmc = 'BAIRROCONCEICAOSUBZONA' or zmc = 'SAIBREIRAS' or zmc = 'QUINTA DEL REI' or zmc = 'PARQUE INDUSTRIAL' or zmc = 'BAIRRO DE SÃO MIGUEL' or zmc = 'ALDEIANOVACOITOS' or zmc = 'BAIRRO DAS FLORES') as t1,
(SELECT 'Beja ZI - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'PELAME' or zmc = 'URBANIZACAO DO PELAME' or zmc = 'ZI1' or zmc = 'BAIRRO DA CONCEIÇÃO' or zmc = 'BAIRROCONCEICAOSUBZONA' or zmc = 'SAIBREIRAS' or zmc = 'QUINTA DEL REI' or zmc = 'PARQUE INDUSTRIAL' or zmc = 'BAIRRO DE SÃO MIGUEL' or zmc = 'ALDEIANOVACOITOS' or zmc = 'BAIRRO DAS FLORES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Bairro da Conceição' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BAIRRO DA CONCEIÇÃO' or zmc = 'BAIRROCONCEICAOSUBZONA' or zmc = 'SAIBREIRAS') as t1,
(SELECT 'Beja ZI - Bairro da Conceição' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BAIRRO DA CONCEIÇÃO' or zmc = 'BAIRROCONCEICAOSUBZONA' or zmc = 'SAIBREIRAS')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Bairro da Conceição Subzona' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BAIRROCONCEICAOSUBZONA') as t1,
(SELECT 'Beja ZI - Bairro da Conceição Subzona' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BAIRROCONCEICAOSUBZONA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Parque Industrial' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'PARQUE INDUSTRIAL' or zmc = 'BAIRRO DE SÃO MIGUEL' or zmc = 'ALDEIANOVACOITOS' or zmc = 'BAIRRO DAS FLORES') as t1,
(SELECT 'Beja ZI - Parque Industrial' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'PARQUE INDUSTRIAL' or zmc = 'BAIRRO DE SÃO MIGUEL' or zmc = 'ALDEIANOVACOITOS' or zmc = 'BAIRRO DAS FLORES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Bairro de São Miguel' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BAIRRO DE SÃO MIGUEL' or zmc = 'ALDEIANOVACOITOS' or zmc = 'BAIRRO DAS FLORES') as t1,
(SELECT 'Beja ZI - Bairro de São Miguel' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BAIRRO DE SÃO MIGUEL' or zmc = 'ALDEIANOVACOITOS' or zmc = 'BAIRRO DAS FLORES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Pelame vivendas' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'URBANIZACAO DO PELAME') as t1,
(SELECT 'Beja ZI - Pelame vivendas' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'URBANIZACAO DO PELAME')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Quinta Del Rey' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'QUINTA DEL REI') as t1,
(SELECT 'Beja ZI - Quinta Del Rey' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'QUINTA DEL REI')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beringel - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BERINGEL ZONA ALTA 1' or zmc = 'BERINGEL ZONA ALTA 2' or zmc = 'BERINGEL ZONA BAIXA 1' or zmc = 'BERINGEL ZONA BAIXA 2') as t1,
(SELECT 'Beringel - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BERINGEL ZONA ALTA 1' or zmc = 'BERINGEL ZONA ALTA 2' or zmc = 'BERINGEL ZONA BAIXA 1' or zmc = 'BERINGEL ZONA BAIXA 2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beringel - Zona Sul' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BERINGEL ZONA ALTA 2' or zmc = 'BERINGEL ZONA BAIXA 1' or zmc = 'BERINGEL ZONA BAIXA 2') as t1,
(SELECT 'Beringel - Zona Sul' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BERINGEL ZONA ALTA 2' or zmc = 'BERINGEL ZONA BAIXA 1' or zmc = 'BERINGEL ZONA BAIXA 2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beringel - Zona Baixa 1' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BERINGEL ZONA BAIXA 1') as t1,
(SELECT 'Beringel - Zona Baixa 1' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BERINGEL ZONA BAIXA 1')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beringel - Zona Baixa 2' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BERINGEL ZONA BAIXA 2') as t1,
(SELECT 'Beringel - Zona Baixa 2' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BERINGEL ZONA BAIXA 2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beringel - Zona Norte' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BERINGEL ZONA ALTA 1') as t1,
(SELECT 'Beringel - Zona Norte' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BERINGEL ZONA ALTA 1')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Boavista' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'BOAVISTA') as t1,
(SELECT 'Boavista' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'BOAVISTA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Cabeça Gorda - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'CABEÇA GORDA ZONA 1' or zmc = 'CABEÇA GORDA ZONA 2' or zmc = 'CABEÇA GORDA ZONA 3' or zmc = 'SALVADA ZONA 1' or zmc = 'SALVADA ZONA 2') as t1,
(SELECT 'Cabeça Gorda - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'CABEÇA GORDA ZONA 1' or zmc = 'CABEÇA GORDA ZONA 2' or zmc = 'CABEÇA GORDA ZONA 3' or zmc = 'SALVADA ZONA 1' or zmc = 'SALVADA ZONA 2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Cabeça Gorda - Zona 1' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'CABEÇA GORDA ZONA 1') as t1,
(SELECT 'Cabeça Gorda - Zona 1' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'CABEÇA GORDA ZONA 1')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Cabeça Gorda - Zona 2' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'CABEÇA GORDA ZONA 2') as t1,
(SELECT 'Cabeça Gorda - Zona 2' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'CABEÇA GORDA ZONA 2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Cabeça Gorda - Zona 3' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'CABEÇA GORDA ZONA 3') as t1,
(SELECT 'Cabeça Gorda - Zona 3' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'CABEÇA GORDA ZONA 3')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Mina da Juliana' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'MINA DA JULIANA') as t1,
(SELECT 'Mina da Juliana' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'MINA DA JULIANA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Mombeja' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'MOMBEJA') as t1,
(SELECT 'Mombeja' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'MOMBEJA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Monte da Juliana' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'MONTE DA JULIANA') as t1,
(SELECT 'Monte da Juliana' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'MONTE DA JULIANA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Neves - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ADUTORA NEVES' or zmc = 'NEVES ALDEIA DE CIMA' or zmc = 'NEVES ZONA ALTA' or zmc = 'NEVES ZONA BAIXA' or zmc = 'VILA AZEDO' or zmc = 'PORTO PELES') as t1,
(SELECT 'Neves - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ADUTORA NEVES' or zmc = 'NEVES ALDEIA DE CIMA' or zmc = 'NEVES ZONA ALTA' or zmc = 'NEVES ZONA BAIXA' or zmc = 'VILA AZEDO' or zmc = 'PORTO PELES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Neves - Geral' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'NEVES ZONA ALTA' or zmc = 'NEVES ZONA BAIXA' or zmc = 'VILA AZEDO') as t1,
(SELECT 'Neves - Geral' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'NEVES ZONA ALTA' or zmc = 'NEVES ZONA BAIXA' or zmc = 'VILA AZEDO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Neves - Vila Azedo' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'VILA AZEDO') as t1,
(SELECT 'Neves - Vila Azedo' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'VILA AZEDO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Neves - Porto Peles' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'PORTO PELES') as t1,
(SELECT 'Neves - Porto Peles' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'PORTO PELES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Penedo Gordo - Geral' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'PENEDO GORDO' or zmc = 'PENEDOGORDOMOINHO') as t1,
(SELECT 'Penedo Gordo - Geral' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'PENEDO GORDO' or zmc = 'PENEDOGORDOMOINHO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Penedo Gordo - SubZona' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'PENEDOGORDOMOINHO') as t1,
(SELECT 'Penedo Gordo - SubZona' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'PENEDOGORDOMOINHO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Quintos - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'QUINTOS') as t1,
(SELECT 'Quintos - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'QUINTOS')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Salvada' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'SALVADA ZONA 1' or zmc = 'SALVADA ZONA 2') as t1,
(SELECT 'Salvada' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'SALVADA ZONA 1' or zmc = 'SALVADA ZONA 2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Santa Vitória' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'SANTA VITÓRIA') as t1,
(SELECT 'Santa Vitória' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'SANTA VITÓRIA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'São Brissos - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'SÃO BRISSOS') as t1,
(SELECT 'São Brissos - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'SÃO BRISSOS')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'São Matias - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'SÃO MATIAS') as t1,
(SELECT 'São Matias - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'SÃO MATIAS')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Trigaches - Geral' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'TRIGACHES') as t1,
(SELECT 'Trigaches - Geral' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'TRIGACHES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Trigaches - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'TRIGACHES') as t1,
(SELECT 'Trigaches - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'TRIGACHES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Trindade - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'TRINDADE') as t1,
(SELECT 'Trindade - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'TRINDADE')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Vale de Russins - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'VALE DE RUSSINS') as t1,
(SELECT 'Vale de Russins - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'VALE DE RUSSINS')) as t2`;

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

const kpiaquadataTask = async () => {
    try {
        const kpiaquadata = await executeQuery(query);
        //console.log(kpiaquadata);
        console.log(kpiaquadata.length, "records fetched successfully");
        return kpiaquadata;
    } catch (error) {
        console.error('Error fetching kpiaqua data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};
    
export { kpiaquadataTask };

