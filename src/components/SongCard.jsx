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
import { useGetStreamsQuery } from "../redux/services/streams";

const SongCard = ({
  song,
  i,
  activeSong,
  isPlaying,
  data,
  
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
  const {data: streams, isLoading: isLoadingStreams, refetch} = useGetStreamsQuery(song.id)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isImgError, setIsImgError] = useState(false)
  const isDetails = useMatch("/songs/:songid");
  const detailSong = isDetails?.params.songid;


  console.log('streams song card', streams)
  
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
        /* console.log("imageUrl", imageUrl); 
        
            className={`absolute inset-0  w-[100px] h-[100px]  ${detail ? "rounded-2xl" : "rounded-2xl"} flex items-center justify-center transition-opacity duration-200
        ${activeSong?.id === song.id ? "opacity-100 bg-orange-500 bg-opacity-40" : "opacity-0 group-hover:opacity-100 bg-orange-500 bg-opacity-20"}
        md:rounded-2xl rounded-full pointer-events-none`}
        
        */

    return (
      <div
        className={`
          md:w-full md:h-full w-full h-full
          flex justify-center items-center 
          rounded-2xl md:rounded-3xl
          overflow-hidden
          ${detail ? "rounded-2xl" : "rounded-2xl"}
        `}
      >
        <div className="
          pointer-events-auto 
          relative 
          shadow-xl 
          md:h-full 
          rounded-2xl 
          md:w-full 
          h-full 
          w-full
          overflow-hidden
          group/image
          flex
          items-center
          justify-center
        ">
          <img
            ref={imgRef}
            src={imageUrl}
            className={`
              md:w-full md:h-full w-full h-full 
              object-cover 
              min-w-full min-h-full
              rounded-2xl
              transition-transform duration-500
              group-hover/image:scale-110
              ${activeSong?.id === song.id ? "scale-105" : ""}
            `}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
            alt="song-img"
            onLoad={handleImageLoad}
            onError={() => setIsImgError(true)}
          />

          {/* Overlay avec bouton play au hover - visible sur mobile et quand actif */}
          <div 
            className={`
              absolute inset-0 
              rounded-2xl 
              flex md:hidden items-center justify-center 
              transition-all duration-300
              backdrop-blur-[2px]
              ${
                activeSong?.id === song.id 
                  ? "opacity-100 bg-gradient-to-br from-orange-500/60 to-orange-600/50 border-2 border-blue-500/40" 
                  : "opacity-0 group-hover/image:opacity-100 bg-gradient-to-br from-orange-500/40 to-blue-500/20"
              }
            `}
          >
            <PlayPause
              song={song}
              handlePause={handlePauseClick}
              handlePlay={handlePlayClick}
              isPlaying={isPlaying}
              activeSong={activeSong}
            />
          </div>
        </div>
      </div>
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
    console.log("count", count);
     counter()
    isPlaying ?? handlePauseClick();
  };

  const handlePlayClickWithCounter = useCallback(() => {

      handleClick();
    
  });

  return (
    <div 
      onClick={handlePlayClickWithCounter} 
      className={`w-full md:w-[280px] mb-6 transition-all duration-300 hover:scale-[1.02]`}
    >
      <div
        className={`
          flex md:flex-col 
          ${isDetails ? "md:h-[580px]" : "md:w-[280px]"} 
          p-3 md:p-5 corner 
          bg-gradient-to-br from-black/90 via-black/80 to-black/90
          w-full md:h-[400px] 
          h-32 backdrop-blur-md 
          animate-slideup 
          rounded-3xl
          shadow-lg shadow-orange-500/5
          hover:shadow-2xl hover:shadow-orange-500/15
          transition-all duration-500 ease-out
        `}
      >
        {count > 2 ? (
          <a
            href="https://www.effectiveratecpm.com/dk6epffzw?key=d70309a31870584c5914e216f01fb799"
            target="_blank"
            className="relative rounded-2xl flex md:flex-col md:h-full md:w-full group overflow-hidden"
          >
            <div className="md:w-full md:h-full md:absolute md:inset-0 w-24 h-24 flex-shrink-0">
              {renderImage()}
            </div>

            <div
              className={`
                absolute md:w-full md:h-full inset-0 
                justify-center items-center 
                bg-gradient-to-br from-orange-500/50 to-orange-600/40 
                group-hover:flex 
                transition-all duration-300
                ${
                  activeSong?.id === song.id
                    ? "flex bg-blue-500/20 backdrop-blur-sm border-2 border-orange-500/50"
                    : "hidden bg-blue-500/10"
                } 
                md:rounded-3xl rounded-2xl z-20
              `}
            >
              <PlayPause
                song={song}
                handlePause={handlePauseClick}
                handlePlay={handlePlayClick}
                isPlaying={isPlaying}
                activeSong={activeSong}
              />
            </div>

            <div className="md:relative md:z-30 md:mt-auto md:pt-4 md:bg-gradient-to-t from-black/90 via-black/70 to-transparent w-full flex flex-col justify-between md:gap-3 gap-2">
              <div className="space-y-2">
                <div className="w-full flex justify-center items-center">
                  <p className="font-bold md:text-base text-sm md:m-0 md:p-0 md:w-full w-[220px] text-ellipsis flex justify-center items-center gap-2 capitalize text-white truncate hover:text-orange-400 transition-colors">
                    <MdMusicNote className="text-orange-500 text-lg drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                    <Link to={`/songs/${song?.attributes?.name}`} className="truncate">
                      {song.attributes.name}
                    </Link>
                  </p>
                </div>
                <div className="w-full flex flex-col items-center gap-1">
                  <p className="text-sm md:text-sm text-xs flex items-center gap-2 capitalize truncate text-gray-300">
                    <BsFilePerson className="text-blue-400" />
                    <Link
                      to={
                        song?.attributes?.artist?.data?.attributes?.name
                          ? `/artists/${song?.attributes?.artist.data.id}`
                          : "/top-artists"
                      }
                      className="hover:text-blue-400 transition-colors truncate"
                    >
                      {song?.attributes?.artist?.data?.attributes.name}
                    </Link>
                  </p>
                  {song?.attributes?.album?.data && (
                    <p className="text-xs md:text-sm flex items-center gap-2 capitalize truncate text-gray-400">
                      <IoAlbumsOutline className="text-blue-400" />
                      <Link 
                        to={`/artists/${song?.attributes?.album?.data?.id}`}
                        className="hover:text-blue-400 transition-colors truncate"
                      >
                        {song?.attributes?.album?.data?.attributes.name}
                      </Link>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-row md:items-center items-center md:justify-center justify-center md:gap-3 gap-2 pt-2 border-t border-blue-500/20">
                {user && <Like song={song.id} user={user?.user?.id} />}
                {user && <Playlist song={song.id} user={user?.user?.id} />}
                {user && <Download song={song} user={user?.user} />}
                <Streams
                  song={song.id}
                  user={user?.user?.id}
                  streams={streams}
                />
              </div>
              
              <a className="block mt-2" onClick={(e) => e.stopPropagation()}>
                <SocialShare
                  url={`https://diabara.tv/songs/${song.id}`}
                  image={(() => {
                    const formatImageUrl = (imageUrl) => {
                      if (!imageUrl) return '';
                      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                        return imageUrl;
                      }
                      return `https://api.diabara.tv${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
                    };
                    return song.attributes?.cover?.data?.[0]?.attributes?.formats?.small?.url 
                      ? formatImageUrl(song.attributes.cover.data[0].attributes.formats.small.url)
                      : song.attributes?.cover?.data?.[0]?.attributes?.url
                        ? formatImageUrl(song.attributes.cover.data[0].attributes.url)
                        : '';
                  })()}
                  description={`${song.attributes.name}${song?.attributes?.artist?.data?.attributes?.name ? ` par ${song.attributes.artist.data.attributes.name}` : ''} - La musique au bout des doigts sur Diabara TV`}
                  title={`${song.attributes.name}${song?.attributes?.artist?.data?.attributes?.name ? ` - ${song.attributes.artist.data.attributes.name}` : ''} | Diabara TV`}
                />
              </a>
            </div>
          </a>
        ) : (
          <div 
            className={`
              relative rounded-2xl flex md:flex-col md:w-full group/card
              ${isDetails ? "md:h-[580px]" : "md:h-[400px] h-24"}
              overflow-hidden
            `}
          >
            <div className="md:w-full md:h-full md:absolute md:inset-0 w-24 h-24 flex-shrink-0">
              {renderImage()}
            </div>

            {/* Overlay avec bouton play au hover sur PC */}
            <div 
              className={`
                absolute inset-0 
                hidden md:flex
                items-center justify-center 
                transition-all duration-300
                backdrop-blur-[2px]
                rounded-2xl
                ${
                  activeSong?.id === song.id 
                    ? "opacity-100 bg-gradient-to-br from-orange-500/60 to-orange-600/50 border-2 border-blue-500/40 z-30" 
                    : "opacity-0 group-hover/card:opacity-100 bg-gradient-to-br from-orange-500/40 to-blue-500/20 z-20"
                }
              `}
            >
              <PlayPause
                song={song}
                handlePause={handlePauseClick}
                handlePlay={handlePlayClick}
                isPlaying={isPlaying}
                activeSong={activeSong}
              />
            </div>

            <div className="md:relative md:z-10 md:mt-auto md:pt-4 md:bg-gradient-to-t from-black/90 via-black/70 to-transparent md:flex-1 w-full flex flex-col justify-between md:gap-3 gap-2">
              <div className="space-y-2 md:space-y-3">
                <div className="w-full flex justify-center items-center">
                  <p className="font-bold md:text-lg text-sm md:m-0 md:p-0 md:w-full w-[220px] text-ellipsis flex justify-center items-center gap-2 capitalize text-white truncate hover:text-orange-400 transition-colors">
                    <MdMusicNote className="text-orange-500 text-lg md:text-xl drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                    <Link to={`/songs/${song?.id}`} className="truncate">
                      {song.attributes.name}
                    </Link>
                  </p>
                </div>
                <div className="w-full flex flex-col items-center gap-1 md:gap-2">
                  <p className="text-sm md:text-base text-xs flex items-center gap-2 capitalize truncate text-gray-300">
                    <BsFilePerson className="text-blue-400 md:text-lg" />
                    <Link
                      to={
                        song?.attributes?.artist?.data?.attributes?.name
                          ? `/artists/${song?.attributes?.artist.data.id}`
                          : "/top-artists"
                      }
                      className="hover:text-blue-400 transition-colors truncate"
                    >
                      {song?.attributes?.artist?.data?.attributes.name}
                    </Link>
                  </p>
                  {song?.attributes?.album?.data && (
                    <p className="text-xs md:text-sm flex items-center gap-2 capitalize truncate text-gray-400">
                      <IoAlbumsOutline className="text-blue-400 md:text-base" />
                      <Link 
                        to={`/artists/${song?.attributes?.album?.data?.id}`}
                        className="hover:text-blue-400 transition-colors truncate"
                      >
                        {song?.attributes?.album?.data?.attributes.name}
                      </Link>
                    </p>
                  )}
                </div>
              </div>
              
              <SongActions
                songId={song.id}
                song={song}
                user={user}
                streams={streams}
                Like={Like}
                Playlist={Playlist}
                Download={Download}
                showDownload={false}
                StreamsComponent={Streams}
                className="mt-2"
              />
              
              <a className="block mt-3" onClick={(e) => e.stopPropagation()}>
                <SocialShare
                  url={`https://diabara.tv/songs/${song.id}`}
                  image={(() => {
                    const formatImageUrl = (imageUrl) => {
                      if (!imageUrl) return '';
                      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                        return imageUrl;
                      }
                      return `https://api.diabara.tv${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
                    };
                    return song.attributes?.cover?.data?.[0]?.attributes?.formats?.small?.url 
                      ? formatImageUrl(song.attributes.cover.data[0].attributes.formats.small.url)
                      : song.attributes?.cover?.data?.[0]?.attributes?.url
                        ? formatImageUrl(song.attributes.cover.data[0].attributes.url)
                        : '';
                  })()}
                  description={`${song.attributes.name}${song?.attributes?.artist?.data?.attributes?.name ? ` par ${song.attributes.artist.data.attributes.name}` : ''} - La musique au bout des doigts sur Diabara TV`}
                  title={`${song.attributes.name}${song?.attributes?.artist?.data?.attributes?.name ? ` - ${song.attributes.artist.data.attributes.name}` : ''} | Diabara TV`}
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
