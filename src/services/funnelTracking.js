// Service centralisé de tracking du funnel Diabara.tv
import { logFirebaseEvent, setFirebaseUserProperties, setFirebaseUserId } from './firebaseConfig';
import { trackMetaPixelEvent, MetaPixelEvents, initMetaPixel } from './metaPixel';

// Modèles de valeurs par région
export const REGION_MODELS = {
  WEST_AFRICA: {
    name: 'west_africa',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    // Valeurs d'abonnement typiques pour l'Afrique de l'Ouest (en XOF)
    subscriptionValues: {
      basic: 2000,      // ~3€
      premium: 5000,   // ~7.5€
      vip: 10000,      // ~15€
    },
    // UTM spécifiques pour l'Afrique de l'Ouest
    utmDefaults: {
      region: 'west_africa',
      market: 'afrique_ouest',
      language: 'fr',
    },
    // Pays cibles
    countries: ['MLI', 'CIV', 'SEN', 'BFA', 'NGA', 'GHA', 'BEN', 'TGO'],
  },
  EUROPE: {
    name: 'europe',
    currency: 'EUR',
    currencySymbol: '€',
    // Valeurs d'abonnement typiques pour l'Europe (en EUR)
    subscriptionValues: {
      basic: 4.99,
      premium: 9.99,
      vip: 19.99,
    },
    // UTM spécifiques pour l'Europe
    utmDefaults: {
      region: 'europe',
      market: 'europe',
      language: 'fr',
    },
    // Pays cibles
    countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
  },
};

// Détecter la région basée sur le pays ou les paramètres UTM
export const detectRegion = () => {
  // Vérifier les paramètres UTM dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const utmRegion = urlParams.get('utm_region');
  
  if (utmRegion === 'europe') {
    return REGION_MODELS.EUROPE;
  }
  if (utmRegion === 'west_africa') {
    return REGION_MODELS.WEST_AFRICA;
  }
  
  // Détecter par fuseau horaire ou langue
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isEurope = timezone.includes('Europe') || timezone.includes('Paris') || timezone.includes('Brussels');
  
  // Détecter par langue du navigateur
  const browserLang = navigator.language || navigator.userLanguage;
  const isFrenchSpeaking = browserLang.startsWith('fr');
  
  // Par défaut, utiliser l'Afrique de l'Ouest si on est en français mais pas en Europe
  if (isFrenchSpeaking && !isEurope) {
    return REGION_MODELS.WEST_AFRICA;
  }
  
  return isEurope ? REGION_MODELS.EUROPE : REGION_MODELS.WEST_AFRICA;
};

// Extraire les paramètres UTM de l'URL
export const getUTMParameters = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {};
  
  // Paramètres UTM standards
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_region', 'utm_language'];
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });
  
  // Paramètres personnalisés pour Diabara.tv
  const customParams = ['fbclid', 'gclid', 'ref', 'ad_id', 'adset_id', 'campaign_id'];
  customParams.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });
  
  return utmParams;
};

// Stocker les paramètres UTM dans le localStorage pour les sessions suivantes
export const storeUTMParameters = (utmParams) => {
  if (Object.keys(utmParams).length > 0) {
    localStorage.setItem('diabara_utm_params', JSON.stringify(utmParams));
    localStorage.setItem('diabara_utm_timestamp', Date.now().toString());
  }
};

// Récupérer les paramètres UTM stockés
export const getStoredUTMParameters = () => {
  const stored = localStorage.getItem('diabara_utm_params');
  const timestamp = localStorage.getItem('diabara_utm_timestamp');
  
  // Conserver les UTM pendant 30 jours
  if (stored && timestamp) {
    const daysSince = (Date.now() - parseInt(timestamp, 10)) / (1000 * 60 * 60 * 24);
    if (daysSince < 30) {
      return JSON.parse(stored);
    }
  }
  
  return {};
};

// Initialiser le tracking au démarrage
export const initFunnelTracking = () => {
  // Initialiser Meta Pixel
  initMetaPixel();
  
  // Récupérer et stocker les paramètres UTM
  const utmParams = getUTMParameters();
  if (Object.keys(utmParams).length > 0) {
    storeUTMParameters(utmParams);
  }
  
  // Détecter la région
  const region = detectRegion();
  
  // Logger l'initialisation
  console.log('[Funnel Tracking] Initialized', { region: region.name, utmParams });
  
  return { region, utmParams };
};

// ============================================
// ÉTAPES DU FUNNEL
// ============================================

/**
 * Étape 1️⃣ : Click sur la pub Facebook
 * Tracké automatiquement via les paramètres UTM dans l'URL
 */
export const trackFacebookAdClick = (adData = {}) => {
  const utmParams = { ...getUTMParameters(), ...getStoredUTMParameters() };
  const region = detectRegion();
  
  const eventData = {
    ...utmParams,
    ...adData,
    region: region.name,
    currency: region.currency,
  };
  
  // Meta Pixel
  MetaPixelEvents.ViewContent({
    content_name: 'Facebook Ad Click',
    content_category: 'advertisement',
    ...eventData,
  });
  
  // Firebase Analytics
  logFirebaseEvent('fb_ad_click', {
    ...eventData,
    value: 0,
  });
  
  console.log('[Funnel] Step 1: Facebook Ad Click tracked', eventData);
};

