const express = require("express");

const app = express() // instance is created

app.get('/', (req,res)=>{
    res.send('hello world')
})

app.get('/about', (req,res)=>{
   res.send('this is about page')
})

app.get('/home', (req,res)=>{
    res.send('This is Home')
})

app.listen(3000) //server runs 

