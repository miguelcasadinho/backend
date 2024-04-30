import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import sql from 'mssql';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const configsql = {
    user: process.env.sqlGisUser,
    password: process.env.sqlGisPassword,
    server: process.env.sqlGisHost,
    database: process.env.sqlGisAquaDatabase,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 15000
    }
};

const pool = new sql.ConnectionPool(configsql);

const query = `
    SELECT 'Albernoa - Saída do reservatório' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-AlbernoaZonaAlta' or zmc = 'ZMC-AlbernoaZonaBaixa'
    UNION ALL
    SELECT 'Albernoa - Zona Alta' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-AlbernoaZonaAlta'
    UNION ALL
    SELECT 'Albernoa - Zona Baixa' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-AlbernoaZonaBaixa'
    UNION ALL
    SELECT 'Baleizão - Saída do reservatório' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Baleizão zona alta' or zmc = 'ZMC-Baleizão zona baixa'
    UNION ALL
    SELECT 'Baleizão - Zona Alta' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Baleizão zona alta'
    UNION ALL
    SELECT 'Baleizão - Zona Baixa' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Baleizão zona baixa'
    UNION ALL
    SELECT 'Beja ZA1' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-ZA1' or zmc = 'ZMC-Moinhos Santa Maria'
    UNION ALL
    SELECT 'Beja ZA1 - Moinhos Santa Maria' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Moinhos Santa Maria'
    UNION ALL
    SELECT 'Beja ZA2' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-ZA2'
    UNION ALL
    SELECT 'Beja ZA3' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-ZA3'
    UNION ALL
    SELECT 'Beja ZA4' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-ZA4'
    UNION ALL
    SELECT 'Beja ZA5' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-ZA5'
    UNION ALL
    SELECT 'Beja ZB1' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-ZB1' or zmc = 'ZMC-Bairro da Esperança' or zmc = 'ZMC-Moinhos Santa Maria Baixa' or zmc = 'ZMC-Pandora' or zmc = 'ZMC-Parque Nomada' or zmc = 'ZMC-BejaMoinhosVelhos' or zmc = 'ZMC-Fonte Mouro'
    UNION ALL
    SELECT 'Beja ZB1 - Bairro Esperança' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Bairro da Esperança' or zmc = 'ZMC-Fonte Mouro'
    UNION ALL
    SELECT 'Beja ZB1 - Fonte Mouro' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Fonte Mouro'
    UNION ALL
    SELECT 'Beja ZB1 - Moinhos Santa Maria' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Moinhos Santa Maria Baixa'
    UNION ALL
    SELECT 'Beja ZB1 - Moinhos Velhos' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-BejaMoinhosVelhos'
    UNION ALL
    SELECT 'Beja ZB1 - Pandora' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Pandora'
    UNION ALL
    SELECT 'Beja ZB1 - Parque Nómada' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Parque Nomada'
    UNION ALL
    SELECT 'Beja ZB2' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-ZB2' or zmc = 'ZMC-CidadeSaoPaulo' or zmc = 'ZMC-Condominio' or zmc = 'ZMC-FerreiradeCastro'or zmc = 'ZMC-JuliaoQuintinha' or zmc = 'ZMC-Padrão' or zmc = 'ZMC-PatrocinioDias'
    UNION ALL
    SELECT 'Beja ZB2 - Cidade de São Paulo' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-CidadeSaoPaulo'
    UNION ALL
    SELECT 'Beja ZB2 - Condominio' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Condominio' or zmc = 'ZMC-Padrão'
    UNION ALL
    SELECT 'Beja ZB2 - Ferreira de Castro' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-FerreiradeCastro'
    UNION ALL
    SELECT 'Beja ZB2 - Julião Quintinha' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-JuliaoQuintinha'
    UNION ALL
    SELECT 'Beja ZB2 - Padrão' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Padrão'
    UNION ALL
    SELECT 'Beja ZB2 - Patrocinio Dias' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-PatrocinioDias'
    UNION ALL
    SELECT 'Beja ZB2 - Tenente Valadim' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-TenenteValadim'
    UNION ALL
    SELECT 'Beja ZB3' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-ZB3'
    UNION ALL
    SELECT 'Beja ZB4' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-ZB4' or zmc = 'ZMC-RamiroCorreia'
    UNION ALL
    SELECT 'Beja ZB4 - Ramiro Correia' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-RamiroCorreia'
    UNION ALL
    SELECT 'Beja ZB5' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-ZB5'
    UNION ALL
    SELECT 'Beja ZI - Bairro da Conceição' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Bairro da Conceição' or zmc = 'ZMC-BairroConceicaoSubZona' or zmc = 'ZMC-Saibreiras'
    UNION ALL
    SELECT 'Beja ZI - Bairro da Conceição Subzona' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-BairroConceicaoSubZona'
    UNION ALL
    SELECT 'Beja ZI - Bairro das Saibreiras' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Saibreiras'
    UNION ALL
    SELECT 'Beja ZI - Bairro de São Miguel' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Bairro Sao Miguel' or zmc = 'ZMC-AldeiaNovaCoitos' or zmc = 'ZMC-Bairro das Flores'
    UNION ALL
    SELECT 'Beja ZI - Parque Industrial' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Parque Industrial' or zmc = 'ZMC-Bairro Sao Miguel' or zmc = 'ZMC-AldeiaNovaCoitos' or zmc = 'ZMC-Bairro das Flores'
    UNION ALL
    SELECT 'Beja ZI - Bairro do Pelame' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Pelame'
    UNION ALL
    SELECT 'Beja ZI - Pelame vivendas' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Urbanizacao do Pelame'
    UNION ALL
    SELECT 'Beja ZI - Quinta Del Rey' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Quinta del Rei'
    UNION ALL
    SELECT 'Beja ZI - Saída do reservatório' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Pelame' or zmc = 'ZMC-Urbanizacao do Pelame' or zmc = 'ZMC-ZI1' or zmc = 'ZMC-Bairro da Conceição' or zmc = 'ZMC-BairroConceicaoSubZona' or zmc = 'ZMC-Saibreiras' or zmc = 'ZMC-Quinta del Rei' or zmc = 'ZMC-Parque Industrial' or zmc = 'ZMC-Bairro Sao Miguel' or zmc = 'ZMC-AldeiaNovaCoitos' or zmc = 'ZMC-Bairro das Flores'
    UNION ALL
    SELECT 'Beringel - Saída do reservatório' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Beringel zona baixa 1' or zmc = 'ZMC-Beringel zona baixa 2' or zmc = 'ZMC-Beringel zona alta 1' or zmc = 'ZMC-Beringel zona alta 2'
    UNION ALL
    SELECT 'Beringel - Zona Baixa 1' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Beringel zona baixa 1'
    UNION ALL
    SELECT 'Beringel - Zona Baixa 2' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Beringel zona baixa 2'
    UNION ALL
    SELECT 'Beringel - Zona Norte' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Beringel zona alta 1'
    UNION ALL
    SELECT 'Beringel - Zona Sul' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Beringel zona alta 2'or zmc = 'ZMC-Beringel zona baixa 1' or zmc = 'ZMC-Beringel zona baixa 2'
    UNION ALL
    SELECT 'Boavista' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Boavista'
    UNION ALL
    SELECT 'Cabeça Gorda - Saída do reservatório' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Cabeça Gorda zona 1' or zmc = 'ZMC-Cabeça Gorda zona 2' or zmc = 'ZMC-Cabeça Gorda zona 3' or zmc = 'ZMC-Salvada zona 1' or zmc = 'ZMC-Salvada zona 2'
    UNION ALL
    SELECT 'Cabeça Gorda - Zona 1' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Cabeça Gorda zona 1'
    UNION ALL
    SELECT 'Cabeça Gorda - Zona 2' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Cabeça Gorda zona 2'
    UNION ALL
    SELECT 'Cabeça Gorda - Zona 3' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Cabeça Gorda zona 3'
    UNION ALL
    SELECT 'Mina da Juliana' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Mina da Juliana'
    UNION ALL
    SELECT 'Mombeja' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Mombeja'
    UNION ALL
    SELECT 'Monte da Juliana' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Monte da Juliana'
    UNION ALL
    SELECT 'Neves - Geral' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Neves zona alta' or zmc = 'ZMC-Neves zona baixa' or zmc = 'ZMC-Vila Azedo'
    UNION ALL
    SELECT 'Neves - Zona Alta' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Neves zona alta' or zmc = 'ZMC-Vila Azedo'
    UNION ALL
    SELECT 'Neves - Zona Baixa' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Neves zona baixa'
    UNION ALL
    SELECT 'Neves - Porto Peles' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Porto Peles'
    UNION ALL
    SELECT 'Neves - Saída do reservatório' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Adutora Neves' or zmc = 'ZMC-Neves Aldeia de Cima' or zmc = 'ZMC-Neves zona alta' or zmc = 'ZMC-Neves zona baixa' or zmc = 'ZMC-Vila Azedo' or zmc = 'ZMC-Porto Peles'
    UNION ALL
    SELECT 'Neves - Vila Azedo' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Vila Azedo'
    UNION ALL
    SELECT 'Penedo Gordo - Geral' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Penedo Gordo' or zmc = 'ZMC-PenedoGordoMoinho'
    UNION ALL
    SELECT 'Penedo Gordo - SubZona' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-PenedoGordoMoinho'
    UNION ALL
    SELECT 'Quintos - Saída do reservatório' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Quintos'
    UNION ALL
    SELECT 'Salvada' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Salvada zona 1' or zmc = 'ZMC-Salvada zona 2'
    UNION ALL
    SELECT 'Salvada - Zona 1' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Salvada zona 1'
    UNION ALL
    SELECT 'Salvada - Zona 2' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Salvada zona 2'
    UNION ALL
    SELECT 'Santa Vitória' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Santa Vitória'
    UNION ALL
    SELECT 'São Brissos - Saída do reservatório' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-São Brissos'
    UNION ALL
    SELECT 'São Matias - Saída do reservatório' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-São Matias'
    UNION ALL
    SELECT 'Trigaches - Geral' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Trigaches'
    UNION ALL
    SELECT 'Trigaches - Saída do reservatório' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Trigaches'
    UNION ALL
    SELECT 'Trindade - Saída do reservatório' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Trindade'
    UNION ALL
    SELECT 'Vale de Russins - Saída do reservatório' as zmc, sum(Consumo) as volume FROM AQUA2020 where zmc = 'ZMC-Vale de Russins'
    `;

const executeQuery = async () => {
    let fatdata = [];
    try {
        await pool.connect();
        const result = await pool.request().query(query);
        fatdata = result.recordset;
        return fatdata;
    } catch (err) {
        throw new Error(`Error executing SQL query: ${err.message}`);
    } finally {
        pool.close();
    }
};
    
const fatdataTask = async () => {
    try {
    const result = await executeQuery();
    //console.log(result.length, 'records retrieved');
    return result;
    } catch (error) {
    console.error('Error in fatdataTask:', error);
    }
};
    
export { fatdataTask };
