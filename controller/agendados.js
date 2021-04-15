const Agendados = require("../model/Agendados")

exports.create = async(req,res) =>{
    try {
        const {fechas} = req.body
        console.log(req.body)
        let agenda = await Agendados.findOne({ fechas: fechas })
      

        if (agenda) {
            let ag = await Agendados.findOneAndUpdate({fechas: fechas},req.body,{ new: true });
            res.json(ag)
            console.log('Agenda actualizada')
        } else {
            const agenda = await new Agendados(req.body).save()
            
            res.json(agenda)
            console.log('Agenda creada')
        }

    } catch (err) {
        res.status(400).send('Create agenda failed')
    }
}


exports.list = async(req,res) =>{
    res.json(await Agendados.find({}).select('fechas').sort({createdAt: -1}).exec())
}

exports.read = async(req,res) =>{
    let agenda = await Agendados.findOne({_id: req.params.id}).exec()
    res.json(agenda)
}

exports.remove = async(req,res) =>{
    try {
        console.log(req.params.id)
        const deleted = await Agendados.findOneAndDelete({_id: req.params.id})
        
        res.json(deleted)
    } catch (err) {
        res.status(400).send('Delete failed')
    }
}