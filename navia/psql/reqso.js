import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const pool = new pg.Pool({
    host: process.env.psqlNaviaHost,
    port: process.env.psqlNaviaPort,
    user: process.env.psqlNaviaUser,
    password: process.env.psqlNaviaPassword,
    database: process.env.psqlNaviaDatabase
});

const query = `
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Albernoa - Saída do reservatório' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Albernoa Zona Alta' or toponymies.dma = 'Albernoa Zona Baixa')) as t1,
(SELECT cast('Albernoa - Saída do reservatório' as text)  as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Albernoa Zona Alta' or vw.service_orders.dma = 'Albernoa Zona Baixa')) as t2   
UNION all
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Albernoa - Zona Alta' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Albernoa Zona Alta')) as t1,
(SELECT cast('Albernoa - Zona Alta' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Albernoa Zona Alta')) as t2
UNION all
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Albernoa - Zona Baixa' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Albernoa Zona Baixa')) as t1,
(SELECT cast('Albernoa - Zona Baixa' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Albernoa Zona Baixa')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Baleizão - Saída do reservatório' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Baleizão Zona Alta' or toponymies.dma = 'Baleizão Zona Baixa')) as t1,
(SELECT cast('Baleizão - Saída do reservatório' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Baleizão Zona Alta' or vw.service_orders.dma = 'Baleizão Zona Baixa')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Baleizão - Zona Alta' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Baleizão Zona Alta')) as t1,
(SELECT cast('Baleizão - Zona Alta' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Baleizão Zona Alta')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Baleizão - Zona Baixa' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Baleizão Zona Baixa')) as t1,
(SELECT cast('Baleizão - Zona Baixa' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Baleizão Zona Baixa')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZA1' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZA1' or toponymies.dma ='Beja ZA1 Moinhos Sta Maria')) as t1,
(SELECT cast('Beja ZA1' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZA1' or vw.service_orders.dma = 'Beja ZA1 Moinhos Sta Maria')) as t2		
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZA1 - Moinhos Santa Maria' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma ='Beja ZA1 Moinhos Sta Maria')) as t1,
(SELECT cast('Beja ZA1 - Moinhos Santa Maria' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZA1 Moinhos Sta Maria')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZA2' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma ='Beja ZA2')) as t1,
(SELECT cast('Beja ZA2' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZA2')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZA3' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma ='Beja ZA3')) as t1,
(SELECT cast('Beja ZA3' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZA3')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZA4' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma ='Beja ZA4')) as t1,
(SELECT cast('Beja ZA4' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZA4')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZA5' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma ='Beja ZA5')) as t1,
(SELECT cast('Beja ZA5' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZA5')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB1' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma ='Beja ZB1' or toponymies.dma ='Beja ZB1 Bairro da Esperança' or toponymies.dma = 'Beja ZB1 Fonte Mouro' or toponymies.dma = 'Beja ZB1 Moinhos Sta Maria' or toponymies.dma = 'Beja ZB1 Moinhos Velhos' or toponymies.dma = 'Beja ZB1 Pandora' or toponymies.dma = 'Beja ZB1 Parque Nomada')) as t1,
(SELECT cast('Beja ZB1' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB1' or vw.service_orders.dma = 'Beja ZB1 Bairro da Esperança' or vw.service_orders.dma = 'Beja ZB1 Fonte Mouro' or vw.service_orders.dma = 'Beja ZB1 Moinhos Sta Maria' or vw.service_orders.dma = 'Beja ZB1 Moinhos Velhos' or vw.service_orders.dma = 'Beja ZB1 Pandora' or vw.service_orders.dma = 'Beja ZB1 Parque Nomada')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB1 - Bairro Esperança' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma ='Beja ZB1 Bairro da Esperança' or toponymies.dma = 'Beja ZB1 Fonte Mouro')) as t1,
(SELECT cast('Beja ZB1 - Bairro Esperança' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB1 Bairro da Esperança' or vw.service_orders.dma = 'Beja ZB1 Fonte Mouro')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB1 - Fonte Mouro' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB1 Fonte Mouro')) as t1,
(SELECT cast('Beja ZB1 - Fonte Mouro' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB1 Fonte Mouro')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB1 - Moinhos Santa Maria' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB1 Moinhos Sta Maria')) as t1,
(SELECT cast('Beja ZB1 - Moinhos Santa Maria' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB1 Moinhos Sta Maria')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB1 - Moinhos Velhos' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB1 Moinhos Velhos')) as t1,
(SELECT cast('Beja ZB1 - Moinhos Velhos' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB1 Moinhos Velhos')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB1 - Pandora' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB1 Pandora')) as t1,
(SELECT cast('Beja ZB1 - Pandora' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB1 Pandora')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB1 - Parque Nómada' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB1 Parque Nomada')) as t1,
(SELECT cast('Beja ZB1 - Parque Nómada' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB1 Parque Nomada')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB2' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma ='Beja ZB2' or toponymies.dma ='Beja ZB2 Cidade São Paulo' or toponymies.dma = 'Beja ZB2 Condominio' or toponymies.dma = 'Beja ZB2 Ferreira de Castro' or toponymies.dma = 'Beja ZB2 Julião Quintinha' or toponymies.dma = 'Beja ZB2 Patrocinio Dias' or toponymies.dma = 'Beja ZB2 Padrão')) as t1,
(SELECT cast('Beja ZB2' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB2' or vw.service_orders.dma = 'Beja ZB2 Cidade São Paulo' or vw.service_orders.dma = 'Beja ZB2 Condominio' or vw.service_orders.dma = 'Beja ZB2 Ferreira de Castro' or vw.service_orders.dma = 'Beja ZB2 Julião Quintinha' or vw.service_orders.dma = 'Beja ZB2 Patrocinio Dias' or vw.service_orders.dma = 'Beja ZB2 Padrão')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB2 - Cidade de São Paulo' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma ='Beja ZB2 Cidade São Paulo')) as t1,
(SELECT cast('Beja ZB2 - Cidade de São Paulo' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB2 Cidade São Paulo')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB2 - Condominio' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB2 Condominio' or toponymies.dma = 'Beja ZB2 Padrão')) as t1,
(SELECT cast('Beja ZB2 - Condominio' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB2 Condominio' or vw.service_orders.dma = 'Beja ZB2 Padrão')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB2 - Ferreira de Castro' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB2 Ferreira de Castro')) as t1,
(SELECT cast('Beja ZB2 - Ferreira de Castro' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB2 Ferreira de Castro')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB2 - Julião Quintinha' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB2 Julião Quintinha')) as t1,
(SELECT cast('Beja ZB2 - Julião Quintinha' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB2 Julião Quintinha')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB2 - Patrocinio Dias' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB2 Patrocinio Dias')) as t1,
(SELECT cast('Beja ZB2 - Patrocinio Dias' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB2 Patrocinio Dias')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB2 - Tenente Valadim' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB2 Tenente Valadim')) as t1,
(SELECT cast('Beja ZB2 - Tenente Valadim' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB2 Tenente Valadim')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB2 - Padrão' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB2 Padrão')) as t1,
(SELECT cast('Beja ZB2 - Padrão' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB2 Padrão')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB3' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB3')) as t1,
(SELECT cast('Beja ZB3' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB3')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB4' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select distinct on (id_request) id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select distinct on (id_request) id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select distinct on (id_request) id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB4' or toponymies.dma = 'Beja ZB4 Ramiro Correia')) as t1,
(SELECT cast('Beja ZB4' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB4' or vw.service_orders.dma = 'Beja ZB4 Ramiro Correia')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB4 - Ramiro Correia' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB4 Ramiro Correia')) as t1,
(SELECT cast('Beja ZB4 - Ramiro Correia' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB4 Ramiro Correia')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZB5' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZB5')) as t1,
(SELECT cast('Beja ZB5' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZB5')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZI - Saída do reservatório' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma ='Beja ZI' or toponymies.dma ='Beja ZI Bairro da Conceição' or toponymies.dma = 'Beja ZI Bairro da Conceição SubZona' or toponymies.dma = 'Beja ZI Bairro das Flores' or toponymies.dma = 'Beja ZI Bairro das Saibreiras' or toponymies.dma = 'Beja ZI Bairro do Pelame' or toponymies.dma = 'Beja ZI Bairro São Miguel' or toponymies.dma = 'Beja ZI Parque Industrial' or toponymies.dma = 'Beja ZI Quinta del Rei' or toponymies.dma = 'Beja ZI Urbanização do Pelame')) as t1,
(SELECT cast('Beja ZI - Saída do reservatório' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZI' or vw.service_orders.dma = 'Beja ZI Bairro da Conceição' or vw.service_orders.dma = 'Beja ZI Bairro da Conceição SubZona' or vw.service_orders.dma = 'Beja ZI Bairro das Flores' or vw.service_orders.dma = 'Beja ZI Bairro das Saibreiras' or vw.service_orders.dma = 'Beja ZI Bairro do Pelame' or vw.service_orders.dma = 'Beja ZI Bairro São Miguel' or vw.service_orders.dma = 'Beja ZI Parque Industrial' or vw.service_orders.dma = 'Beja ZI Quinta del Rei' or vw.service_orders.dma = 'Beja ZI Urbanização do Pelame')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZI - Bairro da Conceição' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma ='Beja ZI Bairro da Conceição' or toponymies.dma = 'Beja ZI Bairro da Conceição SubZona' or toponymies.dma = 'Beja ZI Bairro das Saibreiras')) as t1,
(SELECT cast('Beja ZI - Bairro da Conceição' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZI Bairro da Conceição' or vw.service_orders.dma = 'Beja ZI Bairro da Conceição SubZona' or vw.service_orders.dma = 'Beja ZI Bairro das Saibreiras')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZI - Bairro da Conceição Subzona' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZI Bairro da Conceição SubZona')) as t1,
(SELECT cast('Beja ZI - Bairro da Conceição Subzona' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZI Bairro da Conceição SubZona')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZI - Bairro das Saibreiras' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZI Bairro das Saibreiras')) as t1,
(SELECT cast('Beja ZI - Bairro das Saibreiras' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZI Bairro das Saibreiras')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZI - Bairro de São Miguel' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZI Bairro das Flores' or toponymies.dma = 'Beja ZI Bairro São Miguel')) as t1,
(SELECT cast('Beja ZI - Bairro de São Miguel' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZI Bairro das Flores' or vw.service_orders.dma = 'Beja ZI Bairro São Miguel')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZI - Parque Industrial' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZI Bairro das Flores' or toponymies.dma = 'Beja ZI Bairro São Miguel' or toponymies.dma = 'Beja ZI Parque Industrial')) as t1,
(SELECT cast('Beja ZI - Parque Industrial' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZI Parque Industrial' or vw.service_orders.dma = 'Beja ZI Bairro das Flores' or vw.service_orders.dma = 'Beja ZI Bairro São Miguel')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZI - Pelame vivendas' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZI Urbanização do Pelame')) as t1,
(SELECT cast('Beja ZI - Pelame vivendas' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZI Urbanização do Pelame')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZI - Quinta Del Rey' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZI Quinta del Rei')) as t1,
(SELECT cast('Beja ZI - Quinta Del Rey' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZI Quinta del Rei')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beja ZI - Bairro do Pelame' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beja ZI Bairro do Pelame')) as t1,
(SELECT cast('Beja ZI - Bairro do Pelame' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beja ZI Bairro do Pelame')) as t2
UNION ALL 
select t1.zmc as zmc, t1.requests, t2.orders from		
(SELECT cast('Beringel - Saída do reservatório' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beringel Zona Alta 1' or toponymies.dma = 'Beringel Zona Alta 2' or toponymies.dma = 'Beringel Zona Baixa 1' or toponymies.dma = 'Beringel Zona Baixa 2')) as t1,
(SELECT cast('Beringel - Saída do reservatório' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beringel Zona Alta 1' or vw.service_orders.dma = 'Beringel Zona Alta 2' or vw.service_orders.dma = 'Beringel Zona Baixa 1' or vw.service_orders.dma = 'Beringel Zona Baixa 2')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from	
(SELECT cast('Beringel - Zona Baixa 1' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beringel Zona Baixa 1')) as t1,
(SELECT cast('Beringel - Zona Baixa 1' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beringel Zona Baixa 1')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beringel - Zona Baixa 2' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beringel Zona Baixa 2')) as t1,
(SELECT cast('Beringel - Zona Baixa 2' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beringel Zona Baixa 2')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beringel - Zona Norte' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beringel Zona Alta 1')) as t1,
(SELECT cast('Beringel - Zona Norte' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beringel Zona Alta 1')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Beringel - Zona Sul' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Beringel Zona Alta 2' or toponymies.dma = 'Beringel Zona Baixa 1' or toponymies.dma = 'Beringel Zona Baixa 2')) as t1,
(SELECT cast('Beringel - Zona Sul' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Beringel Zona Alta 2' or vw.service_orders.dma = 'Beringel Zona Baixa 1' or vw.service_orders.dma = 'Beringel Zona Baixa 2')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Boavista' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Boavista')) as t1,
(SELECT cast('Boavista' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Boavista')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Cabeça Gorda - Saída do reservatório' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Cabeça Gorda Zona 1' or toponymies.dma = 'Cabeça Gorda Zona 2' or toponymies.dma = 'Cabeça Gorda Zona 3' or toponymies.dma = 'Salvada Zona 1' or toponymies.dma = 'Salvada Zona 2')) as t1,
(SELECT cast('Cabeça Gorda - Saída do reservatório' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Cabeça Gorda Zona 1' or vw.service_orders.dma = 'Cabeça Gorda Zona 2' or vw.service_orders.dma = 'Cabeça Gorda Zona 3' or vw.service_orders.dma = 'Salvada Zona 1' or vw.service_orders.dma = 'Salvada Zona 2')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Cabeça Gorda - Zona 1' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Cabeça Gorda Zona 1')) as t1,
(SELECT cast('Cabeça Gorda - Zona 1' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Cabeça Gorda Zona 1')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Cabeça Gorda - Zona 2' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Cabeça Gorda Zona 2')) as t1,
(SELECT cast('Cabeça Gorda - Zona 2' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Cabeça Gorda Zona 2')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Cabeça Gorda - Zona 3' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Cabeça Gorda Zona 3')) as t1,
(SELECT cast('Cabeça Gorda - Zona 3' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Cabeça Gorda Zona 3')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Mina da Juliana' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Mina da Juliana')) as t1,
(SELECT cast('Mina da Juliana' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Mina da Juliana')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Mombeja' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Mombeja')) as t1,
(SELECT cast('Mombeja' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Mombeja')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Monte da Juliana' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Monte da Juliana')) as t1,
(SELECT cast('Monte da Juliana' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Monte da Juliana')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Neves - Saída do reservatório' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Adutora de Neves' or toponymies.dma = 'Neves Aldeia de Cima' or toponymies.dma = 'Neves Zona Alta' or toponymies.dma = 'Neves Zona Baixa' or toponymies.dma = 'Vila Azedo' or toponymies.dma = 'Porto Peles')) as t1,
(SELECT cast('Neves - Saída do reservatório' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Adutora de Neves' or vw.service_orders.dma = 'Neves Aldeia de Cima' or vw.service_orders.dma = 'Neves Zona Alta' or vw.service_orders.dma = 'Neves Zona Baixa' or vw.service_orders.dma = 'Vila Azedo' or vw.service_orders.dma = 'Porto Peles')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Neves - Geral' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Neves Zona Alta' or toponymies.dma = 'Neves Zona Baixa' or toponymies.dma = 'Vila Azedo')) as t1,
(SELECT cast('Neves - Geral' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Neves Zona Alta' or vw.service_orders.dma = 'Neves Zona Baixa' or vw.service_orders.dma = 'Vila Azedo')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Neves - Zona Alta' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Neves Zona Alta' or toponymies.dma = 'Vila Azedo')) as t1,
(SELECT cast('Neves - Zona Alta' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Neves Zona Alta' or vw.service_orders.dma = 'Vila Azedo')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Neves - Zona Baixa' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Neves Zona Baixa')) as t1,
(SELECT cast('Neves - Zona Baixa' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Neves Zona Baixa')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Neves - Vila Azedo' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Vila Azedo')) as t1,
(SELECT cast('Neves - Vila Azedo' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Vila Azedo')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Neves - Porto Peles' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Porto Peles')) as t1,
(SELECT cast('Neves - Porto Peles' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Porto Peles')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Penedo Gordo - Geral' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Penedo Gordo' or toponymies.dma = 'Penedo Gordo Subzona')) as t1,
(SELECT cast('Penedo Gordo - Geral' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Penedo Gordo' or vw.service_orders.dma = 'Penedo Gordo Subzona' )) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Penedo Gordo - SubZona' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Penedo Gordo Subzona')) as t1,
(SELECT cast('Penedo Gordo - SubZona' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Penedo Gordo Subzona' )) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Quintos - Saída do reservatório' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Quintos')) as t1,
(SELECT cast('Quintos - Saída do reservatório' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Quintos' )) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Salvada' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Salvada Zona 1' or toponymies.dma = 'Salvada Zona 2')) as t1,
(SELECT cast('Salvada' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Salvada Zona 1' or vw.service_orders.dma = 'Salvada Zona 2')) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Salvada - Zona 1' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Salvada Zona 1')) as t1,
(SELECT cast('Salvada - Zona 1' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Salvada Zona 1' )) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Salvada - Zona 2' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Salvada Zona 2')) as t1,
(SELECT cast('Salvada - Zona 2' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Salvada Zona 2' )) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Santa Vitória' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Santa Vitória')) as t1,
(SELECT cast('Santa Vitória' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Santa Vitória' )) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('São Brissos - Saída do reservatório' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'São Brissos')) as t1,
(SELECT cast('São Brissos - Saída do reservatório' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'São Brissos' )) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('São Matias - Saída do reservatório' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'São Matias')) as t1,
(SELECT cast('São Matias - Saída do reservatório' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'São Matias' )) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Trigaches - Geral' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Trigaches')) as t1,
(SELECT cast('Trigaches - Geral' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Trigaches' )) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Trigaches - Saída do reservatório' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Trigaches')) as t1,
(SELECT cast('Trigaches - Saída do reservatório' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Trigaches' )) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Trindade - Saída do reservatório' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Trindade')) as t1,
(SELECT cast('Trindade - Saída do reservatório' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Trindade' )) as t2
UNION ALL
select t1.zmc as zmc, t1.requests, t2.orders from
(SELECT cast('Vale de Russins - Saída do reservatório' as text) as zmc, count(vw.requests.id_request) as requests FROM vw.requests
left join (select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures on vw.requests.id_request = request_address_infrastructures.id_request
left join (select id_address, dma, toponymies.street from vw.toponymies) as toponymies on request_address_infrastructures.id_address = toponymies.id_address
left join (select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders on vw.requests.id_request = request_r_service_orders.request
left join (select id_request, state from vw.service_orders) as service_orders on vw.requests.id_request = service_orders.id_request  
WHERE vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS' 
AND (vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND (request_r_service_orders.request is NULL or service_orders.state = 'Não executada')
AND toponymies.street is not NULL
AND (toponymies.dma = 'Vale de Russins')) as t1,
(SELECT cast('Vale de Russins - Saída do reservatório' as text) as zmc, count(vw.service_orders.id_service_order) as orders  FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order ,string_agg(vw.service_orders_cause_work.work, ', ') as work
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE vw.service_orders.date_hour_executed >= now() - interval '24 hours'
AND (workcause.work LIKE '%Reparação de ramal de abastecimento%' OR workcause.work LIKE '%Reparação de conduta%' OR workcause.work LIKE '%Substituição de ramal de abastecimento%')
AND (vw.service_orders.dma = 'Vale de Russins' )) as t2                
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

const resoTask = async () => {
    try {
        const reqsodata = await executeQuery(query);
        //console.log(reqsodata.length, "records fetched successfully");
        return reqsodata;
    } catch (error) {
        console.error('Error fetching requests, service orders data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { resoTask };


