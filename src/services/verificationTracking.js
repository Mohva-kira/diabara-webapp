// Helper pour tracker les vérifications email et WhatsApp
// Ce fichier peut être utilisé lorsque vous implémenterez la vérification email/WhatsApp

import { trackEmailVerification, trackWhatsAppVerification } from './funnelTracking';

/**
 * Tracker la vérification email
 * À appeler après qu'un utilisateur ait vérifié son email
 * 
 * @param {Object} verificationData - Données de vérification
 * @param {string} verificationData.userId - ID de l'utilisateur
 * @param {string} verificationData.email - Email vérifié
 * @param {string} verificationData.verificationMethod - Méthode de vérification (ex: 'email_link', 'code')
 */
export const handleEmailVerification = (verificationData) => {
  trackEmailVerification({
    userId: verificationData.userId,
    email: verificationData.email,
    verificationMethod: verificationData.verificationMethod || 'email_link',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Tracker la vérification WhatsApp
 * À appeler après qu'un utilisateur ait vérifié son numéro WhatsApp
 * 
 * @param {Object} verificationData - Données de vérification
 * @param {string} verificationData.userId - ID de l'utilisateur
 * @param {string} verificationData.phone - Numéro de téléphone vérifié
 * @param {string} verificationData.verificationMethod - Méthode de vérification (ex: 'sms_code', 'whatsapp_link')
 */
export const handleWhatsAppVerification = (verificationData) => {
  trackWhatsAppVerification({
    userId: verificationData.userId,
    phone: verificationData.phone,
    verificationMethod: verificationData.verificationMethod || 'sms_code',
    timestamp: new Date().toISOString(),
  });
};

export default {
  handleEmailVerification,
  handleWhatsAppVerification,
};

