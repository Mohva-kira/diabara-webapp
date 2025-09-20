import React, { useRef, useState } from "react";
import "./index.css";

import { video } from "../../assets";
import useVideoPlayer from "../../hooks/useVideoPlayer";
import { CiVolumeMute, CiVolumeHigh, CiPlay1, CiPause1 } from "react-icons/ci";
import { youtubeSearch } from "../../utils/youtubeDownload";
import { useLocation, useNavigate } from "react-router-dom";
import SearchResCard from "../SearchResCard";

const VideoPlayer = ({ id }) => {
  const videoElement = useRef(null);
  const {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
  } = useVideoPlayer(videoElement);

  //extract data from redirection navigate(`/video/${id}`, { state: { data: data } });
  const [videos, setVideos] = useState();
  const { state } = useLocation();
  const { data } = state;
  console.log("id video player", id);

  console.log("data video player", data);

  if (data) {
    var title = data.name;
    var artist = data.artist;
    var cover = data.cover;
    var publishTime = data.date_de_sortie;
    youtubeSearch(title, artist, cover, publishTime).then((res) => {
      console.log("video url", res);
      setVideos(res);
      // return res
    });
  }

  return (
    <div className="video-wrapper sm:w-[720px] flex flex-col items-center justify-center mt-4">
      <iframe
        className="sm:w-{720px]"
        width="100%"
        height="360"
        src={`https://www.youtube.com/embed/${id}?si=_Stz3lVp0rNLhNmg`}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>

      <div>
        Vous aimerez aussi
        {videos &&
          videos.sort((a, b) => a- b).map((song, i) => (
            <div key={i}>
              <SearchResCard item={song} i={i} />
            </div>
          ))}
      </div>

      {/* <video
          src={video}
          ref={videoElement}
          onTimeUpdate={handleOnTimeUpdate}
        /> */}
      {/* <div className="controls">
          <div className="actions text-white text-2xl">
            <button onClick={togglePlay}>
              {!playerState.isPlaying ? (
                <CiPlay1 />
              ) : (
                <CiPause1 />
              )}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={playerState.progress}
            onChange={(e) => handleVideoProgress(e)}
          />
          <select
            className="velocity"
            value={playerState.speed}
            onChange={(e) => handleVideoSpeed(e)}
          >
            <option value="0.50">0.50x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="2">2x</option>
          </select>
          <button className="mute-btn text-white" onClick={toggleMute}>
            {!playerState.isMuted ? (
              <CiVolumeHigh />
            ) : (
              <CiVolumeMute />
            )}
          </button>
         
        </div> */}
    </div>
  );
};

export default VideoPlayer;
