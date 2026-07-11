import React, { useState } from "react";
import FaceExpression from "../../Expression/components/FaceExpression";
import Player from "../components/player";
import LogoutButton from "../../Auth/components/LogoutButton";
import "../../shared/styles/moodify.scss";

// Maps whatever FaceExpression detects into the mood strings your
// backend/song schema actually understands.
const expressionToMood = {
  "Happy 😄": "happy",
  "Sad 😢": "sad",
  "Surprised 😲": "surprised",
};

const Home = () => {
  const [expression, setExpression] = useState("Neutral");
  const mood = expressionToMood[expression]; // undefined until a real detection happens

  return (
    <div className="moodify-page">
      <div className="moodify-topbar">
        <div className="wordmark moodify-display">MOODIFY</div>
        <LogoutButton />
      </div>

      <FaceExpression expression={expression} setExpression={setExpression} />
      <Player mood={mood} />
    </div>
  );
};

export default Home;