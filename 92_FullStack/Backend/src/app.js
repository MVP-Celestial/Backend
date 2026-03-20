const express = require("express") //import the packages

const app = express() 

const noteModel = require('./models/note.model')

const cors = require("cors")
app.use(cors())

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("HOME")
})

app.post('/api/notes', async (req,res)=> {
    
    const{title,description} = req.body

    const note = await noteModel.create({
        title,description

    })

    res.status(201).json({
        message: "Note Created Successfully",
        note
    })

    
})
app.get('/api/notes', async (req,res)=> {
    const notes = await noteModel.find()

    res.status(200).json({
        message: "Notes Fetched Successfully",
        notes
    })
})

app.delete('/api/notes/:id', async (req,res)=>{
    const id = req.params.id
    await noteModel.findByIdAndDelete(id)

    res.status(200).json({
        message: "Note Deleted Successfully",
        
    })
})

app.patch('/api/notes/:id', async (req,res)=>{
      const id = req.params.id
      const {description} = req.body
      const note = await noteModel.findByIdAndUpdate(id, {description});

      res.status(200).json({
        message: "Note Updated Successfully",
        note

      })

})

module.exports = app

