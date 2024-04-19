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

const query = `select t1.zmc, t3.age, t4.meters, t1.bad, t2.check  from(
    select ramaisrua.zmc, count(infocontrato.infocontrato_id) as bad from infocontrato
    left join (select meters.local, meters.volume from meters) as meters on infocontrato.local = meters.local
    left join (select ramaisrua.ramal, ramaisrua.zmc from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
    where
    ((infocontrato.dn = 15 AND infocontrato.year > extract(year from CURRENT_DATE) - 12) AND meters.volume >= 1500) OR
    (infocontrato.dn = 15 AND infocontrato.year <= extract(year from CURRENT_DATE) - 12)OR
    ((infocontrato.dn = 20 AND infocontrato.year > extract(year from CURRENT_DATE) - 12) AND meters.volume >= 4000) OR
    (infocontrato.dn = 20 AND infocontrato.year <= extract(year from CURRENT_DATE) - 12) OR 
    ((infocontrato.dn = 25 AND infocontrato.year > extract(year from CURRENT_DATE) - 8) AND meters.volume >= 12500) OR
    (infocontrato.dn = 25 AND infocontrato.year <= extract(year from CURRENT_DATE) - 8) OR
    ((infocontrato.dn = 30 AND infocontrato.year > extract(year from CURRENT_DATE) - 8) AND meters.volume >= 20000) OR
    (infocontrato.dn = 30 AND infocontrato.year <= extract(year from CURRENT_DATE) - 8) OR
    ((infocontrato.dn = 40 AND infocontrato.year > extract(year from CURRENT_DATE) - 8) AND meters.volume >= 40000) OR
    (infocontrato.dn = 40 AND infocontrato.year <= extract(year from CURRENT_DATE) - 8) OR
    (infocontrato.dn = 50 AND infocontrato.year <= extract(year from CURRENT_DATE) - 6) OR
    (infocontrato.dn = 65 AND infocontrato.year <= extract(year from CURRENT_DATE) - 6) OR
    (infocontrato.dn = 80 AND infocontrato.year <= extract(year from CURRENT_DATE) - 6)
    group by zmc order by zmc asc)t1
    left join (select ramaisrua.zmct2, count(infocontrato.infocontrato_id) as check from infocontrato
    left join (select meters.local, meters.volume from meters) as meters on infocontrato.local = meters.local
    left join (select ramaisrua.ramal, ramaisrua.zmc as zmct2 from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
    where
    ((infocontrato.dn = 15 AND infocontrato.year > extract(year from CURRENT_DATE) - 12) AND (meters.volume >= 1000 AND meters.volume < 1500)) OR
    ((infocontrato.dn = 20 AND infocontrato.year > extract(year from CURRENT_DATE) - 12) AND (meters.volume >= 2500 AND meters.volume < 4000)) OR
    ((infocontrato.dn = 25 AND infocontrato.year > extract(year from CURRENT_DATE) - 8) AND (meters.volume >= 7500 AND meters.volume < 12500)) OR
    ((infocontrato.dn = 30 AND infocontrato.year > extract(year from CURRENT_DATE) - 8) AND (meters.volume >= 13000 AND meters.volume < 20000)) OR
    ((infocontrato.dn = 40 AND infocontrato.year > extract(year from CURRENT_DATE) - 8) AND (meters.volume >= 17000 AND meters.volume < 40000)) OR
    ((infocontrato.dn = 50 AND infocontrato.year > extract(year from CURRENT_DATE) - 6) AND (meters.volume >= 50000)) OR
    ((infocontrato.dn = 65 AND infocontrato.year > extract(year from CURRENT_DATE) - 6) AND (meters.volume >= 80000)) OR
    ((infocontrato.dn = 80 AND infocontrato.year > extract(year from CURRENT_DATE) - 6) AND (meters.volume >= 126000))
    group by zmct2 order by zmct2 asc)t2 on t1.zmc = t2.zmct2
    left join (select ramaisrua.zmct3, avg(extract(year from CURRENT_DATE)- infocontrato.year) as age from infocontrato
    left join (select ramaisrua.ramal, ramaisrua.zmc as zmct3 from ramaisrua) as ramaisrua on infocontrato.ramal = ramaisrua.ramal
    group by zmct3 order by zmct3 asc)as t3  on t1.zmc = t3.zmct3
    left join (select ramaisrua.zmct4, count(infocontrato.infocontrato_id) as meters from infocontrato
    left join (select ramaisrua.ramal, ramaisrua.zmc as zmct4 from ramaisrua) as ramaisrua
    on infocontrato.ramal = ramaisrua.ramal
    group by zmct4
    order by zmct4 asc)as t4
    on t1.zmc = t4.zmct4`;

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
    
const infometersTask = async () => {
    try {
        const infometersdata = await executeQuery(query);
        console.log(infometersdata.length, "records fetched successfully");
        return infometersdata;
    } catch (error) {
        console.error('Error fetching meters data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};
    
export { infometersTask };
