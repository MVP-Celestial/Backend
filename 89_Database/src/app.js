const express = require("express")
const app = express()
app.use(express.json())

const notes = [
 
];

app.get('/',(req,res)=>{
    res.send("THIS IS HOME")
})

//api method = post , api name = notes
app.post('/notes',(req,res)=>{
    console.log(req.body)
    notes.push(req.body)
    console.log(notes)
    res.send("Note Created")
})

app.get('/notes',(req,res)=>{
    
    res.status(201).json({
        "message": "Note Created Successfully"
    })

})

app.delete('/notes/:index',(req,res)=>{
     delete notes[req.params.index]

     res.status(204).json({
        "message": "Note Deleted Successfully"
    })
})

app.patch('/notes/:index', (req,res)=>{
    notes[req.params.index].description = req.body.description;
    notes[req.params.index].title = req.body.title;

    res.status(200).json({
        "message": "Note Updated Successfully"
    })
})

module.exports = app 

