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
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ALBERNOAZONAALTA' or zmc = 'ZMC-ALBERNOAZONABAIXA') as t1,
(SELECT 'Albernoa - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ALBERNOAZONAALTA' or zmc = 'ZMC-ALBERNOAZONABAIXA') ) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Albernoa - Zona Alta' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ALBERNOAZONAALTA') as t1,
(SELECT 'Albernoa - Zona Alta' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ALBERNOAZONAALTA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Albernoa - Zona Baixa' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ALBERNOAZONABAIXA') as t1,
(SELECT 'Albernoa - Zona Alta' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ALBERNOAZONABAIXA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Baleizão - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BALEIZÃO ZONA ALTA' or zmc = 'ZMC-BALEIZÃO ZONA BAIXA') as t1,
(SELECT 'Baleizão - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BALEIZÃO ZONA ALTA' or zmc = 'ZMC-BALEIZÃO ZONA BAIXA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Baleizão - Zona Alta' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BALEIZÃO ZONA ALTA') as t1,
(SELECT 'Baleizão - Zona Alta' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BALEIZÃO ZONA ALTA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Baleizão - Zona Baixa' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BALEIZÃO ZONA BAIXA') as t1,
(SELECT 'Baleizão - Zona Baixa' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BALEIZÃO ZONA BAIXA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZA1' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ZA1' or zmc = 'ZMC-MOINHOS SANTA MARIA') as t1,
(SELECT 'Beja ZA1' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ZA1' or zmc = 'ZMC-MOINHOS SANTA MARIA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZA1 - Moinhos Santa Maria' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-MOINHOS SANTA MARIA') as t1,
(SELECT 'Beja ZA1 - Moinhos Santa Maria' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-MOINHOS SANTA MARIA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZA2' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ZA2') as t1,
(SELECT 'Beja ZA2' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ZA2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZA3' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ZA3') as t1,
(SELECT 'Beja ZA3' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ZA3')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZA4' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ZA4') as t1,
(SELECT 'Beja ZA4' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ZA4')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZA5' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ZA5') as t1,
(SELECT 'Beja ZA5' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ZA5')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB1' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ZB1' or zmc = 'ZMC-BAIRRO DA ESPERANÇA' or zmc = 'ZMC-MOINHOS SANTA MARIA BAIXA' or zmc = 'ZMC-PANDORA' or zmc = 'ZMC-PARQUE NOMADA' or zmc = 'ZMC-BEJAMOINHOSVELHOS' or zmc = 'ZMC-FONTE MOURO') as t1,
(SELECT 'Beja ZB1' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ZB1' or zmc = 'ZMC-BAIRRO DA ESPERANÇA' or zmc = 'ZMC-MOINHOS SANTA MARIA BAIXA' or zmc = 'ZMC-PANDORA' or zmc = 'ZMC-PARQUE NOMADA' or zmc = 'ZMC-BEJAMOINHOSVELHOS' or zmc = 'ZMC-FONTE MOURO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB1 - Bairro Esperança' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BAIRRO DA ESPERANÇA' or zmc = 'ZMC-FONTE MOURO') as t1,
(SELECT 'Beja ZB1 - Bairro Esperança' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BAIRRO DA ESPERANÇA' or zmc = 'ZMC-FONTE MOURO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB1 - Fonte Mouro' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-FONTE MOURO') as t1,
(SELECT 'Beja ZB1 - Fonte Mouro' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-FONTE MOURO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB1 - Moinhos Santa Maria' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-MOINHOS SANTA MARIA BAIXA') as t1,
(SELECT 'Beja ZB1 - Moinhos Santa Maria' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-MOINHOS SANTA MARIA BAIXA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB1 - Pandora' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-PANDORA') as t1,
(SELECT 'Beja ZB1 - Pandora' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-PANDORA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB1 - Moinhos Velhos' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BEJAMOINHOSVELHOS' or zmc = 'ZMC-PARQUE NOMADA') as t1,
(SELECT 'Beja ZB1 - Moinhos Velhos' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BEJAMOINHOSVELHOS' or zmc = 'ZMC-PARQUE NOMADA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB1 - Parque Nómada' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-PARQUE NOMADA') as t1,
(SELECT 'Beja ZB1 - Parque Nómada' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-PARQUE NOMADA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ZB2' or zmc = 'ZMC-CIDADESAOPAULO' or zmc = 'ZMC-CONDOMINIO' or zmc = 'ZMC-FERREIRADECASTRO' or zmc = 'ZMC-JULIAOQUINTINHA' or zmc = 'ZMC-PADRÃO' or zmc = 'ZMC-PATROCINIODIAS' or zmc = 'ZMC-TENENTEVALADIM') as t1,
(SELECT 'Beja ZB2' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ZB2' or zmc = 'ZMC-CIDADESAOPAULO' or zmc = 'ZMC-CONDOMINIO' or zmc = 'ZMC-FERREIRADECASTRO' or zmc = 'ZMC-JULIAOQUINTINHA' or zmc = 'ZMC-PADRÃO' or zmc = 'ZMC-PATROCINIODIAS' or zmc = 'ZMC-TENENTEVALADIM')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Cidade de São Paulo' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-CIDADESAOPAULO') as t1,
(SELECT 'Beja ZB2 - Cidade de São Paulo' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-CIDADESAOPAULO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Condominio' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-CONDOMINIO' or zmc = 'ZMC-PADRÃO') as t1,
(SELECT 'Beja ZB2 - Condominio' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-CONDOMINIO' or zmc = 'ZMC-PADRÃO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Ferreira de Castro' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-FERREIRADECASTRO') as t1,
(SELECT 'Beja ZB2 - Ferreira de Castro' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-FERREIRADECASTRO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Julião Quintinha' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-JULIAOQUINTINHA') as t1,
(SELECT 'Beja ZB2 - Julião Quintinha' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-JULIAOQUINTINHA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Padrão' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-PADRÃO') as t1,
(SELECT 'Beja ZB2 - Padrão' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-PADRÃO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Patrocinio Dias' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-PATROCINIODIAS') as t1,
(SELECT 'Beja ZB2 - Patrocinio Dias' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-PATROCINIODIAS')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB2 - Tenente Valadim' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'TENENTEVALADIM') as t1,
(SELECT 'Beja ZB2 - Tenente Valadim' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'TENENTEVALADIM')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB3' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ZB3') as t1,
(SELECT 'Beja ZB3' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ZB3')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB4' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ZB4' or zmc = 'ZMC-RAMIROCORREIA') as t1,
(SELECT 'Beja ZB4' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ZB4' or zmc = 'ZMC-RAMIROCORREIA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZB5' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ZB5') as t1,
(SELECT 'Beja ZB5' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ZB5')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-PELAME' or zmc = 'ZMC-URBANIZACAO DO PELAME' or zmc = 'ZMC-ZI1' or zmc = 'ZMC-BAIRRO DA CONCEIÇÃO' or zmc = 'ZMC-BAIRROCONCEICAOSUBZONA' or zmc = 'ZMC-SAIBREIRAS' or zmc = 'ZMC-QUINTA DEL REI' or zmc = 'ZMC-PARQUE INDUSTRIAL' or zmc = 'ZMC-BAIRRO DE SÃO MIGUEL' or zmc = 'ZMC-ALDEIANOVACOITOS' or zmc = 'ZMC-BAIRRO DAS FLORES') as t1,
(SELECT 'Beja ZI - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-PELAME' or zmc = 'ZMC-URBANIZACAO DO PELAME' or zmc = 'ZMC-ZI1' or zmc = 'ZMC-BAIRRO DA CONCEIÇÃO' or zmc = 'ZMC-BAIRROCONCEICAOSUBZONA' or zmc = 'ZMC-SAIBREIRAS' or zmc = 'ZMC-QUINTA DEL REI' or zmc = 'ZMC-PARQUE INDUSTRIAL' or zmc = 'ZMC-BAIRRO DE SÃO MIGUEL' or zmc = 'ZMC-ALDEIANOVACOITOS' or zmc = 'ZMC-BAIRRO DAS FLORES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Bairro da Conceição' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BAIRRO DA CONCEIÇÃO' or zmc = 'ZMC-BAIRROCONCEICAOSUBZONA' or zmc = 'ZMC-SAIBREIRAS') as t1,
(SELECT 'Beja ZI - Bairro da Conceição' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BAIRRO DA CONCEIÇÃO' or zmc = 'ZMC-BAIRROCONCEICAOSUBZONA' or zmc = 'ZMC-SAIBREIRAS')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Bairro da Conceição Subzona' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BAIRROCONCEICAOSUBZONA') as t1,
(SELECT 'Beja ZI - Bairro da Conceição Subzona' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BAIRROCONCEICAOSUBZONA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Parque Industrial' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-PARQUE INDUSTRIAL' or zmc = 'ZMC-BAIRRO DE SÃO MIGUEL' or zmc = 'ZMC-ALDEIANOVACOITOS' or zmc = 'ZMC-BAIRRO DAS FLORES') as t1,
(SELECT 'Beja ZI - Parque Industrial' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-PARQUE INDUSTRIAL' or zmc = 'ZMC-BAIRRO DE SÃO MIGUEL' or zmc = 'ZMC-ALDEIANOVACOITOS' or zmc = 'ZMC-BAIRRO DAS FLORES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Bairro de São Miguel' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BAIRRO DE SÃO MIGUEL' or zmc = 'ZMC-ALDEIANOVACOITOS' or zmc = 'ZMC-BAIRRO DAS FLORES') as t1,
(SELECT 'Beja ZI - Bairro de São Miguel' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BAIRRO DE SÃO MIGUEL' or zmc = 'ZMC-ALDEIANOVACOITOS' or zmc = 'ZMC-BAIRRO DAS FLORES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Pelame vivendas' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-URBANIZACAO DO PELAME') as t1,
(SELECT 'Beja ZI - Pelame vivendas' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-URBANIZACAO DO PELAME')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beja ZI - Quinta Del Rey' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-QUINTA DEL REI') as t1,
(SELECT 'Beja ZI - Quinta Del Rey' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-QUINTA DEL REI')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beringel - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BERINGEL ZONA ALTA 1' or zmc = 'ZMC-BERINGEL ZONA ALTA 2' or zmc = 'ZMC-BERINGEL ZONA BAIXA 1' or zmc = 'ZMC-BERINGEL ZONA BAIXA 2') as t1,
(SELECT 'Beringel - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BERINGEL ZONA ALTA 1' or zmc = 'ZMC-ZMC-BERINGEL ZONA ALTA 2' or zmc = 'ZMC-BERINGEL ZONA BAIXA 1' or zmc = 'ZMC-BERINGEL ZONA BAIXA 2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beringel - Zona Sul' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BERINGEL ZONA ALTA 2' or zmc = 'ZMC-BERINGEL ZONA BAIXA 1' or zmc = 'ZMC-BERINGEL ZONA BAIXA 2') as t1,
(SELECT 'Beringel - Zona Sul' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BERINGEL ZONA ALTA 2' or zmc = 'ZMC-BERINGEL ZONA BAIXA 1' or zmc = 'ZMC-BERINGEL ZONA BAIXA 2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beringel - Zona Baixa 1' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BERINGEL ZONA BAIXA 1') as t1,
(SELECT 'Beringel - Zona Baixa 1' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BERINGEL ZONA BAIXA 1')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beringel - Zona Baixa 2' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BERINGEL ZONA BAIXA 2') as t1,
(SELECT 'Beringel - Zona Baixa 2' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BERINGEL ZONA BAIXA 2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Beringel - Zona Norte' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BERINGEL ZONA ALTA 1') as t1,
(SELECT 'Beringel - Zona Norte' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BERINGEL ZONA ALTA 1')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Boavista' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-BOAVISTA') as t1,
(SELECT 'Boavista' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-BOAVISTA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Cabeça Gorda - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-CABEÇA GORDA ZONA 1' or zmc = 'ZMC-CABEÇA GORDA ZONA 2' or zmc = 'ZMC-CABEÇA GORDA ZONA 3' or zmc = 'SALVADA ZONA 1' or zmc = 'SALVADA ZONA 2') as t1,
(SELECT 'Cabeça Gorda - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-CABEÇA GORDA ZONA 1' or zmc = 'ZMC-CABEÇA GORDA ZONA 2' or zmc = 'ZMC-CABEÇA GORDA ZONA 3' or zmc = 'SALVADA ZONA 1' or zmc = 'SALVADA ZONA 2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Cabeça Gorda - Zona 1' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-CABEÇA GORDA ZONA 1') as t1,
(SELECT 'Cabeça Gorda - Zona 1' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-CABEÇA GORDA ZONA 1')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Cabeça Gorda - Zona 2' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-CABEÇA GORDA ZONA 2') as t1,
(SELECT 'Cabeça Gorda - Zona 2' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-CABEÇA GORDA ZONA 2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Cabeça Gorda - Zona 3' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-CABEÇA GORDA ZONA 3') as t1,
(SELECT 'Cabeça Gorda - Zona 3' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-CABEÇA GORDA ZONA 3')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Mina da Juliana' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-MINA DA JULIANA') as t1,
(SELECT 'Mina da Juliana' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-MINA DA JULIANA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Mombeja' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-MOMBEJA') as t1,
(SELECT 'Mombeja' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-MOMBEJA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Monte da Juliana' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-MONTE DA JULIANA') as t1,
(SELECT 'Monte da Juliana' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-MONTE DA JULIANA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Neves - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-ADUTORA NEVES' or zmc = 'ZMC-NEVES ALDEIA DE CIMA' or zmc = 'ZMC-NEVES ZONA ALTA' or zmc = 'ZMC-NEVES ZONA BAIXA' or zmc = 'ZMC-VILA AZEDO' or zmc = 'ZMC-PORTO PELES') as t1,
(SELECT 'Neves - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-ADUTORA NEVES' or zmc = 'ZMC-NEVES ALDEIA DE CIMA' or zmc = 'ZMC-NEVES ZONA ALTA' or zmc = 'ZMC-NEVES ZONA BAIXA' or zmc = 'ZMC-VILA AZEDO' or zmc = 'ZMC-PORTO PELES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Neves - Geral' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-NEVES ZONA ALTA' or zmc = 'ZMC-NEVES ZONA BAIXA' or zmc = 'ZMC-VILA AZEDO') as t1,
(SELECT 'Neves - Geral' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-NEVES ZONA ALTA' or zmc = 'ZMC-NEVES ZONA BAIXA' or zmc = 'ZMC-VILA AZEDO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Neves - Vila Azedo' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-VILA AZEDO') as t1,
(SELECT 'Neves - Vila Azedo' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-VILA AZEDO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Neves - Porto Peles' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-PORTO PELES') as t1,
(SELECT 'Neves - Porto Peles' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-PORTO PELES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Penedo Gordo - Geral' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-PENEDO GORDO' or zmc = 'ZMC-PENEDOGORDOMOINHO') as t1,
(SELECT 'Penedo Gordo - Geral' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-PENEDO GORDO' or zmc = 'ZMC-PENEDOGORDOMOINHO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Penedo Gordo - SubZona' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-PENEDOGORDOMOINHO') as t1,
(SELECT 'Penedo Gordo - SubZona' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-PENEDOGORDOMOINHO')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Quintos - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-QUINTOS') as t1,
(SELECT 'Quintos - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-QUINTOS')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Salvada' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-SALVADA ZONA 1' or zmc = 'ZMC-SALVADA ZONA 2') as t1,
(SELECT 'Salvada' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-SALVADA ZONA 1' or zmc = 'ZMC-SALVADA ZONA 2')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Santa Vitória' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-SANTA VITÓRIA') as t1,
(SELECT 'Santa Vitória' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-SANTA VITÓRIA')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'São Brissos - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-SÃO BRISSOS') as t1,
(SELECT 'São Brissos - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-SÃO BRISSOS')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'São Matias - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-SÃO MATIAS') as t1,
(SELECT 'São Matias - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-SÃO MATIAS')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Trigaches - Geral' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-TRIGACHES') as t1,
(SELECT 'Trigaches - Geral' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-TRIGACHES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Trigaches - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-TRIGACHES') as t1,
(SELECT 'Trigaches - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-TRIGACHES')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Trindade - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-TRINDADE') as t1,
(SELECT 'Trindade - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-TRINDADE')) as t2
union all
SELECT t1.zmc, t1.clients, t2.clientsdom
from (select 'Vale de Russins - Saída do reservatório' as zmc, Count(infocontrato.local) as clients FROM infocontrato 
left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where zmc = 'ZMC-VALE DE RUSSINS') as t1,
(SELECT 'Vale de Russins - Saída do reservatório' as zmc, Count(infocontrato.local) as clientsdom FROM infocontrato left join(select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua
on infocontrato.ramal = ramaisrua.ramal where client_group = 'DOMÉSTICOS' and (zmc = 'ZMC-VALE DE RUSSINS')) as t2`;

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
        //console.log(kpiaquadata.length, "records fetched successfully");
        return kpiaquadata;
    } catch (error) {
        console.error('Error fetching kpiaqua data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};
    
export { kpiaquadataTask };


