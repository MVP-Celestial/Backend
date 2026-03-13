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
    res.send(notes)

})

app.delete('/notes/:index',(req,res)=>{
     delete notes[req.params.index]

     res.send("Note deleted successfully")
})

app.patch('/notes/:index', (req,res)=>{
    notes[req.params.index].description = req.body.description;
    notes[req.params.index].title = req.body.title;

    res.send('Note has been Updated!!')
})

module.exports = app 

