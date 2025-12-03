// Configuration Meta Pixel avec mockdata
import ReactPixel from 'react-facebook-pixel';

// Mockdata Meta Pixel ID
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID; // Mock Pixel ID
const META_APP_ID = import.meta.env.VITE_META_APP_ID; // Mock Facebook App ID

let pixelInitialized = false;

// Initialiser Meta Pixel
export const initMetaPixel = () => {
  if (typeof window !== 'undefined' && !pixelInitialized) {
    try {
      ReactPixel.init(META_PIXEL_ID, {}, {
        autoConfig: true,
        debug: true // Mode debug pour voir les événements dans la console
      });
      pixelInitialized = true;
      console.log('[Meta Pixel] Initialized with ID:', META_PIXEL_ID);
    } catch (error) {
      console.warn('Meta Pixel initialization error:', error);
    }
  }
};

// Helper pour tracker les événements Meta Pixel
export const trackMetaPixelEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && pixelInitialized) {
    try {
      ReactPixel.track(eventName, parameters);
      console.log(`[Meta Pixel] ${eventName}:`, parameters);
    } catch (error) {
      console.warn('Meta Pixel tracking error:', error);
    }
  } else if (!pixelInitialized) {
    console.warn('[Meta Pixel] Pixel not initialized. Call initMetaPixel() first.');
  }
};

// Helper pour définir les propriétés utilisateur Meta Pixel
export const setMetaPixelUserData = (userData) => {
  if (typeof window !== 'undefined' && pixelInitialized) {
    try {
      ReactPixel.setUserData(userData);
      console.log('[Meta Pixel] User data set:', userData);
    } catch (error) {
      console.warn('Meta Pixel user data error:', error);
    }
  }
};

// Événements Meta Pixel standards
export const MetaPixelEvents = {
  // Événements de base
  PageView: (url) => trackMetaPixelEvent('PageView', { content_name: url }),
  
  // Événements de conversion
  ViewContent: (contentData) => trackMetaPixelEvent('ViewContent', contentData),
  Search: (searchData) => trackMetaPixelEvent('Search', searchData),
  AddToCart: (cartData) => trackMetaPixelEvent('AddToCart', cartData),
  InitiateCheckout: (checkoutData) => trackMetaPixelEvent('InitiateCheckout', checkoutData),
  AddPaymentInfo: (paymentData) => trackMetaPixelEvent('AddPaymentInfo', paymentData),
  Purchase: (purchaseData) => trackMetaPixelEvent('Purchase', purchaseData),
  
  // Événements de lead
  Lead: (leadData) => trackMetaPixelEvent('Lead', leadData),
  CompleteRegistration: (registrationData) => trackMetaPixelEvent('CompleteRegistration', registrationData),
  
  // Événements personnalisés
  FirstPlay: (playData) => trackMetaPixelEvent('FirstPlay', playData),
  AppOpen: (appData) => trackMetaPixelEvent('AppOpen', appData),
  EmailVerified: (verificationData) => trackMetaPixelEvent('EmailVerified', verificationData),
  WhatsAppVerified: (verificationData) => trackMetaPixelEvent('WhatsAppVerified', verificationData),
  ReturningUser: (userData) => trackMetaPixelEvent('ReturningUser', userData),
  SubscriptionStart: (subscriptionData) => trackMetaPixelEvent('SubscriptionStart', subscriptionData),
};

export { META_PIXEL_ID, META_APP_ID };
export default ReactPixel;

