const express = require('express')

const path = require('path')
const router = express.Router()

const scraping = require('../controller/scraping')
//api get
const csv = require('csv-parser')
const fs = require('fs')

router.get("/scraping/:user/:password/:fechaInicio/:fechaHasta/:dif",scraping)
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

module.exports = router

