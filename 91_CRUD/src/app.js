const express = require("express");

const app = express()

const noteModel = require("./models/notes.model")//imports the note structure format (schema)

app.use(express.json()) //middleware

app.post('/notes', async (req,res)=>{   
    const {title,description,age} = req.body //destructuring

    const note = await noteModel.create({//internally an insert operation in mongodb to save the note
        title,description,age
    }) // const note returns the json data that is stored in the db

    res.status(201).json({
        message:"Note Created Successful",
        note //note data displayed in response

    })
})

app.get('/notes', async (req,res)=> {
    const notes = await noteModel.find() //find method returns the data stored in the DB

    res.status(200).json({
        message: "Notes Fetched Successfully",
        notes
    })


})

module.exports = app

