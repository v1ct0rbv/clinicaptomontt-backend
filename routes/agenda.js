const express = require('express')

const path = require('path')
const puppeteer = require('puppeteer');
const router = express.Router()

const scraping = require('../controller/scraping')
//api get
const csv = require('csv-parser')
const fs = require('fs')

router.get("/scraping/:user/:password/:fechaInicio/:fechaHasta",scraping)
router.get("/scraping-read",async(req,res) =>{
    const results = []
    fs.createReadStream('./AgendadosCSV/Appointments.csv')
        .pipe(csv({}))
        .on('data',(data) => {
            results.push(data)})
        .on('end',()=>{
            res.json(results)
        })
})

async function scrapingAuto (x,y){

     // const{user,password,fechaInicio,fechaFin} = req.body
     const user = 'hgoringpm'
     const password = 'agenda2020.'
     const fechaInicio = x
     const fechaFin = y
     
 
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
 
     await page.waitForTimeout(12000);
     
     
     
     console.log('Descarga finalizada')
 
     // set viewport and user agent (just in case for nice viewing)
     await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
 
  
 
     await browser.close();
     res.send({
         data:'Scraping listo'
     })
}
  
setInterval(
    function(){
        var date = new Date();
        var diaActual = date.getDate()

        var first = date.getDate() - date.getDay() +1; // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        var firstday = new Date(date.setDate(first));
        var lastday = new Date(date.setDate(last));

        
        
        var lunes =firstday.getDate()+"-"+("0" + (firstday.getMonth() + 1)).slice(-2)+'-'+firstday.getUTCFullYear()
        var domingo = lastday.getDate()+"-"+("0" + (lastday.getMonth() + 1)).slice(-2)+'-'+lastday.getUTCFullYear()

        if(lastday.getDate() < 10){
            var dom = '0'+lastday.getDate()
            var domingo = dom+domingo.slice(1)
        }

        console.log(
            diaActual,lunes,domingo,lastday.getDate(),dom
        )

        var hoy = new Date();
        if(hoy.getHours() === 5){
            console.log('Es hora del scraping')
            scrapingAuto(lunes,domingo)
            .then(res =>
                console.log(res))
            .catch(err => console.log(err))
        }
    }
    ,1000*60*60)

  
module.exports = router

