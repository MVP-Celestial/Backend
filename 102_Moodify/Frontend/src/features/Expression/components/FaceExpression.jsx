import { useEffect, useRef, useState } from "react";
import { init, stopCamera, detect } from "../utils/utils";
import "../../shared/styles/moodify.scss";

export default function FaceExpression({ expression, setExpression }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    init({ landmarkerRef, videoRef, streamRef, animationRef })
      .then(() => setReady(true))
      .catch(() => setError("Camera access is needed to detect your mood."));

    return () => {
      stopCamera({ streamRef, animationRef, videoRef });
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
    };
  }, []);

  function handleDetect() {
    detect({ landmarkerRef, videoRef, animationRef, setExpression });
  }

  return (
    <div className="cam-panel">
      <div className="cam-frame">
        <video ref={videoRef} autoPlay playsInline muted className="cam-video" />
        {!ready && <div className="cam-placeholder">Starting camera…</div>}
        <div className="cam-scanline" />
      </div>

      <div className="cam-readout">
        <div className="cam-heading">Detected mood</div>

        <div className="cam-chip">
          <span className="cam-dot" />
          <span className="moodify-display">{expression}</span>
        </div>

        {error && <p className="cam-error">{error}</p>}

        <button
          className="detect-btn"
          onClick={handleDetect}
          disabled={!ready}
        >
          {ready ? "Detect Mood" : "Starting camera…"}
        </button>
      </div>
    </div>
  );
}