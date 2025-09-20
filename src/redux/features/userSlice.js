import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/auth';

const initialState = {
  currentUser: null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // Préférences utilisateur
  preferences: {
    theme: 'dark',
    language: 'fr',
    audioQuality: 'high',
    autoplay: true,
    downloadQuality: 'medium',
    explicitContent: true,
    notifications: {
      newReleases: true,
      recommendations: true,
      social: true,
      email: false,
    },
  },
  
  // Données utilisateur
  playlists: [],
  favoriteArtists: [],
  favoriteSongs: [],
  recentlyPlayed: [],
  listeningHistory: [],
  
  // Statistiques
  stats: {
    totalListeningTime: 0,
    totalSongs: 0,
    favoriteGenres: [],
    streakDays: 0,
  },
  
  // Abonnement
  subscription: {
    type: 'free', // 'free', 'premium', 'family'
    isActive: false,
    expiresAt: null,
    features: [],
  },
  
  // Social
  following: [],
  followers: [],
  
  // Session
  lastActivity: null,
  sessionId: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Authentification
    setCredentials: (state, action) => {
      const { user, jwt } = action.payload;
      state.currentUser = user;
      state.token = jwt;
      state.isAuthenticated = true;
      state.error = null;
      state.sessionId = `session-${Date.now()}`;
      state.lastActivity = new Date().toISOString();
      
      // Stocker le token
      if (jwt) {
        localStorage.setItem('authToken', jwt);
      }
    },
    
    logOut: (state) => {
      localStorage.removeItem('authToken');
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.playlists = [];
      state.favoriteArtists = [];
      state.favoriteSongs = [];
      state.recentlyPlayed = [];
      state.sessionId = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Gestion des préférences
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    setTheme: (state, action) => {
      state.preferences.theme = action.payload;
    },
    
    setLanguage: (state, action) => {
      state.preferences.language = action.payload;
    },
    
    setAudioQuality: (state, action) => {
      state.preferences.audioQuality = action.payload;
    },
    
    toggleAutoplay: (state) => {
      state.preferences.autoplay = !state.preferences.autoplay;
    },
    
    updateNotificationSettings: (state, action) => {
      state.preferences.notifications = { 
        ...state.preferences.notifications, 
        ...action.payload 
      };
    },
    
    // Gestion des favoris
    addToFavorites: (state, action) => {
      const song = action.payload;
      const exists = state.favoriteSongs.find(s => s.id === song.id);
      if (!exists) {
        state.favoriteSongs.unshift(song);
      }
    },
    
    removeFromFavorites: (state, action) => {
      const songId = action.payload;
      state.favoriteSongs = state.favoriteSongs.filter(s => s.id !== songId);
    },
    
    // Gestion des artistes favoris
    followArtist: (state, action) => {
      const artist = action.payload;
      const exists = state.favoriteArtists.find(a => a.id === artist.id);
      if (!exists) {
        state.favoriteArtists.push(artist);
      }
    },
    
    unfollowArtist: (state, action) => {
      const artistId = action.payload;
      state.favoriteArtists = state.favoriteArtists.filter(a => a.id !== artistId);
    },
    
    // Gestion des playlists
    addPlaylist: (state, action) => {
      state.playlists.unshift(action.payload);
    },
    
    updatePlaylist: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.playlists.findIndex(p => p.id === id);
      if (index !== -1) {
        state.playlists[index] = { ...state.playlists[index], ...updates };
      }
    },
    
    removePlaylist: (state, action) => {
      const playlistId = action.payload;
      state.playlists = state.playlists.filter(p => p.id !== playlistId);
    },
    
    // Historique d'écoute
    addToRecentlyPlayed: (state, action) => {
      const song = { ...action.payload, playedAt: new Date().toISOString() };
      
      // Supprimer si déjà présent
      state.recentlyPlayed = state.recentlyPlayed.filter(s => s.id !== song.id);
      
      // Ajouter en premier
      state.recentlyPlayed.unshift(song);
      
      // Limiter à 50 éléments
      if (state.recentlyPlayed.length > 50) {
        state.recentlyPlayed = state.recentlyPlayed.slice(0, 50);
      }
    },
    
    addToListeningHistory: (state, action) => {
      const { song, duration, completionRate } = action.payload;
      const historyItem = {
        id: `${song.id}-${Date.now()}`,
        song,
        playedAt: new Date().toISOString(),
        duration,
        completionRate: completionRate || 0,
      };
      
      state.listeningHistory.unshift(historyItem);
      
      // Limiter à 1000 éléments
      if (state.listeningHistory.length > 1000) {
        state.listeningHistory = state.listeningHistory.slice(0, 1000);
      }
    },
    
    // Statistiques
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    
    incrementListeningTime: (state, action) => {
      state.stats.totalListeningTime += action.payload || 0;
    },
    
    // Abonnement
    updateSubscription: (state, action) => {
      state.subscription = { ...state.subscription, ...action.payload };
    },
    
    // Social
    addFollowing: (state, action) => {
      const user = action.payload;
      const exists = state.following.find(u => u.id === user.id);
      if (!exists) {
        state.following.push(user);
      }
    },
    
    removeFollowing: (state, action) => {
      const userId = action.payload;
      state.following = state.following.filter(u => u.id !== userId);
    },
    
    // Session
    startSession: (state) => {
      state.sessionId = `session-${Date.now()}`;
      state.lastActivity = new Date().toISOString();
    },
    
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },
    
    // Réinitialisation
    resetUserData: (state) => {
      state.playlists = [];
      state.favoriteArtists = [];
      state.favoriteSongs = [];
      state.recentlyPlayed = [];
      state.listeningHistory = [];
      state.stats = initialState.stats;
    },
  },
  
  extraReducers: (builder) => {
    // Gestion des actions du authApi
    builder
      // Login
      .addMatcher(
        authApi.endpoints.login.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          const { user, jwt } = action.payload;
          state.currentUser = user;
          state.token = jwt;
          state.isAuthenticated = true;
          state.error = null;
          state.sessionId = `session-${Date.now()}`;
          state.lastActivity = new Date().toISOString();
          
          if (jwt) {
            localStorage.setItem('authToken', jwt);
          }
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || 'Erreur de connexion';
          state.isAuthenticated = false;
        }
      )
      // Register
      .addMatcher(
        authApi.endpoints.register.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          const { user, jwt } = action.payload;
          state.currentUser = user;
          state.token = jwt;
          state.isAuthenticated = true;
          state.error = null;
          state.sessionId = `session-${Date.now()}`;
          state.lastActivity = new Date().toISOString();
          
          if (jwt) {
            localStorage.setItem('authToken', jwt);
          }
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || 'Erreur lors de l\'inscription';
        }
      )
      // GetMe
      .addMatcher(
        authApi.endpoints.getMe.matchPending,
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        authApi.endpoints.getMe.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.currentUser = action.payload;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.getMe.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message;
          state.isAuthenticated = false;
          state.token = null;
          localStorage.removeItem('authToken');
        }
      );
  },
});

