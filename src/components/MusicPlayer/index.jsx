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

const MusicPlayer = ({ setIsVisible }) => {
  const { activeSong, currentSongs, currentIndex, isActive, isPlaying } =
    useSelector((state) => state.player);
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
    title: activeSong.attributes?.name,
    artist: activeSong.attributes.artist?.data?.attributes?.name,
    artwork: [
      {
        src:
          "https://api.diabara.tv" +
          activeSong.attributes.cover?.data[0]?.attributes?.url,
      },
    ],
  });
  return (
    <div className="relative sm:px-2 mb-5 px-2 m-2 w-full flex flex-col items-center justify-between  border-t border-gray-600">
      <div
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-5 font-bold text-2xl text-white">
        X
      </div>
      <div className=" flex justify-center absolute top-2 right-14">
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
