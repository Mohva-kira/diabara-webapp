import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './features/userSlice';
import { songsApi } from './services/songsApi';
import playerSlice from './features/playerSlice';

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Configuration de persistance
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['player', 'user'], // Seulement certains reducers
};

// Reducer racine
const rootReducer = combineReducers({
  [songsApi.reducerPath]: songsApi.reducer,
  player: playerSlice,
  user: userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration du store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(songsApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Configuration des listeners RTK Query
setupListeners(store.dispatch);

export const persistor = persistStore(store);

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;