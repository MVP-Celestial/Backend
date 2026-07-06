import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { detect, init } from "../utils/utils";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const [expression, setExpression] = useState("Detecting...");
  const streamRef = useRef(null)

  useEffect(() => {
    let stream;

   

    init({landmarkerRef,videoRef,streamRef});

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <video
        ref={videoRef}
        style={{ width: "400px", borderRadius: "12px", transform: "scaleX(-1)" }}
        playsInline
        muted
      />
      <h2>{expression}</h2>
      <button onClick={()=>{detect({landmarkerRef,videoRef,setExpression})}}>Detect Expression</button>
    </div>
  );
}