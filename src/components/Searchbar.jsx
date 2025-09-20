import React, { useState, useRef, useEffect } from 'react';
import { useDebounceSearch } from '../hooks/useDebounceSearch';
import { useNavigate } from 'react-router-dom';
import { 
  useGetSongByNameQuery,    // Import corrigé
  useGetSongsBySearchQuery  // Import corrigé
} from '../redux/services/songsApi';

const Searchbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    error,
    hasResults,
    clearSearch,
  } = useDebounceSearch();

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !searchRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ouvrir le dropdown quand il y a des résultats
  useEffect(() => {
    if (hasResults || isLoading) {
      setIsOpen(true);
    }
  }, [hasResults, isLoading]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length === 0) {
      setIsOpen(false);
    }
  };

  const handleSongSelect = (song) => {
    navigate(`/songs/${song.id}`);
    setIsOpen(false);
    clearSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      searchRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Input de recherche */}
      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher des chansons, artistes..."
          className="w-full px-4 py-3 pl-12 pr-10 text-gray-900 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
        />
        
        {/* Icône de recherche */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Bouton de nettoyage */}
        {searchTerm && (
          <button
            onClick={() => {
              clearSearch();
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown des résultats */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-96 overflow-hidden"
        >
          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Recherche en cours...</span>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="p-4 text-center text-red-600">
              <p>Erreur lors de la recherche</p>
              <button 
                onClick={() => setSearchTerm(searchTerm)} 
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Résultats */}
          {hasResults && !isLoading && (
            <div className="max-h-80 overflow-y-auto">
              {results.slice(0, 10).map((song, index) => (
                <SearchResultItem
                  key={song.id}
                  song={song}
                  onSelect={handleSongSelect}
                  isLast={index === Math.min(results.length - 1, 9)}
                />
              ))}
              
              {/* Afficher plus de résultats */}
              {results.length > 10 && (
                <div className="p-3 text-center border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/search?q=${encodeURIComponent(searchTerm)}`)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Voir tous les {results.length} résultats
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Aucun résultat */}
          {!hasResults && !isLoading && !error && searchTerm.length >= 2 && (
            <div className="p-8 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.9-6.113-2.5A7.962 7.962 0 014 9c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
              </svg>
              <p>Aucun résultat pour "{searchTerm}"</p>
              <p className="text-sm mt-1">Essayez avec d'autres mots-clés</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Composant pour chaque résultat de recherche
const SearchResultItem = ({ song, onSelect, isLast }) => (
  <div
    onClick={() => onSelect(song)}
    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
      !isLast ? 'border-b border-gray-100' : ''
    }`}
  >
    <img
      src={song.image || '/default-album.jpg'}
      alt={song.title}
      className="w-12 h-12 rounded-lg object-cover mr-3 flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900 truncate">{song.title}</p>
      <p className="text-sm text-gray-500 truncate">{song.artist}</p>
    </div>
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </div>
);

export default Searchbar;