# 📊 Implémentation du Funnel de Tracking - Diabara.tv

## 🎯 Vue d'ensemble

Ce document détaille les éléments nécessaires pour implémenter un suivi complet du funnel utilisateur depuis le clic sur la pub Facebook jusqu'à la conversion premium.

## 📋 Éléments nécessaires

### 1. **Identifiants et clés API**

#### Meta (Facebook)
- ✅ **Meta Pixel ID** : Identifiant du Pixel Facebook (format: `123456789012345`)
- ✅ **Facebook App ID** : ID de l'application Facebook (si vous utilisez le SDK)
- ✅ **Access Token** : Token d'accès pour les API Meta (optionnel, pour le tracking avancé)

#### Firebase
- ✅ **Firebase Project ID** : ID du projet Firebase
- ✅ **Firebase Config** : Configuration complète Firebase (apiKey, authDomain, projectId, etc.)
  ```javascript
  {
    apiKey: "AIza...",
    authDomain: "diabara-tv.firebaseapp.com",
    projectId: "diabara-tv",
    storageBucket: "diabara-tv.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123",
    measurementId: "G-XXXXXXXXXX"
  }
  ```
- ✅ **Firebase Dynamic Links Domain** : Domaine pour les liens dynamiques (ex: `diabara.page.link`)

### 2. **Dépendances NPM à installer**

```bash
npm install firebase @react-native-firebase/app @react-native-firebase/analytics
npm install react-facebook-pixel
# OU pour Meta Pixel basique
# npm install react-facebook-pixel
```

### 3. **Structure du Funnel à implémenter**

#### Étape 1️⃣ : Click sur la pub Facebook
- **Où** : Landing page / Point d'entrée
- **Tracking** : 
  - Meta Pixel : `ViewContent`, `Lead`
  - Firebase Analytics : `fb_ad_click`
  - Firebase Dynamic Links : Paramètres UTM dans l'URL

#### Étape 2️⃣ : Ouverture de la landing / app
- **Où** : `app/src/App.jsx` (useEffect initial)
- **Tracking** :
  - Meta Pixel : `PageView`
  - Firebase Analytics : `app_open`, `screen_view`
  - Détection de la source (Facebook, direct, etc.)

#### Étape 3️⃣ : Inscription / Création de compte
- **Où** : `app/src/components/Register.jsx` (fonction `send`)
- **Tracking** :
  - Meta Pixel : `CompleteRegistration`
  - Firebase Analytics : `sign_up`
  - Paramètres : `method` (phone/email)

#### Étape 4️⃣ : Activation email/SMS (si existe)
- **Où** : À déterminer (vérification email/SMS)
- **Tracking** :
  - Meta Pixel : `Lead` (avec paramètre `content_name: 'email_verified'`)
  - Firebase Analytics : `email_verification` ou `sms_verification`

#### Étape 5️⃣ : Ouverture de l'application
- **Où** : `app/src/App.jsx` (après authentification)
- **Tracking** :
  - Firebase Analytics : `app_open`, `login`
  - Meta Pixel : `PageView` (page principale)

#### Étape 6️⃣ : Premier play (🎵 musique / 🎥 vidéo)
- **Où** : `app/src/components/MusicPlayer/Player.jsx` (fonction `recordPlay`)
- **Tracking** :
  - Meta Pixel : `Purchase` (avec valeur 0) ou événement personnalisé `first_play`
  - Firebase Analytics : `first_play`, `play_music`, `play_video`
  - Paramètres : `content_type`, `content_id`, `content_name`

#### Étape 7️⃣ : Retour dans l'app (rétention)
- **Où** : `app/src/App.jsx` (détection de retour utilisateur)
- **Tracking** :
  - Firebase Analytics : `user_engagement`, `session_start`
  - Meta Pixel : `PageView` (avec paramètre `returning_user: true`)

#### Étape 8️⃣ : Conversion premium (si existe)
- **Où** : `app/src/pages/Payment.jsx` (fonction `handleSubmit` après paiement réussi)
- **Tracking** :
  - Meta Pixel : `Purchase` (avec valeur réelle)
  - Firebase Analytics : `purchase`, `subscription_start`
  - Paramètres : `value`, `currency`, `subscription_type`

## 🔧 Fichiers à créer/modifier

### Nouveaux fichiers à créer :
1. `app/src/services/funnelTracking.js` - Service centralisé de tracking
2. `app/src/services/firebaseConfig.js` - Configuration Firebase
3. `app/src/services/metaPixel.js` - Configuration Meta Pixel
4. `app/src/hooks/useFunnelTracking.jsx` - Hook React pour le tracking

### Fichiers à modifier :
1. `app/index.html` - Ajouter Meta Pixel et Firebase SDK
2. `app/src/App.jsx` - Initialiser le tracking au démarrage
3. `app/src/components/Register.jsx` - Tracker l'inscription
4. `app/src/components/MusicPlayer/Player.jsx` - Tracker le premier play
5. `app/src/pages/Payment.jsx` - Tracker la conversion premium
6. `app/package.json` - Ajouter les dépendances

## 📝 Informations supplémentaires nécessaires

### Questions à clarifier :
1. **Activation email/SMS** : Existe-t-il un système de vérification ? Si oui, où est-il géré ?
2. **Firebase Dynamic Links** : Souhaitez-vous utiliser des liens courts pour les pubs Facebook ?
3. **Valeurs de conversion** : Quelles sont les valeurs monétaires des abonnements premium ?
4. **Paramètres UTM** : Quels paramètres UTM souhaitez-vous tracker depuis Facebook Ads ?

### Configuration environnement
- Créer un fichier `.env` avec les clés API (ou utiliser les variables d'environnement existantes)
- Variables nécessaires :
  ```
  VITE_FIREBASE_API_KEY=...
  VITE_FIREBASE_AUTH_DOMAIN=...
  VITE_FIREBASE_PROJECT_ID=...
  VITE_META_PIXEL_ID=...
  VITE_FACEBOOK_APP_ID=...
  ```

## 🚀 Prochaines étapes

Une fois que vous aurez fourni :
1. ✅ Les identifiants Meta Pixel et Facebook App ID
2. ✅ La configuration Firebase complète
3. ✅ Les réponses aux questions ci-dessus

Je pourrai procéder à l'implémentation complète du système de tracking du funnel.

