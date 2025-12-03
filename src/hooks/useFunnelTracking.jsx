// Hook React pour faciliter l'utilisation du tracking du funnel
import { useEffect, useCallback } from 'react';
import {
  initFunnelTracking,
  trackLandingPageOpen,
  trackRegistration,
  trackEmailVerification,
  trackWhatsAppVerification,
  trackAppOpen,
  trackFirstPlay,
  trackReturningUser,
  trackPremiumConversion,
  detectRegion,
} from '../services/funnelTracking';

/**
 * Hook pour le tracking du funnel Diabara.tv
 * 
 * @param {Object} options - Options de configuration
 * @param {boolean} options.autoInit - Initialiser automatiquement au montage (défaut: true)
 * @param {boolean} options.trackPageView - Tracker automatiquement les changements de page (défaut: true)
 * @returns {Object} - Méthodes de tracking et état
 */
export const useFunnelTracking = (options = {}) => {
  const {
    autoInit = true,
    trackPageView = true,
  } = options;

  // Initialiser le tracking au montage
  useEffect(() => {
    if (autoInit) {
      const { region, utmParams } = initFunnelTracking();
      console.log('[useFunnelTracking] Initialized', { region: region.name, utmParams });
      
      // Tracker l'ouverture de la landing page
      trackLandingPageOpen();
    }
  }, [autoInit]);

  // Tracker les changements de page
  useEffect(() => {
    if (trackPageView) {
      trackLandingPageOpen();
    }
  }, [trackPageView, window.location.pathname]);

  // Méthodes de tracking exposées
  const tracking = {
    // Étape 3: Inscription
    trackRegistration: useCallback((userData) => {
      trackRegistration(userData);
    }, []),

    // Étape 4: Vérification email
    trackEmailVerification: useCallback((verificationData) => {
      trackEmailVerification(verificationData);
    }, []),

    // Étape 4: Vérification WhatsApp
    trackWhatsAppVerification: useCallback((verificationData) => {
      trackWhatsAppVerification(verificationData);
    }, []),

    // Étape 5: Ouverture de l'app
    trackAppOpen: useCallback((userData) => {
      trackAppOpen(userData);
    }, []),

    // Étape 6: Premier play
    trackFirstPlay: useCallback((playData) => {
      trackFirstPlay(playData);
    }, []),

    // Étape 7: Retour utilisateur
    trackReturningUser: useCallback((userData) => {
      trackReturningUser(userData);
    }, []),

    // Étape 8: Conversion premium
    trackPremiumConversion: useCallback((subscriptionData) => {
      return trackPremiumConversion(subscriptionData);
    }, []),

    // Détecter la région
    getRegion: useCallback(() => {
      return detectRegion();
    }, []),
  };

  return tracking;
};

export default useFunnelTracking;

