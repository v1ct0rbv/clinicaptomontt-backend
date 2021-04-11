const Agendados = require("../model/Agendados")
const csv = require('csv-parser')
const fs = require('fs')

exports.create = async(req,res) =>{
    try {
        console.log(req.body)
        res.json(await new Agendados(req.body).save())
        console.log('Cuenta creada')
    } catch (err) {
        res.status(400).send('Create cuenta failed')
    }
}

exports.createAndUpdate = async (req,res) => {
    try {
        const {fechas,datos} = req.body
        let anuncio = await Anuncio.findOne({ fechas: req.body });
        console.log(user)
        console.log(req.body)

        if (anuncio) {
            perfil = await Anuncio.findOneAndUpdate({parent: user._id},req.body,{ new: true });
            res.json(perfil)
            console.log('Anuncio Actualizado')
        } else {
            const newAnuncio = await new Anuncio(req.body).save()
            res.json(newAnuncio)
            console.log('Anuncio creado')
        }

    } catch (err) {
        res.status(400).send('Create anuncio failed')
    }
}


exports.list = async(req,res) =>{
    res.json(await Agendados.find({}).sort({createdAt: -1}).exec())
}

// exports.read = async(req,res) =>{
//     let agenda = await Agendados.findOne({_id: req.params.slug}).exec()
//     res.json(agenda)
// }

// exports.update = async(req,res) =>{
//     const {ciudad} = req.body 
//     try {
//         const updated = await Ciudad.findOneAndUpdate({ slug: req.params.slug },{ciudad,slug:slugify(ciudad)},{new:true})
//         res.json(updated)

//     } catch (err) {
//         res.status(400).send('Update failed')
//     }
// }

// exports.remove = async(req,res) =>{
//     try {
//          const deleted = await Agendados.findOneAndDelete({_id: req.params.slug})
         
//          res.json(deleted)
//     } catch (err) {
//         res.status(400).send('Delete failed')
//     }
// }