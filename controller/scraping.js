const path = require('path')
const puppeteer = require('puppeteer');

module.exports = async (req,res) => {

    // const{user,password,fechaInicio,fechaFin} = req.body
    const user = req.params.user
    const password = req.params.password
    const fechaInicio = req.params.fechaInicio
    const fechaFin = req.params.fechaHasta
    

    const browser = await puppeteer.launch({
        'args' : [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });
    
    const page = await browser.newPage();
    //pagina
    const pagLogin = `https://backoffice.prod.regionales.procloudhub.com/#/login`;


    await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: path.resolve(__dirname,'../AgendadosCSV')});

    await page.goto(pagLogin, { waitUntil: 'networkidle0' });

    //Iniciar Sesión
    await page.waitForSelector('input[name=""]');
    await page.type('input[name=""]', `${user}`);
    await page.type('input[name="pass"]', `${password}`);
    await page.click('input[class="loginReception"]'); 
    
    //Abrir exportacion de citas
    await page.waitForSelector('a[class="patient-btn appointment-export"]');
    await page.click('a[class="patient-btn appointment-export"]');
    
    //Seleccionar todas las areas
    await page.waitForSelector('select[name="areaSelect"]')
    await page.click('select#areaSelect')
    await page.waitForTimeout(1000);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
   
    //Seleccionar citados
    await page.waitForSelector("select#appointmentStatus");
    await page.select("select#appointmentStatus", "Bofoked");
    
    //Seleccionar fechas
    const input = await page.$('input[name="startDateFilter"]');
    await input.click({ clickCount: 3 })
    await input.type(`${fechaInicio}`);

    const input2 = await page.$('input[name="endDateFilter"]');
    await input2.click({ clickCount: 3 })
    await input2.type(`${fechaFin}`);
        
    //Descargar Citado
    await page.click('button#export-button-popup')
    console.log('Descargando Citados...')

    await page.waitForTimeout(12500);
    
    
    
    console.log('Descarga finalizada')

    // set viewport and user agent (just in case for nice viewing)
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    res.json({ 
        data:"hey you have done a scraping"
    })

    await browser.close();
}