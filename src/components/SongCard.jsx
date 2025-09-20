import axios from "axios";


import React, { useState, useEffect, useCallback, useRef  } from "react";
import { Link, useMatch } from "react-router-dom";




import ReactGA from "react-ga4";
import { BsFilePerson } from "react-icons/bs";
import { IoAlbumsOutline } from "react-icons/io5";
import { MdMusicNote } from "react-icons/md";
import { useDispatch } from "react-redux";


import { playPause, setActiveSong } from "../redux/features/playerSlice";
import { usePlayedMutation } from "../redux/services/songsApi";
import Download from "./Download";
import useAnalyticsEventTracker from "./hook/useAnalyticsEventTracker";
import Like from "./Like";
import Playlist from "./Playlist";
import PlayPause from "./PlayPause";
import SocialShare from "./SocialShare";
import "./SongCard.css";
import Streams from "./Streams";
import SongActions from "./SongActions";

const SongCard = ({
  song,
  i,
  activeSong,
  isPlaying,
  data,
  streams,
  refetchStreams,
  isStreamFetching,
  detail,
}) => {
  const dispatch = useDispatch();
  const { onLine } = window.navigator;
  const imgRef = useRef();
  const [imgLoading, setImgLoading] = useState(true);
  const API_FILE_URL = import.meta.env.VITE_API_FILE_URL;
  const [count, setCount] = useState(0);
  const [postPlayed] = usePlayedMutation();

  const isDetails = useMatch("/songs/:songid");
  const detailSong = isDetails?.params.songid;

  ReactGA.initialize([
    {
      trackingId: "G-YQKY9V1351",
    },
  ]);

  const user = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : null;

  // console.log("user", user);
  const userId = user?.user?.id;
  // console.log("userId", userId);
  const userUUID = localStorage.getItem("uuid");

  

  const gaEventTracker = useAnalyticsEventTracker("Songs");

  const handlePauseClick = () => dispatch(playPause(false));
  const handlePlayClick = () => {
    gaEventTracker("played", song.attributes.name);

    // Send a custom event
    ReactGA.event({
      category: "played",
      action: "Song play",
      label: `${song.attributes.name} - ${song.attributes.song?.attributes?.artist?.data?.attributes?.name}`, // optional
      value: 99, // optional, must be a number
      nonInteraction: true, // optional, true/false
      transport: "xhr", // optional, beacon/xhr/image
    });
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
    if (song?.attributes?.artist?.data?.attributes?.name) {
      postPlayed({
        data: {
          song: song.id,
          user: userId,
          visitor: userUUID,
        },
      });
    }
  };

  const handleImageLoad = () => setImgLoading(false);

  const share = () => {
    const opened = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>DiabaraTv ${song?.attributes.name} - ${song?.attributes?.artist?.data.attributes?.name}</title>
        <meta property="og:url" content='https://diabara.tv/${song?.id}' />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="DiabaraTv" />
        <meta property="og:description" content="La musique au bout des doigts" />
        <meta property="og:image" content="https://api.diabara.tv${song.attributes?.cover?.data[0]?.attributes?.formats?.small?.url}" />
      </head>
      <body>
        <div id="fb-root"></div>
        <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0&appId=your-facebook-app-id" nonce="FOKrbAYI"></script>
        <script>
          window.onload = function() {
            fb_share.href = 'http://www.facebook.com/share.php?u=' + encodeURIComponent(location.href);
          }
        </script>
        <a href="" id="fb_share">Share this page</a>
      </body>
      </html>`;
    axios.post("http://localhost:3100", { opened }).then(() => {
      window.open("http://localhost:3100");
    });
  };

  const renderImage = () => {
    const imageUrl =
      song.attributes?.cover?.data && onLine
        ? song.attributes?.cover?.data[0]?.attributes?.formats?.small?.url
          ? `${API_FILE_URL}${song.attributes?.cover?.data[0]?.attributes?.formats?.small?.url}`
          : `${API_FILE_URL}${song.attributes?.cover?.data[0]?.attributes?.url}`
        : song.attributes.cover;

    return (
      <img
        ref={imgRef}
        src={imageUrl}
        className={`md:w-full md:h-full object-contain w-[100px] h-[100px]  rounded-full md:rounded-2xl ${detail ? "rounded-2xl" : "rounded-2xl"}`}
        alt="song-img"
        onLoad={handleImageLoad}
      />
    );
  };

  const counter = () => {
    setCount((prevCount) => prevCount + 1);
    if (count == 2) {
      setTimeout(() => {
        setCount(0);
      }, 120000);
    }
  };

  const handleClick = () => {
    isPlaying ?? handlePauseClick();
  };

  const handlePlayClickWithCounter = useCallback(() => {
    if (count <= 1) {
      counter();
      console.log("count", count);
    } else {
      handleClick();
    }
  });

  return (
    <div onClick={handlePlayClickWithCounter} className={`h-full  `}>
      <div
        className={`flex md:flex-col ${isDetails ? "  md:h-[541px]" : "md:w-[241px]"} md:p-4 corner bg-white/5 w-full md:h-[350px] bg-opacity-80 h-32  backdrop-blur-sm animate-slideup rounded-[2em]`}>
        {count < 1 ? (
          <a
            href="https://www.effectiveratecpm.com/dk6epffzw?key=d70309a31870584c5914e216f01fb799"
            target="_blank"
            className="relative rounded-full md:rounded-none px-4 flex md:flex-col md:h-[350px]  md:w-full group">
            {renderImage()}

            <div
              className={`absolute md:w-full md:h-full inset-0 justify-center items-center bg-orange-500 bg-opacity-30 group-hover:flex ${
                activeSong?.id === song.id
                  ? "flex bg-black w-full bg-opacity-70"
                  : "hidden  bg-black w-full bg-opacity-20 "
              } md:rounded-2xl rounded-full`}>
              <PlayPause
                song={song}
                handlePause={handlePauseClick}
                handlePlay={handlePlayClick}
                isPlaying={isPlaying}
                activeSong={activeSong}
              />
            </div>
            <div className="relative w-full h-full flex justify-center items-center"></div>

            <div className="md:mt-2 w-full flex flex-col justify-around">
              <div className="w-full flex justify-center items-center">
                <p className="font-semibold md:m-1 md:p-1 md:w-full w-[220px] text-ellipsis animate animate-slideleft flex justify-center items-center md:gap-1 capitalize text-sm text-white truncate">
                  <MdMusicNote className="text-orange-600 md:block hidden" />
                  <Link to={`/songs/${song?.id}`}>{song.attributes.name}</Link>
                </p>
              </div>
              <div className="w-full flex justify-center items-center">
                <p className="text-sm md:m-1 md:p-1 flex flex-col items-center md:gap-1 capitalize truncate text-gray-300 mt-1">
                  <BsFilePerson className="text-orange-600  md:block hidden" />
                  <Link
                    to={
                      song?.attributes?.artist?.data?.attributes?.name
                        ? `/artists/${song?.attributes?.artist.data.id}`
                        : "/top-artists"
                    }>
                    {song?.attributes?.artist?.data?.attributes.name}
                  </Link>
                </p>
                {song?.attributes?.album?.data && (
                  <p className="text-sm m-1 p-1 flex flex-col items-center gap-1 capitalize truncate text-gray-300 mt-1">
                    <IoAlbumsOutline className="text-orange-600" />
                    <Link to={`/artists/${song?.attributes?.album?.data?.id}`}>
                      {song?.attributes?.album?.data?.attributes.name}
                    </Link>
                  </p>
                )}
              </div>
              <div className=" flex  flex-row md:items-end items-center md:justify-end justify-center md:gap-4">
                {user && <Like song={song.id} user={user?.user?.id} />}
                {user && <Playlist song={song.id} user={user?.user?.id} />}
                {user && <Download song={song} user={user?.user} />}
                <Streams
                  song={song.id}
                  user={user?.user?.id}
                  streams={streams}
                />
              </div>
              <a className="md:block hidden" onClick={share}>
                <SocialShare
                  url={`https://diabara.tv/songs/${song.id}`}
                  image={`https://api.diabara.tv${song.attributes?.cover?.data[0]?.attributes?.formats?.small?.url}`}
                  description="La musique au bout des doigts"
                  title={`DiabaraTv - ${song.attributes.name}`}
                />
              </a>
            </div>
          </a>
        ) : (
          <div className={`"relative  rounded-full md:rounded-none px-4 flex md:flex-col  md:w-full group" ${ isDetails ? "md:h-[541px]" : "h-24" }`}>
            {renderImage()}
            <div
              className={`absolute inset-0 h-full flex items-center justify-center transition-opacity duration-200
                ${activeSong?.id === song.id ? "opacity-100 bg-black bg-opacity-40" : "opacity-0 group-hover:opacity-100 bg-black bg-opacity-20"}
                md:rounded-2xl rounded-full pointer-events-none`}>
              <div className="pointer-events-auto shadow-md rounded-full md:rounded-2xl p-2 bg-black bg-opacity-50 shadow-white/70">
                <PlayPause
                  song={song}
                  handlePause={handlePauseClick}
                  handlePlay={handlePlayClick}
                  isPlaying={isPlaying}
                  activeSong={activeSong}
                />
              </div>
            </div>
            <div className="relative w-full h-full flex justify-center items-center"></div>

            <div className="md:mt-2 w-full flex flex-col justify-around">
              <div className="w-full flex justify-center items-center">
                <p className="font-semibold md:m-1 md:p-1 md:w-full w-[220px] text-ellipsis animate animate-slideleft flex justify-center items-center md:gap-1 capitalize text-sm text-white truncate">
                  <MdMusicNote className="text-orange-600 md:block hidden" />
                  <Link to={`/songs/${song?.id}`}>{song.attributes.name}</Link>
                </p>
              </div>
              <div className="w-full flex justify-center items-center">
                <p className="text-sm md:m-1 md:p-1 flex flex-col items-center md:gap-1 capitalize truncate text-gray-300 mt-1">
                  <BsFilePerson className="text-orange-600  md:block hidden" />
                  <Link
                    to={
                      song?.attributes?.artist?.data?.attributes?.name
                        ? `/artists/${song?.attributes?.artist.data.id}`
                        : "/top-artists"
                    }>
                    {song?.attributes?.artist?.data?.attributes.name}
                  </Link>
                </p>
                {song?.attributes?.album?.data && (
                  <p className="text-sm m-1 p-1 flex flex-col items-center gap-1 capitalize truncate text-gray-300 mt-1">
                    <IoAlbumsOutline className="text-orange-600 md:block hidden" />
                    <Link to={`/artists/${song?.attributes?.album?.data?.id}`}>
                      {song?.attributes?.album?.data?.attributes.name}
                    </Link>
                  </p>
                )}
              </div>
              <SongActions
                songId={song.id}
                song={song}
                user={user}
                streams={streams}
                Like={Like}
                Playlist={Playlist}
                Download={Download}
                StreamsComponent={Streams}
                className="mt-2"
             />
              <a className="md:block hidden" onClick={share}>
                <SocialShare
                  url={`https://diabara.tv/songs/${song.id}`}
                  image={`https://api.diabara.tv${song.attributes?.cover?.data[0]?.attributes?.formats?.small?.url}`}
                  description="La musique au bout des doigts"
                  title={`DiabaraTv - ${song.attributes.name}`}
                />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;
