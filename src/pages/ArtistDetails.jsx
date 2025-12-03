import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs, Gallery, SEO } from "../components";
import { motion } from "framer-motion";

import { selectCurrentToken, selectCurrentUser } from "../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../db/db";

import { 
  MdLocationOn, 
  MdMusicNote, 
  MdCalendarToday,
  MdVerified,
  MdShare,
  MdFavorite,
  MdPlayArrow,
  MdPause
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { GiWallet } from "react-icons/gi";
import { IoAlbums } from "react-icons/io5";
import { useGetArtistDetailsQuery } from "../redux/services/artistApi";
import { useEffect, useState } from "react";
import { useGetSongByArtistQuery, useGetSongByNameQuery } from "../redux/services/songsApi";


const ArtistDetails = () => {
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)
  const indexedSongs = useLiveQuery(() => db.songs.toArray());
  const indexedSongReverse = indexedSongs && indexedSongs;

  console.log('indexed', indexedSongReverse)
  const { activeSong, isPlaying } = useSelector(state => state.player)
  const [songs, setSongs] = useState()
  
  
  const { id: artistId } = useParams()
  const {data, isLoading, isFetching, isError} = useGetSongByArtistQuery(artistId)
  const  { data: songByArtistData}= useGetSongByNameQuery(artistId)

  const { data: artistData, isFetching: isFetchingArtistDetails, isError: error } = useGetArtistDetailsQuery(artistId)

  

  const navigate = useNavigate()
  useEffect(() => {
    setSongs(data?.data)
  }, [data])

  if (isFetchingArtistDetails) return <Loader title="Loading artist details" />
  if (error) return <Error />

  // Préparer les données SEO
  const artistName = artistData?.data?.attributes?.name || 'Artiste';
  const artistTitle = `${artistName} | Diabara TV`;
  const artistDescription = artistData?.data?.attributes?.Biographie 
    ? `${artistData.data.attributes.Biographie.substring(0, 200)}...`
    : `Découvrez ${artistName} sur Diabara TV. Artiste et musique au bout des doigts.`;
  // Formater l'URL de l'image pour Facebook
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://diabara.tv/logo.png';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `https://api.diabara.tv${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  };
  
  const artistImage = artistData?.data?.attributes?.image?.data?.[0]?.attributes?.formats?.small?.url 
    ? formatImageUrl(artistData.data.attributes.image.data[0].attributes.formats.small.url)
    : artistData?.data?.attributes?.image?.data?.[0]?.attributes?.url
      ? formatImageUrl(artistData.data.attributes.image.data[0].attributes.url)
      : 'https://diabara.tv/logo.png';
  const artistUrl = `https://diabara.tv/artists/${artistId}`;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const API_FILE_URL = import.meta.env.VITE_API_FILE_URL;
  const artistImageUrl = artistData?.data?.attributes?.image?.data?.[0]?.attributes?.url;

  return (
    <>
      <SEO
        title={artistTitle}
        description={artistDescription}
        image={artistImage}
        url={artistUrl}
        type="profile"
      />
      
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-black via-black to-black"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Hero Section */}
        <motion.div 
          className="relative h-96 overflow-hidden"
          variants={itemVariants}
        >
          {/* Background avec gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
          
          {/* Image de fond ou animation */}
          {artistImageUrl ? (
            <img 
              src={`${API_FILE_URL}${artistImageUrl}`}
              alt={artistName}
              className="w-full h-full object-cover opacity-30"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-900/20 to-orange-600/20 flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="text-orange-500/30 text-9xl"
              >
                <MdMusicNote />
              </motion.div>
            </div>
          )}
          
          {/* Contenu du header */}
          <div className="absolute inset-0 z-20 flex items-end p-8">
            <div className="flex items-end space-x-6">
              {/* Avatar de l'artiste */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {artistImageUrl ? (
                  <img 
                    src={`${API_FILE_URL}${artistImageUrl}`}
                    alt={artistName}
                    className="w-32 h-32 rounded-full border-4 border-orange-500 shadow-2xl object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-orange-500 shadow-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <MdMusicNote className="text-4xl text-white" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                  <MdVerified className="text-white text-xl" />
                </div>
              </motion.div>
              
              {/* Informations de l'artiste */}
              <div className="flex-1">
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold text-white mb-2"
                  variants={itemVariants}
                >
                  {artistName}
                </motion.h1>
                <motion.div 
                  className="flex items-center space-x-4 text-gray-300"
                  variants={itemVariants}
                >
                  <span className="flex items-center">
                    <MdMusicNote className="mr-1" />
                    Artiste vérifié
                  </span>
                  <span className="flex items-center">
                    <MdPlayArrow className="mr-1" />
                    {songs?.length || 0} titres
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions rapides */}
        <motion.div 
          className="px-8 py-6 border-b border-gray-800"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
            >
              <MdPlayArrow className="inline mr-2" />
              Lecture
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-gray-600 text-gray-300 px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300"
            >
              <MdFavorite className="inline mr-2" />
              Suivre
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-gray-600 text-gray-300 px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300"
            >
              <MdShare className="inline mr-2" />
              Partager
            </motion.button>
          </div>
        </motion.div>

        {/* Contenu principal */}
        <div className="px-8 py-8 space-y-12">
          {/* Biographie */}
          {artistData?.data.attributes.Biographie && (
            <motion.div 
              className="max-w-4xl"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold text-white mb-4">À propos</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {artistData.data.attributes.Biographie}
              </p>
            </motion.div>
          )}

          {/* Statistiques */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-br from-black/50 to-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-orange-500">{songs?.length || 0}</div>
              <div className="text-gray-400">Titres</div>
            </div>
            <div className="bg-gradient-to-br from-black/50 to-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-orange-500">1.2M</div>
              <div className="text-gray-400">Écoutes</div>
            </div>
            <div className="bg-gradient-to-br from-black/50 to-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-orange-500">45K</div>
              <div className="text-gray-400">Followers</div>
            </div>
            <div className="bg-gradient-to-br from-black/50 to-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-orange-500">12</div>
              <div className="text-gray-400">Albums</div>
            </div>
          </motion.div>

          {/* Chansons populaires */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-6">Titres populaires</h2>
            <RelatedSongs
              data={songs}
              isPlaying={isPlaying}
              activeSong={activeSong}
              artistId={artistId}
            />
          </motion.div>

          {/* Galerie */}
          {artistData?.data.attributes.image?.data && (
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-white mb-6">Galerie</h2>
              <Gallery data={artistData.data.attributes.image.data} artist={artistData} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  )
};

export default ArtistDetails;
