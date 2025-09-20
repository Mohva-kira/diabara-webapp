import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// Correction des imports Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";

// Import des styles Swiper
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

// Redux
import { playSong, selectCurrentSong, selectIsPlaying } from "../redux/features/playerSlice";
import { selectUser, addToRecentlyPlayed } from "../redux/features/userSlice";
import { useGetSongsQuery } from "../redux/services/songsApi";
import { useGetArtistsQuery } from "../redux/services/artistApi";

// Components
import PlayPause from "./PlayPause";
import Loader from "./Loader";

// Database
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";

// Assets
import pub from "../assets/himra.jpeg";



const API_FILE_URL = import.meta.env.VITE_API_FILE_URL;
const { onLine } = window.navigator;

// Composant pour une carte de top chart optimisé
const TopChartCard = React.memo(({
  song,
  index,
  isPlaying,
  currentSong,
  onPause,
  onPlay,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const isCurrentSong = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;
  
  // Optimisation de l'URL d'image
  const imageUrl = useMemo(() => {
    if (!onLine) return song.attributes?.cover;
    
    const coverData = song?.attributes?.cover?.data?.[0]?.attributes;
    if (!coverData) return "/placeholder-album.png";
    
    const formatUrl = coverData.formats?.thumbnail?.url || coverData.formats?.small?.url;
    return formatUrl ? `${API_FILE_URL}${formatUrl}` : `${API_FILE_URL}${coverData.url}`;
  }, [song.attributes?.cover, onLine]);
  
  const songInfo = useMemo(() => ({
    title: song?.attributes?.name || "Titre inconnu",
    artist: song?.attributes?.artist?.data?.attributes?.name || "Artiste inconnu",
    artistId: song?.attributes?.artist?.data?.id,
  }), [song]);
  
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);
  
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);
  
  return (
    <div className="
      w-full flex flex-row items-center 
      hover:bg-white/10 active:bg-white/5
      py-3 px-4 rounded-xl cursor-pointer mb-2
      transition-all duration-300 ease-in-out
      group border border-transparent hover:border-white/20
    ">
      {/* Numéro de classement */}
      <div className="flex items-center justify-center min-w-[2rem] mr-4">
        <span className={`
          font-bold text-lg transition-colors duration-200
          ${isCurrentSong ? 'text-orange-500' : 'text-white group-hover:text-orange-300'}
        `}>
          {index + 1}.
        </span>
      </div>
      
      {/* Image avec état de chargement */}
      <div className="relative w-16 h-16 mr-4 flex-shrink-0">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <img
          src={imageUrl}
          alt={`${songInfo.title} cover`}
          className={`
            w-full h-full object-cover rounded-lg
            transition-all duration-300
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            ${isCurrentSong ? 'ring-2 ring-orange-500 scale-105' : 'group-hover:scale-105'}
          `}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Indicateur de lecture */}
        {isCurrentlyPlaying && (
          <div className="absolute -top-1 -right-1">
            <div className="flex space-x-0.5">
              <div className="w-1 h-3 bg-orange-500 animate-pulse rounded-full"></div>
              <div className="w-1 h-2 bg-orange-400 animate-pulse rounded-full animation-delay-100"></div>
              <div className="w-1 h-4 bg-orange-600 animate-pulse rounded-full animation-delay-200"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Informations de la chanson */}
      <div className="flex-1 flex flex-col justify-center min-w-0 mr-3">
        <Link 
          to={`/songs/${song.id}`}
          className="group/title"
        >
          <p className={`
            text-base font-semibold truncate transition-colors duration-200
            ${isCurrentSong ? 'text-orange-500' : 'text-white group-hover/title:text-orange-300'}
          `}>
            {songInfo.title}
          </p>
        </Link>
        
        {songInfo.artistId && (
          <Link
            to={`/artists/${songInfo.artistId}`}
            className="group/artist"
          >
            <p className="
              text-sm text-gray-400 truncate mt-0.5
              group-hover/artist:text-gray-200 transition-colors duration-200
            ">
              {songInfo.artist}
            </p>
          </Link>
        )}
      </div>
      
      {/* Bouton Play/Pause */}
      <div className="flex-shrink-0">
        <PlayPause
          isPlaying={isCurrentlyPlaying}
          activeSong={currentSong}
          song={song}
          handlePause={onPause}
          handlePlay={() => onPlay(song, index)}
        />
      </div>
    </div>
  );
});

