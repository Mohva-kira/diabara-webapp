import React, { useEffect, useState, useRef} from "react";
import { Error, Loader, SongCard } from "../components";
import { genres } from "../assets/constants";
import { selectGenreListId } from "../redux/features/playerSlice";
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

const Discover = () => {
  const dispatch = useDispatch();
  const indexedSongs = useLiveQuery(() => db.songs.toArray());
  const indexedStreams = useLiveQuery(() => db.streamsData.toArray());
  const [firstVisitData, setFirstVisitData] = useState({});
  const [getPlayedByUser, { data: playedData }] =
    useLazyGetPlayedByPageAndUserQuery();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");


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
    const minHeight = 100; // Hauteur minimale en pixels
    const maxHeight = 400; // Hauteur maximale en pixels
    
    // Calculer la progression du scroll (0 à 1)
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    // Calculer la hauteur en fonction du scroll
    const currentHeight = maxHeight - (scrollProgress * (maxHeight - minHeight));
    
    // Calculer l'opacité
    const opacity = Math.max(1 - (scrollProgress * 0.5), 0.3);
    
    return {
      height: `${currentHeight}px`,
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
    <div className="flex flex-col h-screen">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">Discover</h2>
        <select
          onChange={(e) => dispatch(selectGenreListId(e.target.value))}
          value={genreListId || ""}
          className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mt-0 mt-5">
          {genres.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.title}
            </option>
          ))}
        </select>
      </div> 

      {/* Section Hero avec taille dynamique */}
      <div 
        ref={heroSectionRef}
        className={`w-full mb-2 px-6 rounded-2xl flex justify-center items-center ${
          isScrolled ? 'shadow-lg  hidden' : ''
        }`}
        style={getHeroSectionStyle()}
      >
        {promotionLoading && <Loader title="Loading promotions..." />}
        {!promotionLoading &&
          promotionData &&
          promotionData.data &&
          promotionData.data.length === 0 && (
            <div className="text-gray-500">
              Aucune promotion disponible pour le moment.
            </div>
          )}
        {!promotionLoading &&
          promotionData &&
          promotionData.data &&
          promotionData.data.length > 0 && (
            <div className={`transform w-full h-full transition-transform duration-300 ${
              isScrolled ? 'scale-90' : 'scale-100'
            }`}>
              <HeroSection
                items={promotionData.data}
                imageBaseUrl={import.meta.env.VITE_API_FILE_URL}
              />
            </div>
          )}
      </div>

      {/* Liste des chansons avec infinite scroll */}
      <div 
        ref={scrollContainerRef}
        className="flex flex-wrap h-full  sm:justify-start overflow-scroll no-scrollbar pb-20  justify-center gap-8 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300"
        onScroll={handleScroll}
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
  );
};

export default Discover;
