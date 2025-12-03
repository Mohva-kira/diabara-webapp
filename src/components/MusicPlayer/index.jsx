import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  nextSong,
  playPause,
  prevSong,
} from "../../redux/features/playerSlice";
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";

import SongActions from "../SongActions";
import Like from "../Like";
import Playlist from "../Playlist";
import Download from "../Download";
import Streams from "../Streams";

const MusicPlayer = ({ setIsVisible, onMinimize }) => {
  const { activeSong, currentSongs, currentIndex, isActive, isPlaying } =
    useSelector((state) => state.player) || {};
  // console.log("Active Song", activeSong);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const dispatch = useDispatch();


  const user = localStorage.getItem("auth")
  ? JSON.parse(localStorage.getItem("auth"))
  : null;

  const handlePlayPause = () => {
    // if (!isActive) return;

    if (isPlaying) {
      dispatch(playPause(false));
    } else {
      dispatch(playPause(true));
    }
  };

  const handleNextSong = () => {
    if (!currentSongs || currentSongs.length === 0) return;
    
    dispatch(playPause(false));

    if (!shuffle) {
      dispatch(nextSong((currentIndex + 1) % currentSongs.length));
    } else {
      dispatch(nextSong(Math.floor(Math.random() * currentSongs.length)));
    }
  };

  const handlePrevSong = () => {
    if (!currentSongs || currentSongs.length === 0) return;
    
    if (currentIndex === 0) {
      dispatch(prevSong(currentSongs.length - 1));
    } else if (shuffle) {
      dispatch(prevSong(Math.floor(Math.random() * currentSongs.length)));
    } else {
      dispatch(prevSong(currentIndex - 1));
    }
  };

  useEffect(() => {
    if (currentSongs?.length) dispatch(playPause(true));
  }, [currentIndex]);

  // Configuration du MediaSession API
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaSession) {
      navigator.mediaSession.setActionHandler("play", handlePlayPause);
      navigator.mediaSession.setActionHandler("pause", handlePlayPause);
      navigator.mediaSession.setActionHandler("nexttrack", () =>
        dispatch(nextSong((currentIndex + 1) % (currentSongs?.length || 1)))
      );
      navigator.mediaSession.setActionHandler("previoustrack", handlePrevSong);
      navigator.mediaSession.setActionHandler("seekto", () => seekTime);
      
      // Mettre à jour les métadonnées seulement si activeSong existe
      if (activeSong?.attributes) {
        const coverData = activeSong?.attributes?.cover?.data;
        const coverUrl = coverData && Array.isArray(coverData) && coverData.length > 0 && coverData[0]?.attributes
          ? coverData[0].attributes.url 
          : null;
        
        navigator.mediaSession.metadata = new MediaMetadata({
          title: activeSong?.attributes?.name || 'Titre inconnu',
          artist: activeSong?.attributes?.artist?.data?.attributes?.name || 'Artiste inconnu',
          artwork: coverUrl ? [
            {
              src: "https://api.diabara.tv" + coverUrl,
            },
          ] : [],
        });
      }
    }
  }, [activeSong, currentIndex, currentSongs?.length, handlePlayPause, handlePrevSong, seekTime, dispatch]);
  return (
    <div className="relative sm:px-2 mb-5 px-2 m-2 w-full flex flex-col items-center justify-between border-t border-gray-600">
      {/* Boutons de contrôle en haut à droite */}
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        {/* Bouton de réduction */}
        {onMinimize && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="text-white hover:text-orange-400 transition-colors p-1 rounded hover:bg-white/10"
            aria-label="Réduire le lecteur"
            title="Réduire"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        )}
        
        {/* Bouton de fermeture */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="text-white hover:text-red-400 transition-colors p-1 rounded hover:bg-white/10 font-bold text-xl"
          aria-label="Fermer le lecteur"
          title="Fermer"
        >
          ×
        </button>
      </div>
      
      <div className="flex justify-center absolute top-2 right-24 sm:right-28">
       <SongActions
            songId={activeSong.id}
            song={activeSong}
            user={user}
            streams={activeSong.streams || 0}
            Like={Like}
            Playlist={Playlist}
            Download={Download}
            StreamsComponent={Streams}
            className="mt-3 mb-2"
          />
        </div> 
      <Track
        isPlaying={isPlaying}
        isActive={isActive}
        activeSong={activeSong}
      />
      
      {/* Animation visuelle quand la musique démarre */}
      {isPlaying && isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Ondes sonores animées */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <div className="absolute inset-0 rounded-full border-4 border-orange-500/30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-4 border-orange-500/40 animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute inset-0 rounded-full border-4 border-orange-500/50 animate-ping" style={{ animationDelay: '0.4s' }}></div>
            </div>
            {/* Particules flottantes */}
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-orange-500/60 rounded-full animate-bounce"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${1 + i * 0.2}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <Controls
          isPlaying={isPlaying}
          isActive={isActive}
          repeat={repeat}
          setRepeat={setRepeat}
          shuffle={shuffle}
          setShuffle={setShuffle}
          currentSongs={currentSongs}
          handlePlayPause={handlePlayPause}
          handlePrevSong={handlePrevSong}
          handleNextSong={handleNextSong}
        />
        <Seekbar
          value={appTime}
          min="0"
          max={duration}
          onInput={(event) => setSeekTime(event.target.value)}
          setSeekTime={setSeekTime}
          appTime={appTime}
        />
        
        {/* Actions de la chanson active */}
     
         
        
        <Player
          activeSong={activeSong}
          volume={volume}
          isPlaying={isPlaying}
          seekTime={seekTime}
          repeat={repeat}
          currentIndex={currentIndex}
          onEnded={handleNextSong}
          onTimeUpdate={(event) => setAppTime(event.target.currentTime)}
          onLoadedData={(event) => setDuration(event.target.duration)}
        />
      </div>
      <VolumeBar
        value={volume}
        min="0"
        max="1"
        onChange={(event) => setVolume(event.target.value)}
        setVolume={setVolume}
      />
    </div>
  );
};

export default MusicPlayer;
