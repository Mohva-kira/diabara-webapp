# 📊 Guide d'utilisation du Funnel Tracking - Diabara.tv

## 🎯 Vue d'ensemble

Le système de tracking du funnel permet de suivre toutes les étapes du parcours utilisateur depuis le clic sur une publicité Facebook jusqu'à la conversion premium.

## 📋 Étapes du Funnel

### 1️⃣ Click sur la pub Facebook
- **Tracking automatique** : Détecté via les paramètres UTM dans l'URL
- **Paramètres UTM** : `utm_source=facebook`, `fbclid`, etc.
- **Fichier** : `app/src/App.jsx` (initialisation)

### 2️⃣ Ouverture de la landing / app
- **Tracking automatique** : Au chargement de l'application
- **Fichier** : `app/src/App.jsx` (useEffect initial)

### 3️⃣ Inscription / Création de compte
- **Tracking** : Après succès de l'inscription
- **Fichier** : `app/src/components/Register.jsx`
- **Fonction** : `trackRegistration()`

### 4️⃣ Activation email/SMS
- **Tracking** : Après vérification email ou WhatsApp
- **Fichiers helpers** : `app/src/services/verificationTracking.js`
- **Fonctions** : 
  - `handleEmailVerification()` pour email
  - `handleWhatsAppVerification()` pour WhatsApp

### 5️⃣ Ouverture de l'application
- **Tracking automatique** : Après authentification
- **Fichier** : `app/src/App.jsx`
- **Fonction** : `trackAppOpen()`

### 6️⃣ Premier play (🎵 musique / 🎥 vidéo)
- **Tracking** : Au premier play d'une chanson/vidéo
- **Fichier** : `app/src/components/MusicPlayer/Player.jsx`
- **Fonction** : `trackFirstPlay()`

### 7️⃣ Retour dans l'app (rétention)
- **Tracking automatique** : Détection des utilisateurs retournants
- **Fichier** : `app/src/App.jsx`
- **Fonction** : `trackReturningUser()`

### 8️⃣ Conversion premium
- **Tracking** : Après paiement réussi
- **Fichier** : `app/src/pages/Payment.jsx`
- **Fonction** : `trackPremiumConversion()`

## 🔧 Configuration

### Mockdata utilisés

**Firebase :**
- API Key: `AIzaSyDummyFirebaseApiKey123456789`
- Project ID: `diabara-tv-mock`
- Measurement ID: `G-MOCKMEASUREMENTID`

**Meta Pixel :**
- Pixel ID: `123456789012345`
- App ID: `987654321098765`

> ⚠️ **Important** : Remplacez ces valeurs par vos vraies clés API lorsque vous êtes prêt pour la production.

## 🌍 Modèles régionaux

Le système détecte automatiquement la région (Afrique de l'Ouest ou Europe) et ajuste les valeurs en conséquence.

### Afrique de l'Ouest
- **Devise** : XOF (FCFA)
- **Valeurs d'abonnement** :
  - Basic: 2000 XOF (~3€)
  - Premium: 5000 XOF (~7.5€)
  - VIP: 10000 XOF (~15€)

### Europe
- **Devise** : EUR (€)
- **Valeurs d'abonnement** :
  - Basic: 4.99€
  - Premium: 9.99€
  - VIP: 19.99€

## 📊 Paramètres UTM

Le système track automatiquement les paramètres UTM suivants :

### Paramètres standards
- `utm_source` : Source du trafic (ex: `facebook`, `google`)
- `utm_medium` : Moyen utilisé (ex: `cpc`, `organic`)
- `utm_campaign` : Nom de la campagne
- `utm_term` : Terme de recherche
- `utm_content` : Contenu spécifique
- `utm_region` : Région cible (`west_africa`, `europe`)
- `utm_language` : Langue (`fr`, `en`)

### Paramètres personnalisés
- `fbclid` : Facebook Click ID
- `gclid` : Google Click ID
- `ref` : Référent
- `ad_id` : ID de l'annonce
- `adset_id` : ID du groupe d'annonces
- `campaign_id` : ID de la campagne

Les paramètres UTM sont stockés dans le localStorage pendant 30 jours pour le tracking multi-session.

## 🚀 Utilisation

### Utilisation basique

Le tracking est automatiquement initialisé au démarrage de l'application. Aucune action supplémentaire n'est nécessaire pour les étapes automatiques.

### Utilisation manuelle

Pour tracker des événements spécifiques :

```javascript
import { 
  trackRegistration,
  trackEmailVerification,
  trackWhatsAppVerification,
  trackFirstPlay,
  trackPremiumConversion 
} from './services/funnelTracking';

// Exemple : Tracker une inscription
trackRegistration({
  userId: '123',
  method: 'phone',
  phone: '+22377888888',
});

// Exemple : Tracker une vérification email
trackEmailVerification({
  userId: '123',
  email: 'user@example.com',
  verificationMethod: 'email_link',
});

// Exemple : Tracker le premier play
trackFirstPlay({
  userId: '123',
  contentType: 'music',
  contentId: 'song_456',
  contentName: 'Nom de la chanson',
});

// Exemple : Tracker une conversion premium
trackPremiumConversion({
  userId: '123',
  subscriptionType: 'premium',
  value: 5000,
  currency: 'XOF',
  transactionId: 'txn_789',
  duration: 'monthly',
});
```

### Utilisation avec le hook React

```javascript
import { useFunnelTracking } from './hooks/useFunnelTracking';

function MyComponent() {
  const tracking = useFunnelTracking({
    autoInit: true,
    trackPageView: true,
  });

  const handleRegistration = async () => {
    // ... votre logique d'inscription
    tracking.trackRegistration({
      userId: user.id,
      method: 'phone',
    });
  };

  return <div>...</div>;
}
```

## 📝 Fichiers créés/modifiés

### Nouveaux fichiers
- `app/src/services/firebaseConfig.js` - Configuration Firebase
- `app/src/services/metaPixel.js` - Configuration Meta Pixel
- `app/src/services/funnelTracking.js` - Service centralisé de tracking
- `app/src/services/verificationTracking.js` - Helpers pour vérifications
- `app/src/hooks/useFunnelTracking.jsx` - Hook React pour le tracking

### Fichiers modifiés
- `app/src/App.jsx` - Initialisation et tracking automatique
- `app/src/components/Register.jsx` - Tracking de l'inscription
- `app/src/components/MusicPlayer/Player.jsx` - Tracking du premier play
- `app/src/pages/Payment.jsx` - Tracking de la conversion premium

## 🔍 Vérification

Pour vérifier que le tracking fonctionne :

1. **Console du navigateur** : Tous les événements sont loggés avec le préfixe `[Funnel]`, `[Firebase Analytics]`, ou `[Meta Pixel]`
2. **Firebase Analytics** : Vérifiez les événements dans la console Firebase (une fois configuré)
3. **Meta Pixel** : Vérifiez les événements dans le Gestionnaire d'événements Meta (une fois configuré)

## ⚙️ Prochaines étapes

1. **Remplacer les mockdata** : Configurez vos vraies clés API Firebase et Meta Pixel
2. **Implémenter la vérification email/WhatsApp** : Utilisez les helpers dans `verificationTracking.js`
3. **Configurer Firebase Dynamic Links** : Pour créer des liens courts pour les pubs Facebook
4. **Tester le funnel complet** : Suivez un utilisateur test à travers toutes les étapes

## 📚 Documentation supplémentaire

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [Meta Pixel Documentation](https://developers.facebook.com/docs/meta-pixel)
- [UTM Parameters Guide](https://en.wikipedia.org/wiki/UTM_parameters)

