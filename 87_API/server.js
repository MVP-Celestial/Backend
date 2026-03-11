const express = require("express")

const app = express()

app.use(express.json()) //makes the server capable of reading the body data

const note = []

app.post('/note',(req,res)=>{
    console.log(req.body)
    res.send('Note Created')
   note.push(req.body) 
})

app.get('/note', (req,res)=>{
    res.send(note)
})


app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})