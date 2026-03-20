const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    title: String,  
    description: String
})

const noteModel = mongoose.model("notes", noteSchema) // we are going to perform all crud 
// operations with this noteModel
//notes is the collection name

module.exports = noteModel