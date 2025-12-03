import React, { useEffect, useState, useRef} from "react";
import { Error, Loader, SongCard, SEO } from "../components";
import { genres } from "../assets/constants";
import { selectGenreListId, setActiveSong, playPause } from "../redux/features/playerSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetSongsQuery,
  useLazyGetPlayedByPageAndUserQuery,
  useLazyGetSongsQuery,
} from "../redux/services/songsApi";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";
// import { useLazyGetPlayedByPageAndUserQuery } from "../redux/services/played";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useGetPromotionQuery } from "../redux/services/promo";
import HeroSection from "../components/HeroSection";
import FeaturedCarousel from "../components/FeaturedCarousel";
import PopularPlaylists from "../components/PopularPlaylists";
import SwipePlayer from "../components/SwipePlayer";
import OnboardingPopup from "../components/OnboardingPopup";
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const indexedSongs = useLiveQuery(() => db.songs.toArray());  
  const indexedStreams = useLiveQuery(() => db.streamsData.toArray());
  const [firstVisitData, setFirstVisitData] = useState({});
  const [getPlayedByUser, { data: playedData }] =
    useLazyGetPlayedByPageAndUserQuery();  
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  // Vérifier si l'utilisateur est connecté
  const user = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : null;
  const isAuthenticated = !!user;

  const scrollContainerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
 
  // États pour la pagination infinie
  const [page, setPage] = useState(1);
  const [allSongs, setAllSongs] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data: promotionData, isLoading: promotionLoading } =
    useGetPromotionQuery();

  const { activeSong, isPlaying, genreListId } = useSelector(
    (state) => state.player
  );

  // États pour l'onboarding TikTok
  const [showSwipePlayer, setShowSwipePlayer] = useState(false);
  const [showOnboardingPopup, setShowOnboardingPopup] = useState(false);
  
  // Vérifier si c'est un nouvel utilisateur (première visite)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('diabara_has_seen_swipe_onboarding');
    const isFirstVisit = !hasSeenOnboarding && !isAuthenticated;
    
    if (isFirstVisit && allSongs.length > 0) {
      setShowSwipePlayer(true);
    }
  }, [allSongs.length, isAuthenticated]);

  // Détecter le premier play et afficher le popup
  useEffect(() => {
    const hasSeenFirstPlayPopup = localStorage.getItem('diabara_has_seen_first_play_popup');
    
    // Ne rien faire si le popup a déjà été vu
    if (hasSeenFirstPlayPopup) return;
    
    const isFirstPlay = isPlaying && activeSong?.id;
    
    if (isFirstPlay && !showOnboardingPopup) {
      // Attendre 2 secondes après le premier play
      const timer = setTimeout(() => {
        setShowOnboardingPopup(true);
        localStorage.setItem('diabara_has_seen_first_play_popup', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying, activeSong?.id, showOnboardingPopup]);

  const [getSongs, { data, isSuccess, isFetching, isLoading, error }] =
    useLazyGetSongsQuery();

  // Fonction pour charger plus de données
  const loadMore = async () => {
    if (isLoadingMore || !hasNextPage) return;

    setIsLoadingMore(true);

    try {
      // Utilisez votre API existante avec pagination
      const nextPage = page + 1;
      const response = await dispatch(
        // Adaptez selon votre structure d'API
        getSongs({
          page: nextPage,
          size: 20,
        })
      ).unwrap();

      if (response?.data?.length > 0) {
        setAllSongs((prev) => [...prev, ...response.data]);
        setPage(nextPage);

        // Vérifiez s'il y a plus de pages
        if (response.data.length < 20) {
          setHasNextPage(false);
        }
      } else {
        setHasNextPage(false);
      }
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };


  // Fonction pour gérer le scroll
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setScrollY(scrollTop);
      
      // Considérer comme "scrollé" après 50px
      setIsScrolled(scrollTop > 50);
    }
  };

  // Calculer la taille dynamique basée sur le scroll
  const getHeroSectionStyle = () => {
    const maxScroll = 200; // Distance de scroll maximale pour l'effet
    const minHeight = 300; // Hauteur minimale en pixels (augmentée pour garantir l'affichage)
    const maxHeight = 500; // Hauteur maximale en pixels
    
    // Calculer la progression du scroll (0 à 1)
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    // Calculer la hauteur en fonction du scroll
    const currentHeight = maxHeight - (scrollProgress * (maxHeight - minHeight));
    
    // Calculer l'opacité
    const opacity = Math.max(1 - (scrollProgress * 0.5), 0.5);
    
    return {
      height: `${Math.max(currentHeight, minHeight)}px`,
      minHeight: `${minHeight}px`,
      opacity: opacity,
      transition: 'height 0.3s ease-out, opacity 0.3s ease-out',
      overflow: 'hidden'
    };
  };




  // Configuration du hook d'infinite scroll
  const [sentryRef] = useInfiniteScroll({
    loading: isLoadingMore,
    hasNextPage: hasNextPage,
    onLoadMore: loadMore,
    disabled: Boolean(error),
    rootMargin: "0px 0px 100px 0px",
  });
  useEffect(() => {
    getSongs({
      page: 1,
      size: 21,
    });
  }, []);
  // Effet pour initialiser les données
  useEffect(() => {
    if (isSuccess && data?.data && page === 1) {
      setAllSongs(data.data);
      setHasNextPage(data.data.length >= 21);
    }
  }, [isSuccess, data, page]);

  if (isFetching && page === 1) return <Loader title="Chargement songs..." />;
  if (error) return <Error />;

  return (
    <>
      <SEO
        title="Discover - Diabara TV"
        description="Découvrez la meilleure musique africaine sur Diabara TV. Explorez nos playlists, artistes et chansons populaires."
        url="https://diabara.tv/"
      />
      
      {/* SwipePlayer pour l'onboarding TikTok */}
      {showSwipePlayer && (
        <SwipePlayer
          songs={allSongs.slice(0, 20)}
          onComplete={() => {
            setShowSwipePlayer(false);
            localStorage.setItem('diabara_has_seen_swipe_onboarding', 'true');
          }}
        />
      )}

      {/* Popup d'onboarding après le premier play */}
      {showOnboardingPopup && (
        <OnboardingPopup
          onClose={() => setShowOnboardingPopup(false)}
        />
      )}

    <div className="flex flex-col h-screen relative bg-gradient-to-b from-black via-black to-black overflow-hidden">
      {/* Header fixe - Discover et Filtres */}
      <div 
        className={`
          fixed z-40 
          flex items-center gap-3
          transition-all duration-300
          ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}
          top-6 left-6 sm:top-6 sm:left-auto sm:right-6
        `}
      >
        <h2 className="font-light text-lg text-orange-500 hidden sm:block tracking-wide drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">Discover</h2>
        <select
          onChange={(e) => dispatch(selectGenreListId(e.target.value))}
          value={genreListId || ""}
          className="
            bg-black/80 backdrop-blur-lg 
            text-white/90 
            px-3 py-2 sm:px-4 sm:py-2.5 
            text-xs sm:text-sm 
            rounded-lg 
            outline-none 
            border border-blue-500/40
            hover:border-orange-500/60
            hover:bg-black/90
            transition-all duration-300
            cursor-pointer
            font-light
            shadow-lg shadow-orange-500/10
            max-w-[140px] sm:max-w-none
          ">
          <option value="" className="bg-gray-900">Tous les genres</option>
          {genres.map((genre) => (
            <option key={genre.value} value={genre.value} className="bg-gray-900">
              {genre.title}
            </option>
          ))}
        </select>
      </div>

      {/* Conteneur scrollable principal */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden pb-32 pt-4 px-6 no-scrollbar"
        onScroll={handleScroll}
        onScrollCapture={handleScroll}
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Section pour utilisateurs non connectés - Mise en avant de la musique */}
        {!isAuthenticated && (
          <div className="w-full mb-8">
            {/* Carrousel autoplay de covers/artistes populaires */}
            <FeaturedCarousel />
            
            {/* Section CTA principale - Boutons très visibles */}
            <div className="
              w-full mb-8
              bg-gradient-to-r from-orange-500/20 via-orange-600/20 to-orange-500/20
              backdrop-blur-md
              rounded-3xl
              p-8 sm:p-12
              border-2 border-orange-500/30
              shadow-2xl shadow-orange-500/20
            ">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
                  🎵 La musique au bout des doigts
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Découvrez des milliers de chansons africaines. Écoutez gratuitement, créez votre compte pour sauvegarder vos favoris.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => {
                      // Jouer la première chanson disponible
                      if (allSongs.length > 0) {
                        dispatch(setActiveSong({ song: allSongs[0], data: allSongs, i: 0 }));
                        dispatch(playPause(true));
                      }
                    }}
                    className="
                      inline-flex items-center justify-center gap-3
                      bg-gradient-to-r from-orange-500 to-orange-600
                      hover:from-orange-600 hover:to-orange-700
                      text-white font-bold text-xl sm:text-2xl
                      px-10 py-5 rounded-full
                      shadow-2xl shadow-orange-500/50
                      transition-all duration-300
                      hover:scale-110 active:scale-95
                      border-4 border-orange-400/40
                      min-w-[280px]
                    "
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Écouter maintenant
                  </button>
                  
                  <button
                    onClick={() => navigate('/login')}
                    className="
                      inline-flex items-center justify-center gap-2
                      bg-white/10 backdrop-blur-md
                      hover:bg-white/20
                      text-white font-semibold text-lg sm:text-xl
                      px-8 py-5 rounded-full
                      border-2 border-white/40
                      transition-all duration-300
                      hover:scale-110 active:scale-95
                      min-w-[240px]
                    "
                  >
                    Créer un compte
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Playlists populaires avec gros boutons Play */}
            <PopularPlaylists />
          </div>
        )}

        {/* Section Hero pour utilisateurs connectés - Promotion */}
        {isAuthenticated && !isScrolled && (
          <div 
            ref={heroSectionRef}
            className="w-full mb-4 rounded-2xl transition-all duration-500 ease-in-out"
            style={getHeroSectionStyle()}
          >
            {promotionLoading && (
              <div className="w-full flex justify-center items-center" style={{ minHeight: '300px' }}>
                <Loader title="Loading promotions..." />
              </div>
            )}
            {
              promotionData?.data &&
              promotionData?.data.length === 0 && (
                <div className="w-full flex justify-center items-center text-gray-500" style={{ minHeight: '300px' }}>
                  Aucune promotion disponible pour le moment.
                </div>
              )}
            {
              promotionData?.data &&
              promotionData?.data.length > 0 && (
                <HeroSection
                  items={promotionData.data}
                  imageBaseUrl={import.meta.env.VITE_API_FILE_URL}
                />
              )}
          </div>
        )}

        {/* Liste des chansons avec infinite scroll */}
        <div 
          className="flex flex-wrap sm:justify-start justify-center gap-6"
        >
        {allSongs.map((song, i) => (
          <SongCard
            key={`${song.key || song.id}-${i}`}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={allSongs}
            i={i}
          />
        ))}

          {/* Sentry pour déclencher le chargement */}
          {(isLoadingMore || hasNextPage) && (
            <div
              ref={sentryRef}
              className="w-full flex justify-center py-4"
              style={{ minHeight: "1px" }}
            >
              {isLoadingMore && (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-white">Chargement...</span>
                </div>
              )}
            </div>
          )}

          {/* Message de fin */}
          {!hasNextPage && allSongs.length > 0 && (
            <div className="w-full text-center py-4 text-gray-400">
              Toutes les chansons ont été chargées
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Discover;
