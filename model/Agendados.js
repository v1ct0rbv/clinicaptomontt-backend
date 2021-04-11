const mongoose = require('mongoose')

const agendadosSchema = new mongoose.Schema({
    datos:{
        type:Array,
    },
    fechas:{
        type:String
    }
})

module.exports = mongoose.model('Agendados',agendadosSchema)