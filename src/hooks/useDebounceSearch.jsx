import { useState, useEffect, useMemo } from 'react';
import { useLazySearchSongsQuery } from '../redux/services/songsApi';

export const useDebounceSearch = (delay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [triggerSearch, { data, isLoading, error }] = useLazySearchSongsQuery();

  // Debounce du terme de recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  // Lancement de la recherche quand le terme débounced change
  useEffect(() => {
    if (debouncedTerm.length >= 2) {
      triggerSearch(debouncedTerm);
    }
  }, [debouncedTerm, triggerSearch]);

  // Résultats formatés
  const results = useMemo(() => {
    if (!data?.data) return [];
    
    return data.data.map(song => ({
      id: song.id,
      title: song.attributes.name,
      artist: song.attributes.artist?.data?.attributes?.name || 'Artiste inconnu',
      image: song.attributes.image?.data?.attributes?.url,
      preview: song.attributes.preview_url,
      url: song.attributes.audio_url,
    }));
  }, [data]);

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading: isLoading && debouncedTerm.length >= 2,
    error,
    hasResults: results.length > 0,
    clearSearch,
  };
};