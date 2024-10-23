import puppeteer from 'puppeteer';

const fetchData = async () => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium', 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36');
        
        // Navigate to the login page
        await page.goto('https://city-mind.com/default.aspx', { waitUntil: 'networkidle0' });

        // Log the content of the page for debugging
        const pageContent = await page.content();
        //console.log(pageContent); // Check if the page loaded correctly

        // Wait for the username input to be visible and fill it
        await page.waitForSelector('#AtusLogin_UserName', { visible: true });
        await page.type('#AtusLogin_UserName', process.env.cityMindUser); // Fill username

        // Wait for the password input to be visible and fill it
        await page.waitForSelector('#AtusLogin_Password', { visible: true });
        await page.type('#AtusLogin_Password', process.env.cityMindPass); // Fill password

        // Wait for the login button to be visible and click it
        await page.waitForSelector('#AtusLogin_LoginButton', { visible: true });
        await Promise.all([page.click('#AtusLogin_LoginButton'), page.waitForNavigation({ waitUntil: 'networkidle0' })]);

        // Navigate to the specific report URL
        await page.goto('https://city-mind.com/Pages/ReadReport.aspx?rid=13&from=m')

        // Select values from dropdowns 
        await page.select('#ctl00_mainArea_rpw_srcbr_ddlentity1', '-1');
        await page.select('#ctl00_mainArea_rpw_srcbr_ddlentity2', '-1');

        // Wait for the 'hora da leitura' dropdown and select 'Yesterday'
        await page.waitForSelector('#ctl00_mainArea_rpw_srcbr_ctl54_ddlOperators', { visible: true });
        await page.select('#ctl00_mainArea_rpw_srcbr_ctl54_ddlOperators', 'Yesterday');

        // Wait for the mostrar button to be visible and click it
        await page.waitForSelector('#ctl00_mainArea_rpw_srcbr_btnShow', { visible: true });
        await Promise.all([
            page.click('#ctl00_mainArea_rpw_srcbr_btnShow'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);

        // Esperar o conteúdo específico carregar
        await page.waitForSelector('#ctl00_mainArea_rpw_reportGrid_GridData');

        // Extrair conteúdo e converter para JSON
        const jsonData = await page.evaluate(() => {
            const table = document.querySelector('#ctl00_mainArea_rpw_reportGrid_GridData');
            const rows = Array.from(table.querySelectorAll('tr')); // Obter todas as linhas

            // Criar um array para armazenar os dados
            const dataRows = rows.map(row => {
                const cells = row.querySelectorAll('td'); // Obter todas as células na linha
                // Converter células em um array de valores, removendo os 2 primeiros e 2 últimos
                const values = Array.from(cells).map(cell => cell.innerText.trim());
                return values.slice(2, values.length - 2); // Remover os 2 primeiros e 2 últimos valores
            }).filter(row => row.length > 0); // Filtrar quaisquer linhas vazias

            return dataRows; // Retornar o array de arrays
        });

        console.log(jsonData);
        console.log(jsonData.length);


    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        await browser.close(); 
    }
};

// Invoke the fetchData function
fetchData();

      /*
// Wait for specific content to load
        await page.waitForSelector('body');

        // Extract content
        const content = await page.evaluate(() => {
            const lblNavText = document.querySelector('#ctl00_mainArea_rpw_reportGrid_GridData');
            return lblNavText.innerText; 
        });

        console.log(content); // Output the extracted content
    
            
        

*/
    
            
        
