import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { MdMusicNote } from "react-icons/md";
import { BsDownload, BsPlay } from "react-icons/bs";
import Loader from "./Loader";
import "./SongCard.css";
import { usePostDlMutation } from "../redux/services/dlservice";

const SearchResCard = (item, detail) => {
  const dispatch = useDispatch();
  const { thumbnails, title, channelTitle, publishTime } = item?.item?.snippet || {};
  const { id } = item?.item || {};
  console.log("item", item);
  const { videoId, kind } = id || {};
  const dlUrl = import.meta.env.VITE_DL_SERVER;
  
  const [imgLoading, setImgLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postDl] = usePostDlMutation();
  
  const [imageState, setImageState] = useState({
    loading: true,
    error: false,
    loaded: false,
  });

  const handleImageLoad = {
    onLoad: () => {
      setImageState({
        loading: false,
        error: false,
        loaded: true,
      });
      setImgLoading(false);
    },

    onError: () => {
      setImageState({
        loading: false,
        error: true,
        loaded: false,
      });
      setImgLoading(false);
    },

    onLoadStart: () => {
      setImageState({
        loading: true,
        error: false,
        loaded: false,
      });
      setImgLoading(true);
    },
  };

  // Helper pour obtenir la meilleure qualité d'image disponible
  const getImageSrc = (thumbnails) => {
    if (!thumbnails) return '/default-youtube-thumb.jpg';
    
    // Ordre de préférence : high > medium > default
    if (thumbnails.high?.url) return thumbnails.high.url;
    if (thumbnails.medium?.url) return thumbnails.medium.url;
    if (thumbnails.default?.url) return thumbnails.default.url;
    
    return '/default-youtube-thumb.jpg';
  };

  const handleDownload = async () => {
    if (!videoId || kind !== 'youtube#video') return;
    
    setIsLoading(true);
    try {
      const response = await postDl({
        url: `https://www.youtube.com/watch?v=${id}`,
        title: title,
        videoId: videoId,
      });
      
      if (response.data) {
        console.log('Download initiated:', response.data);
        // Logique pour gérer la réponse du téléchargement
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = () => {
    // Logique pour lire la vidéo
    if (videoId && kind === 'youtube#video') {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  return (
    <div className="search-result-card bg-gradient-to-b from-[#0f1724] to-[#0b1830] rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-white/5">
      <div className="flex gap-4">
        {/* Thumbnail avec gestion du chargement */}
        <div className="relative flex-shrink-0 w-32 h-20 md:w-40 md:h-24 rounded-lg overflow-hidden">
          {imageState.loading && (
            <div className="absolute inset-0 bg-gray-600 animate-pulse flex items-center justify-center">
              <Loader />
            </div>
          )}
          
          <img
            src={getImageSrc(thumbnails)}
            alt={title || 'YouTube thumbnail'}
            onLoad={handleImageLoad.onLoad}
            onError={handleImageLoad.onError}
            onLoadStart={handleImageLoad.onLoadStart}
            loading="lazy"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageState.loaded ? 'opacity-100' : 'opacity-0'
            } ${imageState.error ? 'hidden' : ''}`}
          />
          
          {imageState.error && (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Pas d'image</span>
            </div>
          )}
          
          {/* Badge pour le type de contenu */}
          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
            {kind === 'youtube#video' ? '📹' : kind === 'youtube#channel' ? '📺' : '🎵'}
          </div>

          {/* Overlay play sur hover */}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
               onClick={handlePlay}>
            <BsPlay className="text-white text-2xl" />
          </div>
        </div>
        
        {/* Informations */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="text-white font-semibold text-sm md:text-base truncate mb-2" title={title}>
            <MdMusicNote className="inline text-orange-500 mr-2" />
            {title}
          </h3>
          
          <p className="text-[#00e0ff] text-xs md:text-sm truncate mb-1" title={channelTitle}>
            {channelTitle}
          </p>
          
          {publishTime && (
            <p className="text-gray-400 text-xs mb-3">
              {new Date(publishTime).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          )}
          
          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            {kind === 'youtube#video' && (
              <button 
                className="flex items-center gap-2 text-xs bg-[#00e0ff] text-[#0f1724] px-3 py-2 rounded-lg hover:bg-[#00c4dd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDownload}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size="small" />
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <BsDownload />
                    Télécharger
                  </>
                )}
              </button>
            )}
            
            <button 
              className="flex items-center gap-2 text-xs bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
              onClick={handlePlay}
            >
              <BsPlay />
              {kind === 'youtube#video' ? 'Regarder' : 'Voir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResCard;