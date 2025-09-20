import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  playPause, 
  nextSong, 
  prevSong, 
  setCurrentTime, 
  setDuration,
  setVolume 
} from '../../redux/features/playerSlice';

const Player = () => {
 const dispatch = useDispatch();
  const { currentSong, isPlaying, currentTime, duration, volume, queue } = useSelector(state => state.player);
  
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [nextAudioRef, setNextAudioRef] = useState(null);

  // Préchargement de la chanson suivante
  const nextSong = useMemo(() => {
    const currentIndex = queue.findIndex(song => song.id === currentSong?.id);
    return queue[currentIndex + 1] || null;
  }, [queue, currentSong]);

  // Préchargement intelligent
  useEffect(() => {
    if (nextSong && !nextAudioRef) {
      const nextAudio = new Audio();
      nextAudio.preload = 'metadata';
      nextAudio.src = nextSong.preview || nextSong.url;
      setNextAudioRef(nextAudio);
    }
  }, [nextSong, nextAudioRef]);

  // Configuration du contexte audio pour l'analyseur
  const setupAudioContext = useCallback(() => {
    if (audioRef.current && !audioContext) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const analyserNode = ctx.createAnalyser();
        const source = ctx.createMediaElementSource(audioRef.current);
        
        analyserNode.fftSize = 256;
        source.connect(analyserNode);
        analyserNode.connect(ctx.destination);
        
        setAudioContext(ctx);
        setAnalyser(analyserNode);
      } catch (err) {
        console.warn('AudioContext not supported:', err);
      }
    }
  }, [audioContext]);

  // Gestion des événements audio
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setupAudioContext();
  }, [setupAudioContext]);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error('Erreur de lecture:', err);
        setError('Erreur de lecture audio');
      });
    }
  }, [isPlaying]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      dispatch(setDuration(audioRef.current.duration));
    }
  }, [dispatch]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      dispatch(setCurrentTime(audioRef.current.currentTime));
    }
  }, [dispatch]);

  const handleEnded = useCallback(() => {
    dispatch(nextSong());
  }, [dispatch]);

  const handleError = useCallback((e) => {
    setError('Erreur de chargement audio');
    setIsLoading(false);
    console.error('Audio error:', e);
  }, []);

  // Contrôle du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Contrôle de la lecture/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(handleError);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, handleError]);

  // Changement de chanson
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.preview || currentSong.url;
      audioRef.current.load();
    }
  }, [currentSong]);

  if (!currentSong) return null;

  return (
    <div className="enhanced-player bg-gradient-to-r from-gray-900 to-black p-4 rounded-lg shadow-2xl">
      <audio
        ref={audioRef}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
        preload="metadata"
      />
      
      {/* Informations de la chanson */}
      <div className="flex items-center mb-4">
        <img 
          src={currentSong.image || '/default-album.jpg'} 
          alt={currentSong.title}
          className="w-16 h-16 rounded-lg object-cover mr-4"
        />
        <div className="flex-1">
          <h3 className="text-white font-semibold truncate">{currentSong.title}</h3>
          <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
        </div>
      </div>

      {/* Contrôles */}
      <PlayerControls 
        isPlaying={isPlaying}
        isLoading={isLoading}
        onPlayPause={() => dispatch(playPause())}
        onNext={() => dispatch(nextSong())}
        onPrev={() => dispatch(prevSong())}
      />

      {/* Barre de progression */}
      <ProgressBar 
        currentTime={currentTime}
        duration={duration}
        onSeek={(time) => {
          if (audioRef.current) {
            audioRef.current.currentTime = time;
            dispatch(setCurrentTime(time));
          }
        }}
      />

      {/* Contrôle du volume */}
      <VolumeControl 
        volume={volume}
        onVolumeChange={(newVolume) => dispatch(setVolume(newVolume))}
      />

      {/* Visualiseur audio */}
      {analyser && <AudioVisualizer analyser={analyser} />}

      {/* Affichage des erreurs */}
      {error && (
        <div className="mt-2 p-2 bg-red-600 text-white text-sm rounded">
          {error}
        </div>
      )}
    </div>
  );
};

// Composant des contrôles
const PlayerControls = ({ isPlaying, isLoading, onPlayPause, onNext, onPrev }) => (
  <div className="flex items-center justify-center space-x-4 mb-4">
    <button 
      onClick={onPrev}
      className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
    >
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
    </button>

    <button 
      onClick={onPlayPause}
      disabled={isLoading}
      className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : isPlaying ? (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      )}
    </button>

    <button 
      onClick={onNext}
      className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
    >
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414zm6 0a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
);

// Composant de la barre de progression
const ProgressBar = ({ currentTime, duration, onSeek }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(percent * duration);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mb-4">
      <div 
        className="w-full h-2 bg-gray-700 rounded-full cursor-pointer relative"
        onClick={handleClick}
      >
        <div 
          className="h-full bg-blue-600 rounded-full relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

// Composant de contrôle du volume
const VolumeControl = ({ volume, onVolumeChange }) => (
  <div className="flex items-center space-x-2">
    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.007 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.007l4.376-3.793A1 1 0 019.383 3.076zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
    <input
      type="range"
      min="0"
      max="100"
      value={volume}
      onChange={(e) => onVolumeChange(parseInt(e.target.value))}
      className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
    />
    <span className="text-xs text-gray-400 w-8">{volume}%</span>
  </div>
);

// Composant visualiseur audio
const AudioVisualizer = ({ analyser }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = 'rgba(17, 24, 39, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        ctx.fillStyle = `rgb(59, 130, 246, ${barHeight / canvas.height})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, [analyser]);

  return (
    <canvas 
      ref={canvasRef} 
      width="300" 
      height="60" 
      className="w-full h-15 mt-4 rounded-lg bg-gray-800"
    />
  );
};

export default Player;
