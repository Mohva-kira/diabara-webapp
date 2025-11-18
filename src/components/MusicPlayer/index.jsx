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
    dispatch(playPause(false));

    if (!shuffle) {
      dispatch(nextSong((currentIndex + 1) % currentSongs.length));
    } else {
      dispatch(nextSong(Math.floor(Math.random() * currentSongs.length)));
    }
  };

  const handlePrevSong = () => {
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

  navigator.mediaSession.setActionHandler("play", handlePlayPause);
  navigator.mediaSession.setActionHandler("pause", handlePlayPause);
  navigator.mediaSession.setActionHandler("nexttrack", () =>
    dispatch(nextSong(currentIndex + 1))
  );
  navigator.mediaSession.setActionHandler("previoustrack", handlePrevSong);
  navigator.mediaSession.setActionHandler("seekto", () => seekTime);
  navigator.mediaSession.metadata = new MediaMetadata({
    title: activeSong?.attributes?.name,
    artist: activeSong?.attributes?.artist?.data?.attributes?.name,
    artwork: [
      {
        src:
          "https://api.diabara.tv" +
          activeSong?.attributes?.cover?.data[0]?.attributes?.url,
      },
    ],
  });
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
      <div className="flex-1 flex flex-col items-center justify-center">
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
