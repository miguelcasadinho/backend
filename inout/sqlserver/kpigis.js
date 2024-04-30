import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import sql from 'mssql';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const configsql = {
    user: process.env.sqlGisUser,
    password: process.env.sqlGisPassword,
    server: process.env.sqlGisHost,
    database: process.env.sqlGisDatabase,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 15000
    }
};

const pool = new sql.ConnectionPool(configsql);

const query = `SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Albernoa - Saída do reservatório' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-AlbernoaZonaAlta' or ZMC = 'ZMC-AlbernoaZonaBaixa')) as t1,
(SELECT 'Albernoa - Saída do reservatório' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-AlbernoaZonaAlta' or ZMC = 'ZMC-AlbernoaZonaBaixa'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Albernoa - Zona Alta' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-AlbernoaZonaAlta')) as t1,
(SELECT 'Albernoa - Zona Alta' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-AlbernoaZonaAlta'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Albernoa - Zona Baixa' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-AlbernoaZonaBaixa')) as t1,
(SELECT 'Albernoa - Zona Baixa' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-AlbernoaZonaBaixa'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Baleizão - Saída do reservatório' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Baleizão zona alta' or ZMC = 'ZMC-Baleizão zona baixa')) as t1,
(SELECT 'Baleizão - Saída do reservatório' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Baleizão zona alta' or ZMC = 'ZMC-Baleizão zona baixa'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Baleizão - Zona Alta' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Baleizão zona alta')) as t1,
(SELECT 'Baleizão - Zona Alta' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Baleizão zona alta'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Baleizão - Zona Baixa' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Baleizão zona baixa')) as t1,
(SELECT 'Baleizão - Zona Baixa' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Baleizão zona baixa'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZA1' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZA1' or ZMC = 'ZMC-Moinhos Santa Maria')) as t1,
(SELECT 'Beja ZA1' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZA1' or ZMC = 'ZMC-Moinhos Santa Maria'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZA1 - Moinhos Santa Maria' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Moinhos Santa Maria')) as t1,
(SELECT 'Beja ZA1 - Moinhos Santa Maria' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Moinhos Santa Maria'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZA2' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZA2')) as t1,
(SELECT 'Beja ZA2' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZA2'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZA3' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZA3')) as t1,
(SELECT 'Beja ZA3' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZA3'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZA4' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZA4')) as t1,
(SELECT 'Beja ZA4' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZA4'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZA5' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZA5')) as t1,
(SELECT 'Beja ZA5' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZA5'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB1' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZB1' or ZMC = 'ZMC-Bairro da Esperança' or ZMC = 'ZMC-Moinhos Santa Maria Baixa' or ZMC = 'ZMC-Pandora' or ZMC = 'ZMC-Parque Nomada' or ZMC = 'ZMC-BejaMoinhosVelhos' or ZMC = 'ZMC-Fonte Mouro')) as t1,
(SELECT 'Beja ZB1' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZB1' or ZMC = 'ZMC-Bairro da Esperança' or ZMC = 'ZMC-Moinhos Santa Maria Baixa' or ZMC = 'ZMC-Pandora' or ZMC = 'ZMC-Parque Nomada' or ZMC = 'ZMC-BejaMoinhosVelhos' or ZMC = 'ZMC-Fonte Mouro'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB1 - Bairro Esperança' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Bairro da Esperança' or ZMC = 'ZMC-Fonte Mouro')) as t1,
(SELECT 'Beja ZB1 - Bairro Esperança' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Bairro da Esperança' or ZMC = 'ZMC-Fonte Mouro'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB1 - Fonte Mouro' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Fonte Mouro')) as t1,
(SELECT 'Beja ZB1 - Fonte Mouro' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Fonte Mouro'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB1 - Moinhos Santa Maria' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Moinhos Santa Maria Baixa')) as t1,
(SELECT 'Beja ZB1 - Moinhos Santa Maria' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Moinhos Santa Maria Baixa'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB1 - Pandora' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Pandora')) as t1,
(SELECT 'Beja ZB1 - Pandora' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Pandora'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB1 - Parque Nómada' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Parque Nomada')) as t1,
(SELECT 'Beja ZB1 - Parque Nómada' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Parque Nomada'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB2' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZB2' or ZMC = 'ZMC-CidadeSaoPaulo' or ZMC = 'ZMC-Condominio' or ZMC = 'ZMC-FerreiradeCastro' or ZMC = 'ZMC-JuliaoQuintinha' or ZMC = 'ZMC-Padrão' or ZMC = 'ZMC-PatrocinioDias')) as t1,
(SELECT 'Beja ZB2' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZB2' or ZMC = 'ZMC-CidadeSaoPaulo' or ZMC = 'ZMC-Condominio' or ZMC = 'ZMC-FerreiradeCastro' or ZMC = 'ZMC-JuliaoQuintinha' or ZMC = 'ZMC-Padrão' or ZMC = 'ZMC-PatrocinioDias'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB2 - Cidade de São Paulo' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-CidadeSaoPaulo')) as t1,
(SELECT 'Beja ZB2 - Cidade de São Paulo' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-CidadeSaoPaulo'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB2 - Condominio' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Condominio' or ZMC = 'ZMC-Padrão')) as t1,
(SELECT 'Beja ZB2 - Condominio' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Condominio' or ZMC = 'ZMC-Padrão'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB2 - Ferreira de Castro' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-FerreiradeCastro')) as t1,
(SELECT 'Beja ZB2 - Ferreira de Castro' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-FerreiradeCastro'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB2 - Julião Quintinha' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-JuliaoQuintinha')) as t1,
(SELECT 'Beja ZB2 - Julião Quintinha' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-JuliaoQuintinha'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB2 - Padrão' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Padrão')) as t1,
(SELECT 'Beja ZB2 - Padrão' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Padrão'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB2 - Patrocinio Dias' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-PatrocinioDias')) as t1,
(SELECT 'Beja ZB2 - Patrocinio Dias' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-PatrocinioDias'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB2 - Tenente Valadim' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-TenenteValadim')) as t1,
(SELECT 'Beja ZB2 - Tenente Valadim' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-TenenteValadim'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB3' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZB3')) as t1,
(SELECT 'Beja ZB3' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZB3'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB4' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZB4' or ZMC = 'ZMC-RamiroCorreia')) as t1,
(SELECT 'Beja ZB4' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZB4' or ZMC = 'ZMC-RamiroCorreia'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZB5' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZB5')) as t1,
(SELECT 'Beja ZB5' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-ZB5'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZI - Saída do reservatório' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Pelame' or ZMC = 'ZMC-Urbanizacao do Pelame' or ZMC = 'ZMC-ZI1' or ZMC = 'ZMC-Bairro da Conceição' or ZMC = 'ZMC-BairroConceicaoSubZona' or ZMC = 'ZMC-Saibreiras' or ZMC = 'ZMC-Quinta del Rei' or ZMC = 'ZMC-Parque Industrial' or ZMC = 'ZMC-Bairro Sao Miguel' or ZMC = 'ZMC-AldeiaNovaCoitos' or ZMC = 'ZMC-Bairro das Flores')) as t1,
(SELECT 'Beja ZI - Saída do reservatório' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Pelame' or ZMC = 'ZMC-Urbanizacao do Pelame' or ZMC = 'ZMC-ZI1' or ZMC = 'ZMC-Bairro da Conceição' or ZMC = 'ZMC-BairroConceicaoSubZona' or ZMC = 'ZMC-Saibreiras' or ZMC = 'ZMC-Quinta del Rei' or ZMC = 'ZMC-Parque Industrial' or ZMC = 'ZMC-Bairro Sao Miguel' or ZMC = 'ZMC-AldeiaNovaCoitos' or ZMC = 'ZMC-Bairro das Flores'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZI - Bairro da Conceição' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Bairro da Conceição' or ZMC = 'ZMC-BairroConceicaoSubZona' or ZMC = 'ZMC-Saibreiras')) as t1,
(SELECT 'Beja ZI - Bairro da Conceição' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Bairro da Conceição' or ZMC = 'ZMC-BairroConceicaoSubZona' or ZMC = 'ZMC-Saibreiras'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZI - Bairro da Conceição Subzona' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-BairroConceicaoSubZona')) as t1,
(SELECT 'Beja ZI - Bairro da Conceição Subzona' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-BairroConceicaoSubZona'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZI - Parque Industrial' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Parque Industrial' or ZMC = 'ZMC-Bairro Sao Miguel' or ZMC = 'ZMC-AldeiaNovaCoitos' or ZMC = 'ZMC-Bairro das Flores')) as t1,
(SELECT 'Beja ZI - Parque Industrial' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Parque Industrial' or ZMC = 'ZMC-Bairro Sao Miguel' or ZMC = 'ZMC-AldeiaNovaCoitos' or ZMC = 'ZMC-Bairro das Flores'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZI - Bairro de São Miguel' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Bairro Sao Miguel' or ZMC = 'ZMC-AldeiaNovaCoitos' or ZMC = 'ZMC-Bairro das Flores')) as t1,
(SELECT 'Beja ZI - Bairro de São Miguel' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Bairro Sao Miguel' or ZMC = 'ZMC-AldeiaNovaCoitos' or ZMC = 'ZMC-Bairro das Flores'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZI - Pelame vivendas' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Urbanizacao do Pelame')) as t1,
(SELECT 'Beja ZI - Pelame vivendas' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Urbanizacao do Pelame'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beja ZI - Quinta Del Rey' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Quinta del Rei')) as t1,
(SELECT 'Beja ZI - Quinta Del Rey' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Quinta del Rei'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beringel - Saída do reservatório' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Beringel zona alta 1' or ZMC = 'ZMC-Beringel zona alta 2' or ZMC = 'ZMC-Beringel zona baixa 1' or ZMC = 'ZMC-Beringel zona baixa 2')) as t1,
(SELECT 'Beringel - Saída do reservatório' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Beringel zona alta 1' or ZMC = 'ZMC-Beringel zona alta 2' or ZMC = 'ZMC-Beringel zona baixa 1' or ZMC = 'ZMC-Beringel zona baixa 2'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beringel - Zona Baixa 1' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Beringel zona baixa 1')) as t1,
(SELECT 'Beringel - Zona Baixa 1' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Beringel zona baixa 1'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beringel - Zona Baixa 2' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Beringel zona baixa 2')) as t1,
(SELECT 'Beringel - Zona Baixa 2' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Beringel zona baixa 2'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beringel - Zona Norte' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Beringel zona alta 1')) as t1,
(SELECT 'Beringel - Zona Norte' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Beringel zona alta 1'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Beringel - Zona Sul' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Beringel zona alta 2' or ZMC = 'ZMC-Beringel zona baixa 1' or ZMC = 'ZMC-Beringel zona baixa 2')) as t1,
(SELECT 'Beringel - Zona Sul' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Beringel zona alta 2' or ZMC = 'ZMC-Beringel zona baixa 1' or ZMC = 'ZMC-Beringel zona baixa 2'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Boavista' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Boavista')) as t1,
(SELECT 'Boavista' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Boavista'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Cabeça Gorda - Saída do reservatório' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Cabeça Gorda zona 1' or ZMC = 'ZMC-Cabeça Gorda zona 2' or ZMC = 'ZMC-Cabeça Gorda zona 3' or ZMC = 'ZMC-Salvada zona 1' or ZMC = 'ZMC-Salvada zona 2')) as t1,
(SELECT 'Cabeça Gorda - Saída do reservatório' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Cabeça Gorda zona 1' or ZMC = 'ZMC-Cabeça Gorda zona 2' or ZMC = 'ZMC-Cabeça Gorda zona 3' or ZMC = 'ZMC-Salvada zona 1' or ZMC = 'ZMC-Salvada zona 2'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Cabeça Gorda - Zona 1' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Cabeça Gorda zona 1')) as t1,
(SELECT 'Cabeça Gorda - Zona 1' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Cabeça Gorda zona 1'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Cabeça Gorda - Zona 2' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Cabeça Gorda zona 2')) as t1,
(SELECT 'Cabeça Gorda - Zona 2' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Cabeça Gorda zona 2'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Cabeça Gorda - Zona 3' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Cabeça Gorda zona 3')) as t1,
(SELECT 'Cabeça Gorda - Zona 3' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Cabeça Gorda zona 3'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Mina da Juliana' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Mina da Juliana')) as t1,
(SELECT 'Mina da Juliana' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Mina da Juliana'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Mombeja' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Mombeja')) as t1,
(SELECT 'Mombeja' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Mombeja'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Monte da Juliana' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Monte da Juliana')) as t1,
(SELECT 'Monte da Juliana' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Monte da Juliana'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Neves - Saída do reservatório' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Adutora Neves' or ZMC = 'ZMC-Neves Aldeia de Cima' or ZMC = 'ZMC-Neves zona alta' or ZMC = 'ZMC-Neves zona baixa' or ZMC = 'ZMC-Vila Azedo' or ZMC = 'ZMC-Porto Peles')) as t1,
(SELECT 'Neves - Saída do reservatório' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Adutora Neves' or ZMC = 'ZMC-Neves Aldeia de Cima' or ZMC = 'ZMC-Neves zona alta' or ZMC = 'ZMC-Neves zona baixa' or ZMC = 'ZMC-Vila Azedo' or ZMC = 'ZMC-Porto Peles'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Neves - Geral' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Neves zona alta' or ZMC = 'ZMC-Neves zona baixa' or ZMC = 'ZMC-Vila Azedo')) as t1,
(SELECT 'Neves - Geral' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Neves zona alta' or ZMC = 'ZMC-Neves zona baixa' or ZMC = 'ZMC-Vila Azedo'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Neves - Porto Peles' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Porto Peles')) as t1,
(SELECT 'Neves - Porto Peles' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Porto Peles'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Neves - Vila Azedo' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Vila Azedo')) as t1,
(SELECT 'Neves - Vila Azedo' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Vila Azedo'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Penedo Gordo - Geral' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Penedo Gordo' or ZMC = 'ZMC-PenedoGordoMoinho')) as t1,
(SELECT 'Penedo Gordo - Geral' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Penedo Gordo' or ZMC = 'ZMC-PenedoGordoMoinho'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Penedo Gordo - SubZona' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-PenedoGordoMoinho')) as t1,
(SELECT 'Penedo Gordo - SubZona' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-PenedoGordoMoinho'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Quintos - Saída do reservatório' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Quintos')) as t1,
(SELECT 'Quintos - Saída do reservatório' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Quintos'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Salvada' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Salvada zona 1' or ZMC = 'ZMC-Salvada zona 2')) as t1,
(SELECT 'Salvada' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Salvada zona 1' or ZMC = 'ZMC-Salvada zona 2'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Santa Vitória' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Santa Vitória')) as t1,
(SELECT 'Santa Vitória' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Santa Vitória'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'São Brissos - Saída do reservatório' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-São Brissos')) as t1,
(SELECT 'São Brissos - Saída do reservatório' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-São Brissos'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'São Matias - Saída do reservatório' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-São Matias')) as t1,
(SELECT 'São Matias - Saída do reservatório' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-São Matias'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Trigaches - Geral' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Trigaches')) as t1,
(SELECT 'Trigaches - Geral' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Trigaches'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Trigaches - Saída do reservatório' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Trigaches')) as t1,
(SELECT 'Trigaches - Saída do reservatório' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Trigaches'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Trindade - Saída do reservatório' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Trindade')) as t1,
(SELECT 'Trindade - Saída do reservatório' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Trindade'))as t2
union all
SELECT t1.zmc as zmc, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length_med
FROM (SELECT 'Vale de Russins - Saída do reservatório' as zmc, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length FROM aTubagens 
WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Vale de Russins')) as t1,
(SELECT 'Vale de Russins - Saída do reservatório' as zmc, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med
FROM InfraSIG.dbo.aRamais WHERE Proprietario = 'EMAS' AND (ZMC = 'ZMC-Vale de Russins'))as t2`;

const executeQuery = async () => {
    let kpigisdata = [];
    try {
        await pool.connect();
        const result = await pool.request().query(query);
        kpigisdata = result.recordset;
        return kpigisdata;
    } catch (err) {
        throw new Error(`Error executing SQL query: ${err.message}`);
    } finally {
        pool.close();
    }
  };
  
  const kpigisdataTask = async () => {
      try {
        const result = await executeQuery();
        //console.log(result);
        //console.log(result.length, 'records retrieved');
        return result;
      } catch (error) {
        console.error('Error in kpigisdataTask:', error);
      }
  };
  
  export { kpigisdataTask };
