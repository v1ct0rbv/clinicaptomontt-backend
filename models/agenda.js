const mongoose = require('mongoose')

const agendaSchema = new mongoose.Schema({
    año:{
       type:Number,
    },
    mes:{
        type:Number,
    },
    semana:{
        type:Number
    },
    datos:{
        type:Array
    }

})

module.exports = mongoose.model('Ciudad',agendaSchema)