import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useRef, useState } from "react";
import { BsFilePerson } from "react-icons/bs";
import { MdMusicNote } from "react-icons/md";
import Loader from "./Loader";
import "./SongCard.css";

import { usePostDlMutation } from "../redux/services/dlservice";

const SearchResCard = (item, detail) => {
  const dispatch = useDispatch();
  const { thumbnails, title, channelTitle, publishTime } = item?.item.snippet;
  const { id } = item?.item;
  console.log("item", item);
  const { videoId, kind } = id;
  const dlUrl = import.meta.env.VITE_DL_SERVER;
  const [imgLoading, setImgLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { onLine } = window.navigator;
  const imgRef = useRef();
  const [postDl] = usePostDlMutation();
  const navigate = useNavigate();
  const handlePostDl = (id) => {
    const info = title.split("-");
    console.log("info", info);
    // navigate(`/video/${id}`)

    let data = {
      name: info[1],
      artist: info[0].replace(/ /g, ""),
      id: id,
      cover: thumbnails.default.url,
      date_de_sortie: publishTime,
    };
    console.log("my data", data);

    navigate(`/video/${id}`);
    postDl(data).then((res) => {
      // toast.success("En cours de téléchargement");
      setIsLoading(true);
    });
  };

  return (
    <div
      className={`flex flex-col w-[241px] p-4 corner bg-white/5  bg-opacity-80 backdrop-blur-sm animate-slideup rounded-[2em]`}>
      {/* {console.log('cover', song)} */}
      <div className="relative w-full h-full group ">
        <div
          onClick={() => handlePostDl(videoId)}
          className={`absolute inset-0 justify-center items-center bg-orange-500  bg-opacity-30  ${
            detail ? "h-full" : "h-[80%]"
          } rounded-2xl group-hover:flex `}>
          {/* <PlayPause
             
              handlePause={handlePauseClick}
              handlePlay={handlePlayClick}
              isPlaying={isPlaying}
              activeSong={activeSong}
            /> */}
        </div>
        {imgLoading || isLoading ? (
          <>
            <Loader />
            <img
              onClick={() => handlePostDl(videoId)}
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
            onClick={() => handlePostDl(videoId)}
            ref={imgRef}
            src={
              onLine
                ? `${thumbnails.default.url}`?.url
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

          <a onClick={() => handlePostDl(videoId)}>{title}</a>
        </p>
        <div className="w-full flex justify-center flex-wrap gap-3 items-center">
          <p className="text-sm m-1 p-1 flex flex-col items-center gap-1 capitalize truncate text-gray-300 mt-1">
            <BsFilePerson className="text-orange-600" />
            <Link to={``}>{channelTitle}</Link>
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
  );
};

export default SearchResCard;
