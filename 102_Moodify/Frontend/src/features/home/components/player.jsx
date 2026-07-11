import React, { useEffect, useRef, useState } from "react";
import { useSong } from "../Hooks/useSong";
import "../../shared/styles/moodify.scss";

const Player = ({ mood }) => {
  const audioRef = useRef(null);
  const { song, loading, handleGetSong } = useSong();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (!mood) return;
    handleGetSong({ mood });
    setIsPlaying(false);
  }, [mood]);

  useEffect(() => {
    if (!song || !audioRef.current) return;
    audioRef.current.load();
    setIsPlaying(false);
  }, [song]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const ended = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", ended);
    };
  }, [song]); // changed from [] — listeners now attach once <audio> actually exists

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time) => {
    if (!Number.isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="player-panel">
        <div className="player-loading">Loading song…</div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="player-panel">
        <div className="player-empty">Detect your mood to start playing</div>
      </div>
    );
  }

  return (
    <div className="player-panel">
      <audio ref={audioRef} preload="metadata">
        <source src={song.url} type="audio/mpeg" />
      </audio>

      <div className="np-row">
        <div className={`disc ${isPlaying ? "" : "paused"}`} />

        <div className="np-info">
          <div className="np-eyebrow">Now Playing</div>
          <div className="np-title moodify-display">{song.title}</div>
          <div className="np-mood">Matched to: {mood}</div>
          <div className="led-time moodify-mono">
            {formatTime(currentTime)} &nbsp;/&nbsp; {formatTime(duration)}
          </div>
        </div>
      </div>

      <input
        className="progress-track"
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={(e) => {
          audioRef.current.currentTime = Number(e.target.value);
          setCurrentTime(Number(e.target.value));
        }}
      />

      <div className="transport">
        <button className="tbtn">⏮</button>
        <button className="tbtn play" onClick={togglePlay}>
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <button className="tbtn">⏭</button>
      </div>

      <div className="volume-row">
        <span>Vol</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Player;