export const {
  setCredentials,
  logOut,
  clearError,
  setError,
  setLoading,
  updatePreferences,
  setTheme,
  setLanguage,
  setAudioQuality,
  toggleAutoplay,
  updateNotificationSettings,
  addToFavorites,
  removeFromFavorites,
  followArtist,
  unfollowArtist,
  addPlaylist,
  updatePlaylist,
  removePlaylist,
  addToRecentlyPlayed,
  addToListeningHistory,
  updateStats,
  incrementListeningTime,
  updateSubscription,
  addFollowing,
  removeFollowing,
  startSession,
  updateLastActivity,
  resetUserData,
} = userSlice.actions;

export default userSlice.reducer;

// Sélecteurs
export const selectUser = (state) => state.user.currentUser;
export const selectToken = (state) => state.user.token;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserPreferences = (state) => state.user.preferences;
export const selectFavoriteSongs = (state) => state.user.favoriteSongs;
export const selectFavoriteArtists = (state) => state.user.favoriteArtists;
export const selectUserPlaylists = (state) => state.user.playlists;
export const selectRecentlyPlayed = (state) => state.user.recentlyPlayed;
export const selectUserStats = (state) => state.user.stats;
export const selectSubscription = (state) => state.user.subscription;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;

// Sélecteurs composés
export const selectIsPremium = (state) => 
  state.user.subscription.type !== 'free' && state.user.subscription.isActive;

export const selectCanDownload = (state) => 
  selectIsPremium(state) || state.user.subscription.features.includes('download');

export const selectIsFollowingArtist = (artistId) => (state) =>
  state.user.favoriteArtists.some(artist => artist.id === artistId);

export const selectIsFavoriteSong = (songId) => (state) =>
  state.user.favoriteSongs.some(song => song.id === songId);