/**
 * Étape 2️⃣ : Ouverture de la landing / app
 */
export const trackLandingPageOpen = () => {
  const utmParams = { ...getUTMParameters(), ...getStoredUTMParameters() };
  const region = detectRegion();
  const referrer = document.referrer || 'direct';
  const isFacebookReferrer = referrer.includes('facebook.com') || referrer.includes('fb.com');
  
  const eventData = {
    ...utmParams,
    region: region.name,
    referrer,
    is_facebook_referrer: isFacebookReferrer,
    page_path: window.location.pathname,
    page_url: window.location.href,
  };
  
  // Meta Pixel
  MetaPixelEvents.PageView(window.location.href);
  if (isFacebookReferrer) {
    MetaPixelEvents.ViewContent({
      content_name: 'Landing Page',
      content_category: 'landing',
      ...eventData,
    });
  }
  
  // Firebase Analytics
  logFirebaseEvent('app_open', eventData);
  logFirebaseEvent('screen_view', {
    screen_name: 'Landing Page',
    screen_class: 'LandingPage',
    ...eventData,
  });
  
  console.log('[Funnel] Step 2: Landing Page Open tracked', eventData);
};

/**
 * Étape 3️⃣ : Inscription / Création de compte
 */
export const trackRegistration = (userData = {}) => {
  const utmParams = getStoredUTMParameters();
  const region = detectRegion();
  
  const eventData = {
    ...utmParams,
    region: region.name,
    registration_method: userData.method || 'phone', // phone, email, etc.
    user_id: userData.userId || null,
    ...userData,
  };
  
  // Meta Pixel
  MetaPixelEvents.CompleteRegistration({
    content_name: 'User Registration',
    status: true,
    ...eventData,
  });
  
  // Firebase Analytics
  logFirebaseEvent('sign_up', {
    method: eventData.registration_method,
    ...eventData,
  });
  
  // Définir l'ID utilisateur dans Firebase
  if (eventData.user_id) {
    setFirebaseUserId(eventData.user_id);
  }
  
  // Définir les propriétés utilisateur
  setFirebaseUserProperties({
    region: region.name,
    registration_method: eventData.registration_method,
  });
  
  console.log('[Funnel] Step 3: Registration tracked', eventData);
};

/**
 * Étape 4️⃣ : Activation email
 */
export const trackEmailVerification = (verificationData = {}) => {
  const utmParams = getStoredUTMParameters();
  const region = detectRegion();
  
  const eventData = {
    ...utmParams,
    region: region.name,
    verification_method: 'email',
    user_id: verificationData.userId || null,
    ...verificationData,
  };
  
  // Meta Pixel
  MetaPixelEvents.EmailVerified({
    content_name: 'Email Verification',
    status: true,
    ...eventData,
  });
  
  MetaPixelEvents.Lead({
    content_name: 'Email Verified',
    content_category: 'verification',
    ...eventData,
  });
  
  // Firebase Analytics
  logFirebaseEvent('email_verification', eventData);
  
  console.log('[Funnel] Step 4: Email Verification tracked', eventData);
};

/**
 * Étape 4️⃣ : Activation WhatsApp
 */
export const trackWhatsAppVerification = (verificationData = {}) => {
  const utmParams = getStoredUTMParameters();
  const region = detectRegion();
  
  const eventData = {
    ...utmParams,
    region: region.name,
    verification_method: 'whatsapp',
    user_id: verificationData.userId || null,
    ...verificationData,
  };
  
  // Meta Pixel
  MetaPixelEvents.WhatsAppVerified({
    content_name: 'WhatsApp Verification',
    status: true,
    ...eventData,
  });
  
  MetaPixelEvents.Lead({
    content_name: 'WhatsApp Verified',
    content_category: 'verification',
    ...eventData,
  });
  
  // Firebase Analytics
  logFirebaseEvent('whatsapp_verification', eventData);
  
  console.log('[Funnel] Step 4: WhatsApp Verification tracked', eventData);
};

/**
 * Étape 5️⃣ : Ouverture de l'application (après authentification)
 */
export const trackAppOpen = (userData = {}) => {
  const utmParams = getStoredUTMParameters();
  const region = detectRegion();
  
  const eventData = {
    ...utmParams,
    region: region.name,
    user_id: userData.userId || null,
    is_returning_user: userData.isReturning || false,
    ...userData,
  };
  
  // Meta Pixel
  MetaPixelEvents.AppOpen({
    content_name: 'App Open',
    ...eventData,
  });
  
  if (eventData.is_returning_user) {
    MetaPixelEvents.ReturningUser({
      content_name: 'Returning User',
      ...eventData,
    });
  }
  
  // Firebase Analytics
  logFirebaseEvent('app_open', eventData);
  logFirebaseEvent('login', {
    method: 'existing_user',
    ...eventData,
  });
  
  if (eventData.is_returning_user) {
    logFirebaseEvent('user_engagement', {
      engagement_time_msec: 1000,
      ...eventData,
    });
  }
  
  console.log('[Funnel] Step 5: App Open tracked', eventData);
};

