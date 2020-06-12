const mongoose = require('mongoose')

const gaarderSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true
   },
   gaarden: {
    type: String,
    required: true
   }
})

module.exports = mongoose.model('Gaarde' ,gaarderSchema)