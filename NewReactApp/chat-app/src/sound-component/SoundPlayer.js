import React, { useRef, useState } from 'react';

function SoundPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio ref={audioRef} src="Sounds/MainMenu.mp3" />
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}

export default SoundPlayer;
