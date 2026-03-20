import React, { useState } from "react";
import axios from "axios"

const App = () => {
  const [notes, setNotes] = useState([
    {
      title: "test-title-1",
      description: "test-description-1",
    },
    {
      title: "test-title-2",
      description: "test-description-2",
    },
    {
      title: "test-title-3",
      description: "test-description-3",
    },
    {
      title: "test-title-4",
      description: "test-description-4",
    },
  ]);

  axios.get("http://localhost:3000/api/notes")
  .then((res)=>{
    setNotes(res.data.notes)
  })

  return (
    <div className="main h-screen w-screen bg-zinc-700  ">
      <div className="notes p-5 gap-5 flex">
      {notes.map((note) => {
        return (
            <div className="note w-50 h-30 bg-white rounded-2xl ml-2">
              <div className="text ml-5 text-xl mt-5 pt-2 ">
                <h1 className="mb-2">{note.title}</h1>
                <p>{note.description}</p>
              </div>
            </div>
        );
      })}
      </div>
    </div>
  );
};

export default App;
