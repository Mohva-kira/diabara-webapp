import React, { useEffect, useState } from "react";
import { SongCard } from "../components";
import { useGetLikesQuery } from "../redux/services/like";
import { useSelector } from "react-redux";
import { useGetStreamsQuery } from "../redux/services/streams";
import Streams from "./../components/Streams";
import { useGetSongsQuery } from "../redux/services/songsApi";

const Favourites = () => {
  const { data: likes, isLoading, isFetching, refetch } = useGetLikesQuery();
  const {
    data: streamsData,
    isSuccess: isStreamSuccess,
    isFetching: isStreamFetching,
    isError: isStreamError,
    refetch: refetchStreams,
  } = useGetStreamsQuery("");
  const {
    data,
    isSuccess,
    isFetching: isFetchingSongs,
    error,
  } = useGetSongsQuery();

  const { activeSong, isPlaying, genreListId } = useSelector(
    (state) => state.player
  );

  const [activeFilter, setActiveFilter] = useState('tous');
const [filteredSongs, setFilteredSongs] = useState([]);

const filterOptions = [
  { id: 'tous', label: 'Tous', icon: '🎵' },
  { id: 'aujoudhui', label: 'Ajourd\'hui', icon: '🕒' },
  { id: 'hier', label: 'Hier', icon: '🕒' },
  { id: 'semaine', label: '1 semaine', icon: '🕒' },
  // { id: 'populaire', label: 'Populaires', icon: '🔥' },
  // { id: 'artiste', label: 'Par Artiste', icon: '👨‍🎤' },
  
  // { id: 'duree', label: 'Durée', icon: '⏱️' }
];

const songsData =
  likes &&
  data &&
  data?.data.filter((item, index) =>
    likes?.data.find((song) => song.attributes.song.data.id === item.id)
  );

// Fonction de filtrage dynamique
const applyFilter = (filterType, songs) => {
  if (!songs) return [];
  
  switch (filterType) {
    
    case 'aujourdhui':
      const today = new Date();
      return songs.filter(song => {
        const songDate = new Date(song.attributes.createdAt);
        return songDate.toDateString() === today.toDateString();
      });
    case 'hier':
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return songs.filter(song => {
        const songDate = new Date(song.attributes.createdAt);
        return songDate.toDateString() === yesterday.toDateString();
      });

    case 'semaine':
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return songs.filter(song => new Date(song.attributes.createdAt) >= oneWeekAgo);

    case 'populaire':
      return songs.sort((a, b) => (b.attributes.views || 0) - (a.attributes.views || 0));
    case 'artiste':
      return songs.sort((a, b) => 
        (a.attributes.artist || '').localeCompare(b.attributes.artist || '')
      );
    case 'genre':
      return songs.sort((a, b) => 
        (a.attributes.genre || '').localeCompare(b.attributes.genre?.data?.attributes?.name || '')
      );
    case 'duree':
      return songs.sort((a, b) => (a.attributes.duration || 0) - (b.attributes.duration || 0));
    default:
      return songs;
  }
};

// Effet pour mettre à jour les chansons filtrées
useEffect(() => {
  const filtered = applyFilter(activeFilter, songsData);
  setFilteredSongs(filtered);
}, [activeFilter, songsData]);


  //   const isLiked = likes?.data.find(
  //     (like) =>
  //       like?.attributes?.user?.data?.id === 1 &&
  //       like?.attributes?.song?.data.id === song
  //   );


  

  return (
    <div>
      
      <div className="w-full m-2 p-2 h-full flex flex-wrap gap-10 sm:flex-col rounded-2xl  text-white shadow-xl bg-gradient-to-b bg-gradient-to-tr bg-blue-700 mb-16">
       
      <div className="w-full m-2 p-4 rounded-2xl shadow-2xl bg-gradient-to-r from-blue-800 via-purple-700 to-blue-900 mb-6">
      <h3 className="text-white text-lg font-bold mb-4 text-center">
        Filtrer vos favoris
      </h3>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
              px-4 py-2 rounded-xl font-semibold transition-all duration-300 
              shadow-lg hover:shadow-xl transform hover:scale-105
              flex items-center gap-2 min-w-[120px] justify-center
              ${activeFilter === filter.id 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/50' 
                : 'bg-gradient-to-r from-slate-600 to-slate-700 text-gray-200 hover:from-slate-500 hover:to-slate-600'
              }
            `}
          >
            <span className="text-sm">{filter.icon}</span>
            <span className="text-sm">{filter.label}</span>
          </button>
        ))}
      </div>
      
      {/* Compteur de résultats */}
      <div className="text-center mt-4">
        <span className="text-white/80 text-sm">
          {filteredSongs?.length || 0} chanson{(filteredSongs?.length || 0) > 1 ? 's' : ''} trouvée{(filteredSongs?.length || 0) > 1 ? 's' : ''}
        </span>
      </div>
    </div>

    {/* Section principale existante */}
    <div className="w-[1/2] m-2 p-2 h-full flex flex-wrap gap-10 sm:flex-col rounded-2xl text-white shadow-xl bg-gradient-to-b bg-gradient-to-tr bg-blue-700 mb-16">
      <div className="flex flex-col space-y-4 items-center justify-center w-full">
        {/* Affichage conditionnel basé sur le filtre actif */}
        {activeFilter !== 'tous' && (
          <div className="w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-3 mb-4">
            <p className="text-center text-white/90 text-sm">
              Filtré par : <span className="font-bold text-orange-400">{filterOptions.find(f => f.id === activeFilter)?.label}</span>
            </p>
          </div>
        )}
        
        {/* Ici vous pouvez mapper filteredSongs au lieu de songsData */}
        {filteredSongs && filteredSongs.length > 0 ? (
          filteredSongs.map((song, index) => (
            // Votre composant SongCard existant
            <div key={song.id || index} className="song-item">
              {/* Utilisez song au lieu de item */}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="bg-gradient-to-r from-gray-600/20 to-gray-700/20 rounded-xl p-6">
              <p className="text-white/70">Aucune chanson trouvée pour ce filtre</p>
            </div>
          </div>
        )}
      </div>
      </div>


      </div>

      <div className="flex flex-wrap  justify-center gap-8">
        {filteredSongs?.map((song, i) => (
          <SongCard
            key={song?.id}
            song={song}
            i={i}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={likes?.data && likes.data}
            streams={streamsData?.data.filter(
              (item) => item.attributes.song.data.id === song?.id
            )}
            streamsRefetch={refetch}
          />
        ))}
      </div>
    </div>
  );
};

export default Favourites;
