import { configureStore, combineReducers } from "@reduxjs/toolkit";

import playerReducer from "./features/playerSlice";
import { songsApi } from "./services/songsApi";
import songsReducer from "./features/songsSlice"
import { authApi } from "./services/auth";
import authReducer from "./features/auth/authSlice";
import { artistsApi } from "./services/artistApi";
import { likeApi } from "./services/like";
import { playlistApi } from "./services/playlist";
import { playlistSongApi } from "./services/playlistSong";
import  { streamsApi } from "./services/streams";
import streamsReducer from "./services/streams";
import orderReducer from './features/orderSlice'
import promotionReducer,{ promotionsApi } from "./services/promo";
import dlReducer, { dlApi } from "./services/dlservice";
//Persistance 

import { persistStore, persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
 } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Choose your storage engin

import downloadsReducer, { downloadsApi } from "./services/download";
import albumsReducer, { albumsApi } from "./services/albums";
import genresReducer, { genresApi } from "./services/genres";
import visitorsReducer, { visitorApi } from "./services/visitor";
import favoritesReducer,{ favoritesApi } from './services/favorites';
import typeSubscriptionReducer, { subscriptionApi, typeSubscriptionApi } from './services/subscription';
import subscriptionReducer from './features/subscriptionSlice'

 

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  // Specify the reducers you want to persist
  // whitelist: ['songs'], // In this example, we persist the 'user' reducer
};

const reducer = combineReducers({
  player: playerReducer,
    auth: authReducer,
    songs: songsReducer,
    streams: streamsReducer,
    downloads: downloadsReducer,
    albums: albumsReducer,
    genres: genresReducer,
    visitors: visitorsReducer,
    promotions: promotionReducer,
    favorites: favoritesReducer,
    typeSubscription: typeSubscriptionReducer,
    order: orderReducer,
    subs: subscriptionReducer,
    dl: dlReducer,
    [songsApi.reducerPath]: songsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [artistsApi.reducerPath]: artistsApi.reducer,
    [likeApi.reducerPath]: likeApi.reducer,
    [playlistApi.reducerPath]: playlistApi.reducer,
    [playlistSongApi.reducerPath]: playlistSongApi.reducer,
    [streamsApi.reducerPath]: streamsApi.reducer,
    [downloadsApi.reducerPath]: downloadsApi.reducer,
    [albumsApi.reducerPath]: albumsApi.reducer,
    [genresApi.reducerPath]: genresApi.reducer,
    [visitorApi.reducerPath]: visitorApi.reducer,
    [promotionsApi.reducerPath]: promotionsApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [typeSubscriptionApi.reducerPath]: typeSubscriptionApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [dlApi.reducerPath]: dlApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, reducer);



export const store = configureStore({
  reducer: {
    player: playerReducer,
      auth: authReducer,
      songs: songsReducer,
      streams: streamsReducer,
      downloads: downloadsReducer,
      albums: albumsReducer,
      genres: genresReducer,
      visitors: visitorsReducer,
      promotions: promotionReducer,
      favorites: favoritesReducer,
      typeSubscription: typeSubscriptionReducer,
      subs: subscriptionReducer,
      order: orderReducer,
      dl: dlReducer,
      [songsApi.reducerPath]: songsApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [artistsApi.reducerPath]: artistsApi.reducer,
      [likeApi.reducerPath]: likeApi.reducer,
      [playlistApi.reducerPath]: playlistApi.reducer,
      [playlistSongApi.reducerPath]: playlistSongApi.reducer,
      [streamsApi.reducerPath]: streamsApi.reducer,
      [downloadsApi.reducerPath]: downloadsApi.reducer,
      [albumsApi.reducerPath]: albumsApi.reducer,
      [genresApi.reducerPath]: genresApi.reducer,
      [visitorApi.reducerPath]: visitorApi.reducer,
      [promotionsApi.reducerPath]: promotionsApi.reducer,
      [favoritesApi.reducerPath]: favoritesApi.reducer,
      [typeSubscriptionApi.reducerPath]: typeSubscriptionApi.reducer,
      [subscriptionApi.reducerPath]: subscriptionApi.reducer,
      [dlApi.reducerPath]: dlApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      songsApi.middleware,
      authApi.middleware,
      artistsApi.middleware,
      likeApi.middleware,
      playlistApi.middleware,
      playlistSongApi.middleware,
      streamsApi.middleware,
      downloadsApi.middleware,
      albumsApi.middleware,
      genresApi.middleware,
      visitorApi.middleware,
      promotionsApi.middleware,
      favoritesApi.middleware,
      subscriptionApi.middleware,
      typeSubscriptionApi.middleware,
      dlApi.middleware
    ),
  devTools: true,
});


export const persistor = persistStore(store);
