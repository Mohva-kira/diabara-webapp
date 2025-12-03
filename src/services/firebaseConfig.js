// Configuration Firebase avec mockdata
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, setUserProperties, setUserId, isSupported } from 'firebase/analytics';


const {VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID, VITE_FIREBASE_MEASUREMENT_ID} = import.meta.env;
// Mockdata Firebase Configuration
const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
  measurementId: VITE_FIREBASE_MEASUREMENT_ID
};

// Initialiser Firebase
let app;
let analytics;
let performance = null; // Mock pour Performance
let crashlytics = null; // Mock pour Crashlytics
let dynamicLinks = null; // Mock pour Dynamic Links

try {
  app = initializeApp(firebaseConfig);
  
  // Initialiser Analytics seulement côté client
  if (typeof window !== 'undefined') {
    // Vérifier si Analytics est supporté (asynchrone)
    isSupported().then((supported) => {
      if (supported) {
        try {
          analytics = getAnalytics(app);
          console.log('[Firebase] Analytics initialized');
        } catch (error) {
          console.warn('[Firebase] Analytics initialization error:', error);
        }
      } else {
        console.warn('[Firebase] Analytics not supported');
      }
    }).catch((error) => {
      console.warn('[Firebase] Analytics initialization check failed:', error);
      // En mode mock, on continue sans analytics
    });
    
    // Mock Performance Monitoring
    performance = {
      trace: (name) => ({
        start: () => console.log(`[Firebase Performance] Trace started: ${name}`),
        stop: () => console.log(`[Firebase Performance] Trace stopped: ${name}`),
        incrementMetric: (metric, value) => console.log(`[Firebase Performance] Metric ${metric}: ${value}`),
      }),
    };
    
    // Mock Crashlytics
    crashlytics = {
      recordError: (error) => console.log('[Firebase Crashlytics] Error recorded:', error),
      setAttribute: (key, value) => console.log(`[Firebase Crashlytics] Attribute set: ${key} = ${value}`),
      log: (message) => console.log(`[Firebase Crashlytics] Log: ${message}`),
    };
    
    // Mock Dynamic Links (sera implémenté avec l'API REST si nécessaire)
    dynamicLinks = {
      createShortLink: async (params) => {
        console.log('[Firebase Dynamic Links] Creating link:', params);
        return params.link; // Retourner le lien original en mode mock
      },
    };
  }
} catch (error) {
  console.warn('Firebase initialization error (using mockdata):', error);
}

// Helper pour logger les événements Firebase Analytics
export const logFirebaseEvent = (eventName, parameters = {}) => {
  // Toujours logger dans la console pour le debug
  console.log(`[Firebase Analytics] ${eventName}:`, parameters);
  
  if (analytics) {
    try {
      logEvent(analytics, eventName, parameters);
    } catch (error) {
      console.warn('Firebase Analytics error:', error);
    }
  } else {
    // Mode mock : les événements sont loggés mais pas envoyés
    console.log(`[Firebase Analytics - MOCK] Event logged: ${eventName}`);
  }
};

// Helper pour définir les propriétés utilisateur
export const setFirebaseUserProperties = (properties) => {
  console.log('[Firebase Analytics] User properties set:', properties);
  
  if (analytics) {
    try {
      Object.keys(properties).forEach(key => {
        setUserProperties(analytics, { [key]: properties[key] });
      });
    } catch (error) {
      console.warn('Firebase Analytics user properties error:', error);
    }
  } else {
    console.log('[Firebase Analytics - MOCK] User properties logged');
  }
};

// Helper pour définir l'ID utilisateur
export const setFirebaseUserId = (userId) => {
  console.log('[Firebase Analytics] User ID set:', userId);
  
  if (analytics) {
    try {
      setUserId(analytics, userId);
    } catch (error) {
      console.warn('Firebase Analytics user ID error:', error);
    }
  } else {
    console.log('[Firebase Analytics - MOCK] User ID logged');
  }
};

// Helper pour Firebase Performance
export const startFirebaseTrace = (traceName) => {
  if (performance && typeof performance.trace === 'function') {
    try {
      const trace = performance.trace(traceName);
      trace.start();
      return trace;
    } catch (error) {
      console.warn('Firebase Performance error:', error);
      return null;
    }
  }
  return null;
};

// Helper pour Firebase Crashlytics
export const logCrashlyticsError = (error, context = {}) => {
  if (crashlytics) {
    try {
      crashlytics.recordError(error);
      if (Object.keys(context).length > 0) {
        Object.keys(context).forEach(key => {
          crashlytics.setAttribute(key, String(context[key]));
        });
      }
      console.log('[Firebase Crashlytics] Error logged:', error);
    } catch (err) {
      console.warn('Firebase Crashlytics error:', err);
    }
  }
};

// Helper pour Firebase Dynamic Links
export const createDynamicLink = async (link, options = {}) => {
  if (dynamicLinks) {
    try {
      const dynamicLink = await dynamicLinks.createShortLink({
        link: link,
        domainUriPrefix: 'https://diabara.page.link',
        android: {
          packageName: 'com.diabara.tv',
          ...options.android
        },
        ios: {
          bundleId: 'com.diabara.tv',
          ...options.ios
        },
        ...options
      });
      return dynamicLink;
    } catch (error) {
      console.warn('Firebase Dynamic Links error:', error);
      return link; // Retourner le lien original en cas d'erreur
    }
  }
  return link;
};

export { app, analytics, performance, crashlytics, dynamicLinks };
export default app;

