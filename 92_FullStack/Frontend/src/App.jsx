import React, { useEffect, useState } from "react";
import axios from "axios"

const App = () => {
  const [notes, setNotes] = useState([]);

  
  function fetchNotes() {
    axios.get("http://localhost:3000/api/notes")
    .then((res)=>{
      setNotes(res.data.notes)
    })
    .catch((err)=> console.error("Fetch error:", err))
  }

  useEffect(()=> {
    fetchNotes()
  },[])

  function handleSubmit(e) {
    e.preventDefault()

    const {title, description} = e.target.elements

    console.log(title.value, description.value)

    axios.post("http://localhost:3000/api/notes", {
      title: title.value,
      description: description.value
    }).then((res)=>{
      console.log(res.data)
      fetchNotes()
    })

      
  }

  function deleteNote(noteId) {
    axios.delete("http://localhost:3000/api/notes/"+noteId)
    .then((res)=>{
      console.log(res.data)
      fetchNotes()
    })
  }

  return (
    <div className="main h-screen w-screen bg-zinc-700  ">

      <form onSubmit={handleSubmit}>

      <input name="title" className="bg-white" type="text" placeholder="Enter Title" />

      <input name="description" className="bg-white ml-5" type="text" placeholder="Description" />

      <button className="bg-white ml-4 p-2 rounded-md hover:bg-zinc-200">Create Note</button>


      </form>
     
     
      <div className="notes p-5 gap-5 flex">
      {notes.map((note) => {
        return (
            <div className="note w-50 h-30 bg-white rounded-2xl ml-2">
              <div className="text ml-5 text-xl mt-1 pt-2 ">
                <h1 className="mt-2">{note.title}</h1>
                <p>{note.description}</p>

                <button onClick={()=>{deleteNote(note._id)}} className="bg-zinc-400 mt-2 rounded-md">Delete</button>
              </div>
            </div>
        );
      })}
      </div>
    </div>
  );
};

export default App;
