import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 75,
  queue: [],
  currentIndex: 0,
  shuffle: false,
  repeat: 'off', // 'off', 'all', 'one'
  isLoading: false,
  error: null,
  genreListId: '', // Ajout pour compatibilité
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    playPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    
    play: (state) => {
      state.isPlaying = true;
    },
    
    pause: (state) => {
      state.isPlaying = false;
    },
    
    nextSong: (state) => {
      if (state.queue.length === 0) return;
      
      let nextIndex;
      if (state.shuffle) {
        // Mode aléatoire
        nextIndex = Math.floor(Math.random() * state.queue.length);
      } else {
        // Mode séquentiel
        nextIndex = (state.currentIndex + 1) % state.queue.length;
      }
      
      state.currentIndex = nextIndex;
      state.currentSong = state.queue[nextIndex];
      state.currentTime = 0;
    },
    
    prevSong: (state) => {
      if (state.queue.length === 0) return;
      
      let prevIndex;
      if (state.shuffle) {
        prevIndex = Math.floor(Math.random() * state.queue.length);
      } else {
        prevIndex = state.currentIndex === 0 
          ? state.queue.length - 1 
          : state.currentIndex - 1;
      }
      
      state.currentIndex = prevIndex;
      state.currentSong = state.queue[prevIndex];
      state.currentTime = 0;
    },
    
    setQueue: (state, action) => {
      state.queue = action.payload.songs || [];
      state.currentIndex = action.payload.startIndex || 0;
      if (state.queue.length > 0) {
        state.currentSong = state.queue[state.currentIndex];
      }
    },
    
    addToQueue: (state, action) => {
      const song = action.payload;
      if (!state.queue.find(s => s.id === song.id)) {
        state.queue.push(song);
      }
    },
    
    removeFromQueue: (state, action) => {
      const songId = action.payload;
      const index = state.queue.findIndex(s => s.id === songId);
      
      if (index !== -1) {
        state.queue.splice(index, 1);
        
        // Ajuster l'index actuel si nécessaire
        if (index < state.currentIndex) {
          state.currentIndex--;
        } else if (index === state.currentIndex) {
          // Si on supprime la chanson actuelle
          if (state.queue.length > 0) {
            state.currentIndex = Math.min(state.currentIndex, state.queue.length - 1);
            state.currentSong = state.queue[state.currentIndex];
          } else {
            state.currentSong = null;
            state.currentIndex = 0;
          }
        }
      }
    },
    
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    
    setVolume: (state, action) => {
      state.volume = Math.max(0, Math.min(100, action.payload));
    },
    
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    
    setRepeat: (state, action) => {
      const modes = ['off', 'all', 'one'];
      const currentIndex = modes.indexOf(state.repeat);
      const nextIndex = action.payload !== undefined 
        ? modes.indexOf(action.payload)
        : (currentIndex + 1) % modes.length;
      
      state.repeat = modes[nextIndex] || 'off';
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Action pour jouer une chanson spécifique
    playSong: (state, action) => {
      const { song, queue = [], startIndex = 0 } = action.payload;
      
      state.currentSong = song;
      state.queue = queue.length > 0 ? queue : [song];
      state.currentIndex = startIndex;
      state.currentTime = 0;
      state.isPlaying = true;
      state.isLoading = true;
      state.error = null;
    },

    // Nouveau: pour la compatibilité avec Discover.jsx
    selectGenreListId: (state, action) => {
      state.genreListId = action.payload;
    },
    
    // Reset complet du player
    resetPlayer: () => initialState,
  },
});

export const {
  setCurrentSong,
  playPause,
  play,
  pause,
  nextSong,
  prevSong,
  setQueue,
  addToQueue,
  removeFromQueue,
  setCurrentTime,
  setDuration,
  setVolume,
  toggleShuffle,
  setRepeat,
  setLoading,
  setError,
  clearError,
  playSong,
 
  resetPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;

// Sélecteurs
export const selectCurrentSong = (state) => state.player.currentSong;
export const selectIsPlaying = (state) => state.player.isPlaying;
export const selectQueue = (state) => state.player.queue;
export const selectPlayerState = (state) => state.player;
export const selectGenreListId = (state) => state.player.genreListId; // Nouveau sélecteur