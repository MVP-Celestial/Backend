import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const init = async ({
  landmarkerRef,
  videoRef,
  streamRef,
  animationRef,
  setExpression,
}) => {
  try {
    // Prevent initializing twice (React StrictMode)
    if (streamRef.current) return;

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1,
    });

    streamRef.current = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    const video = videoRef.current;

    if (!video) return;

    video.srcObject = streamRef.current;

    try {
      await video.play();
    } catch (err) {
      console.log("Video play interrupted:", err);
    }
  } catch (err) {
    console.error(err);
  }
};

export const detect = ({
  landmarkerRef,
  videoRef,
  animationRef,
  setExpression,
}) => {
  const video = videoRef.current;

  if (!landmarkerRef.current || !video) return;

  if (video.readyState < 2) {
    animationRef.current = requestAnimationFrame(() =>
      detect({
        landmarkerRef,
        videoRef,
        animationRef,
        setExpression,
      })
    );
    return;
  }

  const results = landmarkerRef.current.detectForVideo(video, performance.now());

  if (results.faceBlendshapes?.length > 0) {
    const blendshapes = results.faceBlendshapes[0].categories;

    const getScore = (name) =>
      blendshapes.find((b) => b.categoryName === name)?.score || 0;

    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");
    const jawOpen = getScore("jawOpen");
    const browUp = getScore("browInnerUp");
    const frownLeft = getScore("mouthFrownLeft");
    const frownRight = getScore("mouthFrownRight");

    let currentExpression = "Neutral";

    if (smileLeft > 0.5 && smileRight > 0.5) {
      currentExpression = "Happy 😄";
    } else if (jawOpen > 0.2 && browUp > 0.2) {
      currentExpression = "Surprised 😲";
    } else if (frownLeft > 0.0001 && frownRight > 0.0001) {
      currentExpression = "Sad 😢";
    }

    setExpression(currentExpression);
  }

};

export const stopCamera = ({
  streamRef,
  animationRef,
  videoRef,
}) => {
  if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
  }

  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }
};