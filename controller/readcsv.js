const csv = require('csv-parser')
const fs = require('fs')
const results = []


module.exports = () =>{
    fs.createReadStream('../AgendadosCSV/Appointments.csv')
    .pipe(csv({}))
    .on('data',(data) => results.pucsh(data))
    .on('end',()=>{
        console.log(results)
    })
}