const path = require('path')
const puppeteer = require('puppeteer');

module.exports = async (req,res) => {

    // const{user,password,fechaInicio,fechaFin} = req.body
    const user = req.params.user
    const password = req.params.password
    const fechaInicio = req.params.fechaInicio
    const fechaFin = req.params.fechaHasta
    const dif = req.params.dif

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
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
   
    //Seleccionar citados
    await page.waitForSelector("select#appointmentStatus");
    await page.select("select#appointmentStatus", "Booked");
    
    //Seleccionar fechas
    const input = await page.$('input[name="startDateFilter"]');
    await input.click({ clickCount: 3 })
    await input.type(`${fechaInicio}`);

    const input2 = await page.$('input[name="endDateFilter"]');
    await input2.click({ clickCount: 3 })
    await input2.type(`${fechaFin}`);
        
    //Descargar Citado
    await page.waitForTimeout(1000);
    await page.click('button#export-button-popup')
    console.log('Descargando Citados...')

    //Seleccionar y descargar Bloqueado
    await page.select("select#appointmentStatus", "Blocked");
    await page.click('button#export-button-popup')
    console.log('Descargando Bloqueados...')

    //Seleccionar y descargar Cancelado
    await page.select("select#appointmentStatus", "Cancelled");
    await page.click('button#export-button-popup')
    console.log('Descargando Cancelados...')

    //Seleccionar y descargar Presentado
    await page.select("select#appointmentStatus", "CheckIn");
    await page.click('button#export-button-popup')
    console.log('Descargando Presentados...')

    //Seleccionar y descargar Confirmado
    await page.select("select#appointmentStatus", "Confirmed");
    await page.click('button#export-button-popup')
    console.log('Descargando Confirmados...')

    //Seleccionar y descargar No presentado
    await page.select("select#appointmentStatus", "NotPerformed");
    await page.click('button#export-button-popup')
    console.log('Descargando No presentados...')

    //Seleccionar y descargar Atendido
    await page.select("select#appointmentStatus", "SerficePerformed");
    await page.click('button#export-button-popup')
    console.log('Descargando Atendidos...')

    if(dif <= 7){
        await page.waitForTimeout(15000);
    }
    
    
    console.log('Descarga finalizada')

    // set viewport and user agent (just in case for nice viewing)
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    res.json({ 
        data:"hey you have dona a scraping"
    })

    await browser.close();
}