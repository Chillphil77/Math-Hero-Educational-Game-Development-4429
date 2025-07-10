import React, { createContext, useContext, useState, useEffect } from 'react';

const SoundContext = createContext();

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(false);

  useEffect(() => {
    const savedSound = localStorage.getItem('mathHeroSound');
    const savedMusic = localStorage.getItem('mathHeroBackgroundMusic');
    
    if (savedSound !== null) {
      setSoundEnabled(JSON.parse(savedSound));
    }
    if (savedMusic !== null) {
      setBackgroundMusicEnabled(JSON.parse(savedMusic));
    }
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('mathHeroSound', JSON.stringify(newState));
  };

  const toggleBackgroundMusic = () => {
    const newState = !backgroundMusicEnabled;
    setBackgroundMusicEnabled(newState);
    localStorage.setItem('mathHeroBackgroundMusic', JSON.stringify(newState));
  };

  const playSound = (type) => {
    if (!soundEnabled) return;

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      switch (type) {
        case 'correct':
          // Happy ascending melody
          [523.25, 659.25, 783.99].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.3);
            osc.start(audioCtx.currentTime + i * 0.1);
            osc.stop(audioCtx.currentTime + i * 0.1 + 0.3);
          });
          break;
        
        case 'incorrect':
          // Descending sad melody
          [440, 392, 349.23].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.15);
            osc.type = 'triangle';
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.15 + 0.4);
            osc.start(audioCtx.currentTime + i * 0.15);
            osc.stop(audioCtx.currentTime + i * 0.15 + 0.4);
          });
          break;
        
        case 'coin':
          // Sparkly coin sound
          [800, 1000, 1200].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.05);
            osc.type = 'square';
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.05 + 0.2);
            osc.start(audioCtx.currentTime + i * 0.05);
            osc.stop(audioCtx.currentTime + i * 0.05 + 0.2);
          });
          break;
        
        case 'click':
          oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
          oscillator.type = 'square';
          gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
          oscillator.start(audioCtx.currentTime);
          oscillator.stop(audioCtx.currentTime + 0.1);
          break;
        
        case 'achievement':
          // Triumphant fanfare
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
            osc.type = 'sawtooth';
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.5);
            osc.start(audioCtx.currentTime + i * 0.1);
            osc.stop(audioCtx.currentTime + i * 0.1 + 0.5);
          });
          break;
        
        case 'whoosh':
          // Swoosh sound for animations
          oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.3);
          oscillator.type = 'sawtooth';
          gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
          oscillator.start(audioCtx.currentTime);
          oscillator.stop(audioCtx.currentTime + 0.3);
          break;
        
        case 'magic':
          // Magical sparkle sound
          [440, 554.37, 659.25, 880].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.08);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.08 + 0.4);
            osc.start(audioCtx.currentTime + i * 0.08);
            osc.stop(audioCtx.currentTime + i * 0.08 + 0.4);
          });
          break;
        
        default:
          oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
          oscillator.start(audioCtx.currentTime);
          oscillator.stop(audioCtx.currentTime + 0.5);
      }
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const value = {
    soundEnabled,
    backgroundMusicEnabled,
    toggleSound,
    toggleBackgroundMusic,
    playSound
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};