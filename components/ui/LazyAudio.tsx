import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LazyAudioProps {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export default function LazyAudio({ src, autoPlay = false, controls = true, onPlay, onPause, onEnded }: LazyAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => setIsLoaded(true);
    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };
    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPlay, onPause, onEnded]);

  return (
    <div className="relative">
      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoPlay}
        controls={controls}
        preload="none"
      />
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
        />
      )}
    </div>
  );
}

