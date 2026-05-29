import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio object (Headless)
    const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-flute-11833.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    // 1. Attempt immediate autoplay
    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        // Autoplay blocked by browser policy - expected behavior, silent fail
        setIsPlaying(false);
      }
    };

    playAudio();

    // 2. Fallback: Unlock audio on first user interaction (click/touch/key)
    const handleInteraction = () => {
        if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => {
                    // If still blocked, just silently fail and wait for next interaction or manual toggle
                    setIsPlaying(false);
                });
        }
    };

    // Add listeners to document to catch the very first interaction
    // Removed 'scroll' as it is often not a valid user gesture for audio in Chrome/Safari
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
        
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error("Manual toggle failed:", e));
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleAudio }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
};