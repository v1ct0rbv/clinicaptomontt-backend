const Agendados = require("../model/Agendados")
const csv = require('csv-parser')
const fs = require('fs')

module.exports = async(req,res) =>{
    const results = []
    fs.createReadStream('./AgendadosCSV/Appointments.csv')
        .pipe(csv({}))
        .on('data',(data) => {
            results.push(data)})
        .on('end',()=>{
            var resultFilter = results.map( c=> {
                var hr = c['Hora desde']
                var fecha = c['Fecha desde']
                var estado = c['Estado']
                var area = c['Área']

                return {'Hora':hr,'Fecha':fecha,"Estado":estado,'Area':area}
            })
            res.json(resultFilter)
        })
}