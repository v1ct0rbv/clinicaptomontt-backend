const mongoose = require('mongoose')

const agendadosSchema = new mongoose.Schema({
    
    fechas:{
        type:String
    },
    datos:[],
},{timestamps:true})

module.exports = mongoose.model('Agendados',agendadosSchema)