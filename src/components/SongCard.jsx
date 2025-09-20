import React, { memo, useCallback, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Redux
import { playSong, playPause, selectCurrentSong, selectIsPlaying } from "../redux/features/playerSlice";
import { selectUser, addToRecentlyPlayed, incrementListeningTime } from "../redux/features/userSlice";

// Components
import PlayPause from "./PlayPause";
import Like from "./Like";
import Loader from "./Loader";
import Playlist from "./Playlist";
import SocialShare from "./SocialShare";
import Download from "./Download";
import Streams from "./Streams";

// Icons
import { BsFilePerson } from "react-icons/bs";
import { IoAlbumsOutline } from "react-icons/io5";
import { MdMusicNote, MdPlayArrow, MdPause } from "react-icons/md";

// Utils
import { logEvent } from "../analytics";
import useAnalyticsEventTracker from "./hook/useAnalyticsEventTracker";
import { useAddPlayedMutation } from "../redux/services/played";
import { useGetVisitorsByUUIDQuery } from "../redux/services/visitor";

import "./SongCard.css";

const SongCard = memo(({
  song,
  index,
  data,
  streams,
  refetchStreams,
  isStreamFetching,
  detail = false,
  className = "",
}) => {
  // Redux state
  const dispatch = useDispatch();
  const currentSong = useSelector(selectCurrentSong);
  const isPlaying = useSelector(selectIsPlaying);
  const user = useSelector(selectUser);
  
  // Local state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Refs
  const imageRef = useRef(null);
  
  // Constants
  const API_FILE_URL = import.meta.env.VITE_API_FILE_URL;
  const { onLine } = window.navigator;
  const deviceId = localStorage.getItem("uuid");
  
  // Queries
  const { data: visitorData } = useGetVisitorsByUUIDQuery(deviceId);
  const [addPlayed] = useAddPlayedMutation();
  
  // Analytics
  const gaEventTracker = useAnalyticsEventTracker("Songs");
  
  // Computed values
  const isCurrentSong = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;
  
  // Image URL logic optimized
  const getImageUrl = useCallback(() => {
    if (!onLine) return song.attributes?.cover;
    
    const coverData = song.attributes?.cover?.data?.[0]?.attributes;
    if (!coverData) return null;
    
    const formatUrl = coverData.formats?.small?.url || coverData.formats?.thumbnail?.url;
    return formatUrl ? `${API_FILE_URL}${formatUrl}` : `${API_FILE_URL}${coverData.url}`;
  }, [song.attributes?.cover, onLine, API_FILE_URL]);
  
  // Song info optimized
  const songInfo = {
    title: song.attributes?.name || "Titre inconnu",
    artist: song.attributes?.artist?.data?.attributes?.name || "Artiste inconnu",
    album: song.attributes?.album?.data?.attributes?.name,
    artistId: song.attributes?.artist?.data?.id,
    albumId: song.attributes?.album?.data?.id,
  };
  
  // Event handlers
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);
  
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);
  
  const handlePlayClick = useCallback(async () => {
    try {
      // Analytics
      logEvent("Song", songInfo.title, "played");
      gaEventTracker("play", songInfo.title);
      
      // Redux actions - nouvelle structure
      dispatch(playSong({
        song: {
          id: song.id,
          title: songInfo.title,
          artist: songInfo.artist,
          image: getImageUrl(),
          preview: song.attributes?.preview_url,
          url: song.attributes?.audio_url || song.attributes?.url,
        },
        queue: data || [song],
        startIndex: index || 0,
      }));
      
      // Add to recently played
      if (user) {
        dispatch(addToRecentlyPlayed({
          id: song.id,
          title: songInfo.title,
          artist: songInfo.artist,
          image: getImageUrl(),
        }));
      }
      
      // Track played
      const playedData = {
        song: song.id,
        user: user?.id || null,
        visitor: visitorData?.data?.[0]?.id || null,
      };
      
      await addPlayed(playedData).unwrap();
      
    } catch (error) {
      console.error("Erreur lors de la lecture:", error);
    }
  }, [song, songInfo, data, index, user, visitorData, dispatch, gaEventTracker, addPlayed, getImageUrl]);
  
  const handlePauseClick = useCallback(() => {
    dispatch(playPause());
  }, [dispatch]);
  
  const togglePlayPause = useCallback(() => {
    if (isCurrentSong) {
      handlePauseClick();
    } else {
      handlePlayClick();
    }
  }, [isCurrentSong, handlePlayClick, handlePauseClick]);
  
  // Share functionality improved
  const handleShare = useCallback(() => {
    const shareData = {
      title: `${songInfo.title} - ${songInfo.artist}`,
      text: `Écoutez ${songInfo.title} par ${songInfo.artist} sur DiabaraTV`,
      url: `https://diabara.tv/songs/${song.id}`,
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(shareData.url);
    }
  }, [song.id, songInfo]);
  
  return (
    <div 
      className={`
        group relative flex md:flex-col 
        ${detail ? "md:w-full" : "md:w-[280px]"} 
        p-4 w-full h-[240px] md:h-[320px]
        bg-white/5 backdrop-blur-sm 
        hover:bg-white/10 
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-2xl
        rounded-2xl overflow-hidden
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative flex md:flex-col md:h-48 w-full h-full overflow-hidden rounded-xl">
        {/* Play Overlay */}
        <div className={`
          absolute inset-0 z-20
          flex items-center justify-center
          bg-black/40 backdrop-blur-sm
          transition-all duration-300
          ${(isHovered || isCurrentSong) ? 'opacity-100' : 'opacity-0'}
          ${isCurrentSong ? 'bg-orange-500/30' : ''}
        `}>
          <button
            onClick={togglePlayPause}
            className="
              flex items-center justify-center
              w-16 h-16 rounded-full
              bg-orange-500 hover:bg-orange-600
              text-white shadow-lg
              transform transition-all duration-200
              hover:scale-110 active:scale-95
            "
            aria-label={isCurrentlyPlaying ? "Pause" : "Play"}
          >
            {isCurrentlyPlaying ? (
              <MdPause size={32} />
            ) : (
              <MdPlayArrow size={32} />
            )}
          </button>
        </div>
        
        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-800/50">
            <Loader />
          </div>
        )}
        
        {/* Image */}
        <img
          ref={imageRef}
          src={getImageUrl() || "/placeholder-album.png"}
          className={`
            w-full h-full object-cover
            transition-all duration-500
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            ${isCurrentSong ? 'scale-105' : 'scale-100'}
          `}
          alt={`${songInfo.title} cover`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Playing Indicator */}
        {isCurrentlyPlaying && (
          <div className="absolute top-2 right-2 z-30">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-orange-500 animate-pulse rounded-full"></div>
              <div className="w-1 h-3 bg-orange-400 animate-pulse rounded-full animation-delay-100"></div>
              <div className="w-1 h-5 bg-orange-600 animate-pulse rounded-full animation-delay-200"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="mt-3 flex flex-col flex-1 min-w-0">
        {/* Song Title */}
        <div className="flex items-center justify-center mb-2">
          <Link 
            to={`/songs/${song.id}`}
            className="group/link flex items-center gap-2 max-w-full"
          >
            <MdMusicNote className="text-orange-500 flex-shrink-0" />
            <h3 className="
              font-semibold text-white text-sm
              truncate group-hover/link:text-orange-300
              transition-colors duration-200
            ">
              {songInfo.title}
            </h3>
          </Link>
        </div>
        
        {/* Artist & Album Info */}
        <div className="flex justify-center items-center gap-4 mb-3">
          <Link
            to={songInfo.artistId ? `/artists/${songInfo.artistId}` : "/top-artists"}
            className="flex flex-col items-center gap-1 min-w-0 group/artist"
          >
            <BsFilePerson className="text-orange-500 flex-shrink-0" />
            <span className="
              text-xs text-gray-300 truncate max-w-[80px]
              group-hover/artist:text-white transition-colors
            ">
              {songInfo.artist}
            </span>
          </Link>
          
          {songInfo.album && (
            <Link
              to={songInfo.albumId ? `/albums/${songInfo.albumId}` : "/"}
              className="flex flex-col items-center gap-1 min-w-0 group/album"
            >
              <IoAlbumsOutline className="text-orange-500 flex-shrink-0" />
              <span className="
                text-xs text-gray-300 truncate max-w-[80px]
                group-hover/album:text-white transition-colors
              ">
                {songInfo.album}
              </span>
            </Link>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            {user && <Like song={song.id} user={user.id} />}
            {user && <Download song={song} user={user} />}
          </div>
          
          <div className="flex items-center gap-2">
            <Streams 
              song={song.id} 
              user={user?.id} 
              streams={streams}
              isLoading={isStreamFetching}
            />
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
              aria-label="Partager"
            >
              <SocialShare
                url={`https://diabara.tv/songs/${song.id}`}
                image={getImageUrl()}
                description={`${songInfo.title} par ${songInfo.artist}`}
                title={songInfo.title}
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
});

SongCard.displayName = "SongCard";

export default SongCard;