/**
 * Étape 6️⃣ : Premier play (musique / vidéo)
 */
export const trackFirstPlay = (playData = {}) => {
  const utmParams = getStoredUTMParameters();
  const region = detectRegion();
  const isFirstPlay = !localStorage.getItem('diabara_first_play_tracked');
  
  if (!isFirstPlay) {
    return; // Ne tracker que le premier play
  }
  
  localStorage.setItem('diabara_first_play_tracked', 'true');
  localStorage.setItem('diabara_first_play_timestamp', Date.now().toString());
  
  const eventData = {
    ...utmParams,
    region: region.name,
    content_type: playData.contentType || 'music', // music, video
    content_id: playData.contentId || null,
    content_name: playData.contentName || null,
    user_id: playData.userId || null,
    ...playData,
  };
  
  // Meta Pixel
  MetaPixelEvents.FirstPlay({
    content_name: eventData.content_name || 'First Play',
    content_type: eventData.content_type,
    content_ids: eventData.content_id ? [eventData.content_id] : [],
    value: 0,
    currency: region.currency,
    ...eventData,
  });
  
  // Firebase Analytics
  logFirebaseEvent('first_play', eventData);
  logFirebaseEvent(`play_${eventData.content_type}`, {
    content_id: eventData.content_id,
    content_name: eventData.content_name,
    ...eventData,
  });
  
  console.log('[Funnel] Step 6: First Play tracked', eventData);
};

/**
 * Étape 7️⃣ : Retour dans l'app (rétention)
 */
export const trackReturningUser = (userData = {}) => {
  const utmParams = getStoredUTMParameters();
  const region = detectRegion();
  const lastVisit = localStorage.getItem('diabara_last_visit_timestamp');
  const now = Date.now();
  
  // Calculer les jours depuis la dernière visite
  const daysSinceLastVisit = lastVisit ? Math.floor((now - parseInt(lastVisit, 10)) / (1000 * 60 * 60 * 24)) : null;
  
  localStorage.setItem('diabara_last_visit_timestamp', now.toString());
  
  const eventData = {
    ...utmParams,
    region: region.name,
    user_id: userData.userId || null,
    days_since_last_visit: daysSinceLastVisit,
    visit_count: parseInt(localStorage.getItem('diabara_visit_count') || '0', 10) + 1,
    ...userData,
  };
  
  localStorage.setItem('diabara_visit_count', eventData.visit_count.toString());
  
  // Meta Pixel
  MetaPixelEvents.ReturningUser({
    content_name: 'Returning User',
    days_since_last_visit: daysSinceLastVisit,
    visit_count: eventData.visit_count,
    ...eventData,
  });
  
  // Firebase Analytics
  logFirebaseEvent('user_engagement', {
    engagement_time_msec: 1000,
    ...eventData,
  });
  
  logFirebaseEvent('session_start', eventData);
  
  console.log('[Funnel] Step 7: Returning User tracked', eventData);
};

/**
 * Étape 8️⃣ : Conversion premium
 */
export const trackPremiumConversion = (subscriptionData = {}) => {
  const utmParams = getStoredUTMParameters();
  const region = detectRegion();
  
  // Déterminer la valeur selon le type d'abonnement
  const subscriptionType = subscriptionData.subscriptionType || 'premium';
  const value = subscriptionData.value || region.subscriptionValues[subscriptionType] || region.subscriptionValues.premium;
  
  const eventData = {
    ...utmParams,
    region: region.name,
    currency: region.currency,
    value,
    subscription_type: subscriptionType,
    subscription_duration: subscriptionData.duration || 'monthly',
    user_id: subscriptionData.userId || null,
    transaction_id: subscriptionData.transactionId || null,
    ...subscriptionData,
  };
  
  // Meta Pixel
  MetaPixelEvents.Purchase({
    content_name: 'Premium Subscription',
    content_type: 'subscription',
    value,
    currency: region.currency,
    ...eventData,
  });
  
  MetaPixelEvents.SubscriptionStart({
    content_name: 'Subscription Started',
    value,
    currency: region.currency,
    ...eventData,
  });
  
  // Firebase Analytics
  logFirebaseEvent('purchase', {
    value,
    currency: region.currency,
    items: [{
      item_id: subscriptionType,
      item_name: `Premium Subscription - ${subscriptionType}`,
      price: value,
      quantity: 1,
    }],
    ...eventData,
  });
  
  logFirebaseEvent('subscription_start', {
    subscription_type: subscriptionType,
    value,
    currency: region.currency,
    ...eventData,
  });
  
  console.log('[Funnel] Step 8: Premium Conversion tracked', eventData);
  
  return eventData;
};

// Export par défaut
export default {
  initFunnelTracking,
  trackFacebookAdClick,
  trackLandingPageOpen,
  trackRegistration,
  trackEmailVerification,
  trackWhatsAppVerification,
  trackAppOpen,
  trackFirstPlay,
  trackReturningUser,
  trackPremiumConversion,
  detectRegion,
  getUTMParameters,
  REGION_MODELS,
};

