import React from 'react'
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import PlayPause from "./PlayPause";
import { playPause, setActiveSong } from "../redux/features/playerSlice";

import "./SongCard.css";
import Like from "./Like";
import Streams from "./Streams";
import Playlist from "./Playlist";
import { MdMusicNote } from "react-icons/md";
import { BsFilePerson } from "react-icons/bs";
import { IoAlbumsOutline } from "react-icons/io5";
import { ShareSocial } from "react-share-social";
import { color } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Loader from "./Loader";
import { useRef, useState } from "react";
import useAnalyticsEventTracker from "./hook/useAnalyticsEventTracker";
import Download from "./Download";
import SocialShare from "./SocialShare";
import { logEvent } from "../analytics";

import ReactGA from "react-ga4";
const SearchCard = (item, detail) => {
  const dispatch = useDispatch();
  const {thumbnails, title} = item.snippet
  const {id, channelTitle, publishTime} = item
  const {videoId, kind} = id
  const dlUrl = import.meta.env.VITE_DL_SERVER;

  console.log('itemmm', item)
  return (
   <div
      className={`flex flex-col ${
        detail ? detail : "w-[241px]"
      }  p-4 corner bg-white/5  bg-opacity-80 backdrop-blur-sm animate-slideup rounded-[2em]`}>
      

      {/* {console.log('cover', song)} */}
      <div className="relative w-full h-full group ">
        <div
          className={`absolute inset-0 justify-center items-center bg-orange-500  bg-opacity-30  ${
            detail ? "h-full" : "h-[80%]"
          } rounded-2xl group-hover:flex `}>
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
                  ? `${thumbnails.default.url}`
                  : `${thumbnails.medium.url}`
              }
              className={`hidden ${
                detail
                  ? "w-full h-fit rounded-2xl object-fit"
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
              onLine
                ? `${thumbnails.default.url}`
                    ?.url
                  ? `${thumbnails.default.url}`
                  : `${thumbnails.medium.url}`
                : `${thumbnails.default.url}`
            }
            className={`${
              detail ? "w-full h-fit object-contain rounded-2xl" : "rounded-2xl"
            }`}
            alt="song-img"
            // onProgress={(e) => handleImageLoad(true)}
            onLoad={() => handleImageLoad(false)}
          />
        )}
      </div>
      <div className="mt-1 flex flex-col ">
        <p className="font-semibold m-1 p-1 w-full animate animate-slideleft flex justify-center items-center gap-1 capitalize text-sm text-white truncate">
          <MdMusicNote className="text-orange-600" />
          <Link to={dlUrl`/${videoId}`}>{title}</Link>
        </p>
        <div className="w-full flex justify-center flex-wrap gap-3 items-center">
          <p className="text-sm m-1 p-1 flex flex-col items-center gap-1 capitalize truncate text-gray-300 mt-1">
            <BsFilePerson className="text-orange-600" />
            <Link
              to={``}>
              {channelTitle}
            </Link>
          </p>
      
        </div>

        {/* <div className="flex flex-row items-end justify-end gap-4">
          {user && <Like song={song.id} user={user?.user?.id} />}
          {user && <Playlist song={song.id} user={user?.user?.id} />}
          {user && <Download song={song} user={user?.user} />}
          {<Streams song={song.id} user={user?.user?.id} streams={streams} />}
        </div>
        <a onClick={() => share()}>
          <SocialShare
            url={`https://diabara.tv/songs/${song.id}`}
            image={`https://api.diabara.tv${song.attributes?.cover?.data[0]?.attributes?.formats?.small?.url}`}
            description="ex"
            title="ex"
          />
        </a> */}
      </div>
    </div>
  )
}

export default SearchCard
