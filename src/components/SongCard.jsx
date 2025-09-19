import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { playPause, setActiveSong } from "../redux/features/playerSlice";
import PlayPause from "./PlayPause";

import { useRef, useState } from "react";
import { BsFilePerson } from "react-icons/bs";
import { IoAlbumsOutline } from "react-icons/io5";
import { MdMusicNote } from "react-icons/md";
import { logEvent } from "../analytics";
import useAnalyticsEventTracker from "./hook/useAnalyticsEventTracker";
import Like from "./Like";
import Loader from "./Loader";
import Playlist from "./Playlist";
import SocialShare from "./SocialShare";
import "./SongCard.css";
import Streams from "./Streams";

import axios from "axios";
import ReactGA from "react-ga4";
import { useAddPlayedMutation } from "../redux/services/played";
import { useGetVisitorsByUUIDQuery } from "../redux/services/visitor";
import Download from "./Download";

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
  //Google Analytics
  ReactGA.send({
    hitType: "pageview",
    page: `/songs/${song?.attributes.name}`,
    title: `${song?.name - song?.attributes.artist?.data?.attributes?.name}`,
  });

  const dispatch = useDispatch();

  const { onLine } = window.navigator;
  const imgRef = useRef();

  const API_FILE_URL = import.meta.env.VITE_API_FILE_URL;

  //event Tracker

  const gaEventTracker = useAnalyticsEventTracker("Songs");

  const [imgLoading, setImgLoading] = useState(true);
  const deviceId = localStorage.getItem("uuid");
  console.log("deviceId", deviceId);

  const { data: visitorData } = useGetVisitorsByUUIDQuery(deviceId);

  console.log("visitorData", visitorData?.data[0]);
  const [played] = useAddPlayedMutation();

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handleImageLoad = (e) => {
    setImgLoading(e);
  };
  const share = () => {
    var opened = `<!DOCTYPE html>
    <html><head>
    <title> DiabaraTv ${song?.attributes.name}  - ${song?.attributes?.artist?.data.attributes?.name} </title>
    <meta property="og:url"           content='https://diabara.tv'${song?.id}/>
    <meta property="og:type"          content="website" />
    <meta property="og:title"         content="DiabaraTv" />
    <meta property="og:description"   content="La musique au bout des doigts" />
    <meta property="og:image"         content="https://api.diabara.tv${song.attributes?.cover?.data[0]?.attributes?.formats?.small?.url}" />
    </head>
    <body>
      <!-- Load Facebook SDK for JavaScript -->
        <div id="fb-root"></div>
  <script async defer crossorigin="anonymous" 
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1
             &version={graph-api-version}
             &appId={your-facebook-app-id}" 
        nonce="FOKrbAYI">
  </script>
      <script>
        window.onload = function() {
            fb_share.href ='http://www.facebook.com/share.php?u=' + encodeURIComponent(location.href); 
        }  
       </script>

     <a href="" id="fb_share">Share this page</a>

    </body>
    </html>`;

    axios({
      url: "http://localhost:3100",
      data: {
        opened,
      },
      method: "POST",
    }).then((rep) => {
      window.open("http://localhost:3100");
    });
  };

  const handlePlayClick = async () => {
    logEvent("Song", `${song.attributes.name}`, "played");
    dispatch(setActiveSong({ song, data, i }));

    console.log("song", song);
    const user = localStorage.getItem("auth");
    console.log("user", user);
    dispatch(playPause(true));

    // Préparation des données pour l'API
    const playedData = {
      song: song.id,
      user: JSON.parse(localStorage.getItem("auth"))?.user?.id || null,
      visitor: visitorData?.data[0]?.id || null,
    };

 

    // Envoi des données à l'API
    const play = await played(playedData).unwrap();
    console.log("Données envoyées avec succès :", play);
  };
  const user = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : null;

  return (
    <div
      className={`flex md:flex-col ${
        detail ? detail : "md:w-[241px]"
      }  p-4 corner bg-white/5 w-full h-[240px] md:h-full   bg-opacity-80 backdrop-blur-sm animate-slideup rounded-[2em]`}>
      {/* {console.log('cover', song)} */}
      <div className="relative flex md:flex-col md:h-40 w-full  h-full group ">
        <div
          className={`absolute md:w-full h-full inset-0 justify-center items-center bg-orange-500  bg-opacity-30  ${
            detail ? "md:h-full" : "md:h-full"
          } rounded-2xl group-hover:flex ${
            activeSong?.id === song.id
              ? "flex bg-black w-full bg-opacity-70"
              : "hidden"
          }`}>
          <PlayPause
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
            isPlaying={isPlaying}
            activeSong={activeSong}
          />
        </div>
        {imgLoading ? (
          <>
            <Loader />
            <img
              ref={imgRef}
              src={
                onLine
                  ? `https://api.diabara.tv${song.attributes?.cover?.data[0]?.attributes?.url}`
                  : `${song.attributes.cover}`
              }
              className={`hidden md:w-full md:h-full object-cover ${
                detail
                  ? "md:w-full md:h-full w-1/2 h-1/2 rounded-2xl object-fit"
                  : "rounded-2xl object-fit"
              } `}
              alt="song-img"
              // onProgress={(e) => handleImageLoad(true)}
              onLoad={() => handleImageLoad(false)}
            />
          </>
        ) : (
          <img
            ref={imgRef}
            src={
              song.attributes?.cover?.data && onLine
                ? song.attributes?.cover?.data[0]?.attributes?.format
                  ? `${API_FILE_URL}${song.attributes?.cover?.data[0]?.attributes?.formats?.small?.url}`
                  : `${API_FILE_URL}${song.attributes?.cover?.data[0].attributes?.url}`
                : song.attributes.cover
            }
            className={`md:w-full md:h-full w-40 h-full  object-cover ${
              detail ? "  rounded-2xl" : "rounded-2xl "
            }`}
            alt="song-img"
            // onProgress={(e) => handleImageLoad(true)}
            onLoad={() => handleImageLoad(false)}
          />
        )}
      </div>
      <div className="mt-2 w-full flex flex-col ">
        <div className="w-full flex justify-center items-center">
          <p className="font-semibold m-1 p-1 md:w-full w-32  text-ellipsis animate animate-slideleft flex  justify-center items-center gap-1 capitalize text-sm text-white truncate">
            <MdMusicNote className="text-orange-600" />
            <Link to={`/songs/${song?.id}`}>{song.attributes.name}</Link>
          </p>
        </div>

        <div className="w-full flex justify-center   items-center">
          <p className="text-sm m-1 p-1 flex flex-col items-center gap-1 capitalize truncate text-gray-300 mt-1">
            <BsFilePerson className="text-orange-600" />
            <Link
              to={
                song?.attributes?.artist &&
                song?.attributes?.artist?.data?.attributes?.name
                  ? `/artists/${song?.attributes?.artist.data.id}`
                  : "/top-artists"
              }>
              {song?.attributes?.artist?.data?.attributes.name}
            </Link>
          </p>
          <p className="text-sm m-1 p-1 flex flex-col items-center gap-1 capitalize truncate text-gray-300 mt-1">
            {song?.attributes?.album?.data && (
              <IoAlbumsOutline className="text-orange-600" />
            )}
            <Link
              to={
                song?.attributes?.album
                  ? `/artists/${song?.attributes?.album?.data?.id}`
                  : "/top-artists"
              }>
              {song?.attributes?.album?.data?.attributes.name}
            </Link>
          </p>
        </div>

        <div className="flex flex-row items-end justify-end gap-4">
          {user && <Like song={song.id} user={user?.user?.id} />}
          {user && <Playlist song={song.id} user={user?.user?.id} />}
          {user && <Download song={song} user={user?.user} />}
          {<Streams song={song.id} user={user?.user?.id} streams={streams} />}
        </div>
        <a onClick={() => share()}>
          <SocialShare
            url={`https://diabara.tv/songs/${song.id}`}
            image={`https://api.diabara.tv${song.attributes?.cover?.data && song.attributes?.cover?.data[0]?.attributes?.formats?.small?.url}`}
            description="ex"
            title="ex"
          />
        </a>
      </div>
    </div>
  );
};

export default SongCard;