TopChartCard.displayName = "TopChartCard";

// Composant pour une carte d'artiste optimisé
const TopArtistCard = React.memo(({ artist, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = useMemo(() => {
    const imageData = artist?.attributes?.image?.data?.[0]?.attributes;
    if (!imageData) return "/placeholder-artist.png";
    
    const formatUrl = imageData.formats?.thumbnail?.url || imageData.formats?.small?.url;
    return formatUrl ? `${API_FILE_URL}${formatUrl}` : `${API_FILE_URL}${imageData.url}`;
  }, [artist?.attributes?.image]);
  
  const artistName = artist?.attributes?.name || "Artiste inconnu";
  
  return (
    <Link 
      to={`/artists/${artist?.id}`}
      className="
        group block w-20 h-20 rounded-full overflow-hidden
        transition-all duration-300 ease-in-out
        hover:scale-110 hover:shadow-xl
        ring-2 ring-transparent hover:ring-orange-500/50
      "
    >
      {!imageLoaded && !imageError && (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <img
        src={imageUrl}
        alt={artistName}
        className={`
          w-full h-full object-cover
          transition-all duration-300
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          group-hover:brightness-110
        `}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        loading="lazy"
      />
      
      {/* Overlay avec nom de l'artiste */}
      <div className="
        absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
        flex items-center justify-center
        transition-opacity duration-300
      ">
        <span className="text-white text-xs font-medium text-center px-2">
          {artistName}
        </span>
      </div>
    </Link>
  );
});

TopArtistCard.displayName = "TopArtistCard";

const TopPlay = () => {
  const dispatch = useDispatch();
  const currentSong = useSelector(selectCurrentSong);
  const isPlaying = useSelector(selectIsPlaying);
  const user = useSelector(selectUser);
  
  // Queries avec gestion d'erreur
  const { 
    data: songData, 
    isLoading: songsLoading, 
    error: songsError 
  } = useGetSongsQuery({ pageSize: 20 });
  
  const { 
    data: artistData, 
    isLoading: artistsLoading, 
    error: artistsError 
  } = useGetArtistsQuery({ pageSize: 10 });
  
  // IndexedDB pour le mode hors ligne
  const indexedSongs = useLiveQuery(() => db.songs.toArray());
  const indexedArtist = useLiveQuery(() => db.artists.toArray());
  
  const divRef = useRef(null);
  
  // Fonction pour synchroniser les artistes avec IndexedDB
  const syncArtistsToIndexedDB = useCallback(async (artists) => {
    try {
      const existingArtists = await db.artists.toArray();
      
      for (const artist of artists) {
        const exists = existingArtists.find(existing => existing.id === artist.id);
        if (!exists) {
          await db.artists.add({
            id: artist.id,
            ...artist.attributes,
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation des artistes:", error);
    }
  }, []);
  
  // Fonction pour synchroniser les chansons avec IndexedDB
  const syncSongsToIndexedDB = useCallback(async (songs) => {
    try {
      const existingSongs = await db.songs.toArray();
      
      for (const song of songs) {
        const exists = existingSongs.find(existing => existing.id === song.id);
        if (!exists) {
          await db.songs.add({
            id: song.id,
            ...song.attributes,
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation des chansons:", error);
    }
  }, []);
  
  // Synchronisation automatique
  useEffect(() => {
    if (onLine && artistData?.data && (!indexedArtist || indexedArtist.length === 0)) {
      syncArtistsToIndexedDB(artistData.data);
    }
  }, [artistData, indexedArtist, syncArtistsToIndexedDB]);
  
  useEffect(() => {
    if (onLine && songData?.data && (!indexedSongs || indexedSongs.length === 0)) {
      syncSongsToIndexedDB(songData.data);
    }
  }, [songData, indexedSongs, syncSongsToIndexedDB]);
  
  // Scroll automatique
  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  
  // Préparation des données optimisée
  const topSongs = useMemo(() => {
    const songs = onLine ? songData?.data : 
      indexedSongs?.map((item, index) => ({ id: item.id || index, attributes: item }));
    
    if (!songs) return [];
    
    return [...songs]
      .sort((a, b) => {
        // Tri par popularité (peut être amélioré avec de vrais métriques)
        const aStreams = a.attributes?.streams || 0;
        const bStreams = b.attributes?.streams || 0;
        return bStreams - aStreams;
      })
      .slice(0, 5);
  }, [songData?.data, indexedSongs, onLine]);
  
  const topArtists = useMemo(() => {
    const artists = onLine ? artistData?.data : indexedArtist;
    
    if (!artists) return [];
    
    return [...artists]
      .sort((a, b) => {
        // Tri par popularité
        const aFollowers = a.attributes?.followers || 0;
        const bFollowers = b.attributes?.followers || 0;
        return bFollowers - aFollowers;
      })
      .slice(0, 5);
  }, [artistData?.data, indexedArtist, onLine]);
  
  // Gestionnaires d'événements optimisés
  const handlePause = useCallback(() => {
    dispatch(playPause());
  }, [dispatch]);
  
  const handlePlay = useCallback((song, index) => {
    const songForPlayer = {
      id: song.id,
      title: song.attributes?.name || "Titre inconnu",
      artist: song.attributes?.artist?.data?.attributes?.name || "Artiste inconnu",
      image: onLine ? 
        `${API_FILE_URL}${song.attributes?.cover?.data?.[0]?.attributes?.url}` :
        song.attributes?.cover,
      preview: song.attributes?.preview_url,
      url: song.attributes?.audio_url || song.attributes?.url,
    };
    
    dispatch(playSong({
      song: songForPlayer,
      queue: topSongs.map(s => ({
        id: s.id,
        title: s.attributes?.name,
        artist: s.attributes?.artist?.data?.attributes?.name,
        image: onLine ? 
          `${API_FILE_URL}${s.attributes?.cover?.data?.[0]?.attributes?.url}` :
          s.attributes?.cover,
        preview: s.attributes?.preview_url,
        url: s.attributes?.audio_url || s.attributes?.url,
      })),
      startIndex: index,
    }));
    
    // Ajouter aux récents si utilisateur connecté
    if (user) {
      dispatch(addToRecentlyPlayed(songForPlayer));
    }
  }, [dispatch, topSongs, user, onLine]);
  
  // États de chargement et d'erreur
  if (songsLoading || artistsLoading) {
    return (
      <div className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[400px] w-screen px-2">
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      </div>
    );
  }
  
  if (songsError && artistsError && !onLine) {
    return (
      <div className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[400px] w-screen px-2">
        <div className="text-center text-gray-400 p-8">
          <p>Contenu indisponible hors ligne</p>
          <p className="text-sm mt-2">Connectez-vous pour voir le contenu</p>
        </div>
      </div>
    );
  }
  
  return (
    <div
      ref={divRef}
      className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[400px] w-screen px-2 flex flex-col space-y-8"
    >
      {/* Section Top Charts */}
      {topSongs.length > 0 && (
        <div className="w-full flex-col md:flex hidden">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-white font-bold text-xl md:text-2xl">
              Top Classements
            </h2>
            <Link 
              to="/top-charts"
              className="text-gray-300 text-sm md:text-base hover:text-white transition-colors cursor-pointer"
            >
              Voir plus
            </Link>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              freeMode={true}
              modules={[FreeMode]}
              className="w-full"
            >
              {topSongs.map((song, index) => (
                <SwiperSlide key={song.id}>
                  <TopChartCard
                    song={song}
                    index={index}
                    isPlaying={isPlaying}
                    currentSong={currentSong}
                    onPause={handlePause}
                    onPlay={handlePlay}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* Section Top Artists */}
      {topArtists.length > 0 && (
        <div className="w-full flex flex-col">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-white font-bold text-xl md:text-2xl">Top Artistes</h2>
            <Link 
              to="/top-artists"
              className="text-gray-300 text-sm md:text-base hover:text-white transition-colors cursor-pointer"
            >
              Voir plus
            </Link>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <Swiper
              slidesPerView="auto"
              spaceBetween={16}
              freeMode={true}
              centeredSlides={false}
              modules={[FreeMode]}
              className="w-full"
            >
              {topArtists.map((artist, index) => (
                <SwiperSlide
                  key={artist.id}
                  style={{ width: "80px" }}
                  className="!flex justify-center"
                >
                  <TopArtistCard artist={artist} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* Publicité */}
      <div className="lg:h-fit lg:w-full lg:block hidden">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <img 
            src={pub} 
            alt="Publicité" 
            className="object-cover rounded-xl w-full h-auto transition-transform duration-300 hover:scale-105" 
          />
        </div>
      </div>
    </div>
  );
};

export { TopChartCard };

export default TopPlay;