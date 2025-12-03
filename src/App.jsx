import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Routes, Route } from 'react-router-dom';
import { useReactPWAInstall, ReactPWAInstallProvider } from 'react-pwa-install';
import ReactGA from 'react-ga4';
import { initGA, logEvent, logPageView } from './analytics';
import { initFunnelTracking, trackAppOpen, trackReturningUser, trackFacebookAdClick } from './services/funnelTracking';
import myLogo from './assets/logo.png';

// Import des composants
import { 
  Discover, Auth, Features, AddSong, TopArtists, TopCharts, 
  AroundYou, Adhesion, CGU, Confidentialite, Favourites, 
  ArtistDetails, ArtistAccount, Video, Profile, Payment, 
  SongDetails, Search, Pricing, RequireAuth, RequireSub 
} from './pages';
import { Header, MusicPlayer, Searchbar, Sidebar, TopPlay } from './components';
import { ToastContainer } from 'react-toastify';

export const showNotification = (title = 'New Message!', options = {}) => {
  // ...existing code...
  console.log('Attempting to show notification...', typeof Notification !== 'undefined' ? Notification.permission : 'no-api');

  if (typeof Notification === 'undefined') {
    console.log('Notifications API non supportée par ce navigateur.');
    return;
  }

  if (!window.isSecureContext) {
    console.warn('Les notifications nécessitent un contexte sécurisé (HTTPS) ou localhost.');
    // continuer quand même, mais souvent échouera hors HTTPS
  }

  const finalOptions = {
    body: options.body || 'Nouveauté disponible.',
    icon: options.icon || myLogo,
    ...options,
  };

  const create = () => {
    try {
      new Notification(title, finalOptions);
      console.log('Notification affichée.');
    } catch (err) {
      console.error('Erreur lors de la création de la notification:', err);
    }
  };

  if (Notification.permission === 'granted') {
    create();
  } else if (Notification.permission === 'denied') {
    console.log('Permission de notification refusée précédemment.');
  } else {
    // 'default' -> demander la permission
    Notification.requestPermission().then((permission) => {
      console.log('Résultat requestPermission:', permission);
      if (permission === 'granted') {
        create();
      } else {
        console.log('Permission de notification non accordée.');
      }
    }).catch((err) => {
      console.error('Erreur requestPermission:', err);
    });
  }
};

const App = () => {
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall();
  const [isVisible, setIsVisible] = useState(true);
  const [playerMinimized, setPlayerMinimized] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { activeSong } = useSelector((state) => state.player);
  const location = useLocation();

  const [deviceId, setDeviceId] = useState(null);

useEffect(() => {
  let mounted = true;
  const STORAGE_KEY = "diabaratv_deviceId";

  const canvasFingerprint = () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.textBaseline = "top";
      ctx.font = "16px 'Arial'";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("diabaratv", 2, 15);
      return canvas.toDataURL();
    } catch (e) {
      return "";
    }
  };

  const hashString = async (str) => {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  };

  const buildAndStoreId = async () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;

    const nav = window.navigator || {};
    const parts = [
      nav.userAgent || "",
      nav.language || "",
      nav.platform || "",
      nav.hardwareConcurrency || "",
      nav.deviceMemory || "",
      Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || "",
      screen?.width || "",
      screen?.height || "",
      screen?.colorDepth || "",
      new Date().getTimezoneOffset()
    ];
    const canvas = canvasFingerprint();
    // ajoute un peu d'entropie pour éviter collisions si nécessaire
    const rand = Array.from(crypto.getRandomValues(new Uint8Array(8))).join(",");
    const raw = parts.join("||") + "||" + canvas + "||" + rand;
    const id = await hashString(raw);
    console.log("STORE_KEY", id)
    try { localStorage.setItem(STORAGE_KEY, id); } catch(e){ /* ignore */ }
    return id;
  };

  buildAndStoreId().then(id => { if (mounted) setDeviceId(id); }).catch(() => {});

  return () => { mounted = false; };
}, []);
  // Configuration PWA
  const PWA_CONFIG = {
    title: "Install Web App",
    logo: myLogo,
    features: (
      <ul>
        <li>Cool feature 1</li>
        <li>Cool feature 2</li>
        <li>Even cooler feature</li>
        <li>Works offline</li>
      </ul>
    ),
    description: "This is a very good app that does a lot of useful stuff."
  };

  // Gestionnaire d'installation PWA
  const handlePWAInstall = useCallback(async () => {
    try {
      await pwaInstall(PWA_CONFIG);
      console.log("App installed successfully or instructions shown");
      logEvent("PWA", "Install", "Success");
    } catch (error) {
      console.log("User opted out from installing");
      logEvent("PWA", "Install", "Cancelled");
    }
  }, [pwaInstall]);


  
  // Initialisation Google Analytics et Funnel Tracking
  useEffect(() => {
    ReactGA.initialize("G-YQKY9V1351");
    initGA();
    logEvent("Page", "View", "Home Page");
    
    // Initialiser le tracking du funnel
    const { region, utmParams } = initFunnelTracking();
    
    // Tracker le clic sur la pub Facebook si présent dans les UTM
    if (utmParams.utm_source === 'facebook' || utmParams.fbclid) {
      trackFacebookAdClick(utmParams);
    }
    
    // Vérifier si c'est un utilisateur retournant
    const auth = localStorage.getItem('auth');
    const user = auth ? JSON.parse(auth) : null;
    const isReturning = !!auth && !!localStorage.getItem('diabara_last_visit_timestamp');
    
    if (user?.user?.id) {
      // Tracker l'ouverture de l'app après authentification
      trackAppOpen({
        userId: user.user.id,
        isReturning,
      });
      
      // Tracker le retour utilisateur si applicable
      if (isReturning) {
        trackReturningUser({
          userId: user.user.id,
        });
      }
    }
  }, []);
  
  useEffect(() => {
    // Exemple : afficher une notification au montage (la fonction gère la demande de permission)
    showNotification('Bienvenue', { body: "Notifications activées — test", icon: myLogo });
  }, []);
  // Suivi des changements de page
  useEffect(() => {
    logPageView();
    logEvent("Navigation", "Route Change", location.pathname);
  }, [location.pathname]);

  // Gestionnaire de chargement de page
  useEffect(() => {
    const handlePageLoad = () => {
      console.log("Page loaded:", window.location.href);
      logEvent("Performance", "Page Load", "Complete");
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", handlePageLoad);
    };
  }, []);

  useEffect(() => {
    if (typeof Notification === 'undefined') {
      console.log('Notifications API non supportée par ce navigateur.');
      return;
    }
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Permission de notification au montage:', permission);
      }).catch((err) => console.error('Erreur requestPermission au montage:', err));
    }
  }, []);

  // Réinitialiser le scroll lors du changement de page
  useEffect(() => {
    setIsScrolled(false);
  }, [location.pathname]);

  // Gestion de la visibilité du lecteur
  useEffect(() => {
    if (activeSong) {
      setIsVisible(true);
      setPlayerMinimized(false); // Réinitialiser si nouvelle chanson
    }
  }, [activeSong]);

  // Fonctions de gestion du lecteur
  const togglePlayerVisibility = () => {
    setPlayerMinimized(!playerMinimized);
    logEvent("Player", "Toggle", playerMinimized ? "Show" : "Hide");
  };

  const hidePlayer = () => {
    setPlayerMinimized(true);
    logEvent("Player", "Action", "Hide");
  };

  const showPlayer = () => {
    setPlayerMinimized(false);
    logEvent("Player", "Action", "Show");
  };

  return (
    <div className="relative flex">
      {/* Navigation */}
      
        <Sidebar />
      
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        /> 
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black via-black to-black">
        {/* Header */}
        <Header />

        {/* Zone de contenu avec scrolling */}
        <div className="px-2 overflow-y-scroll hide-scrollbar flex flex-col-reverse xl:flex-row h-[calc(100vh-40px)] sm:h-[calc(100vh-70px)]">
          
          {/* Bouton d'installation PWA */}
          {supported && !isInstalled && (
            <button 
              onClick={handlePWAInstall}
              className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
            >
              Install App
            </button>
          )}

          {/* Routes principales */}
          <div 
            className="flex-1 h-full  overflow-scroll no-scrollbar pb-20  justify-center gap-8 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300  pb-0 px-2"
            onScroll={(e) => {
              setIsScrolled(e.target.scrollTop > 50);
            }}
          >
            <ReactPWAInstallProvider enableLogging>
              <Routes>
                <Route path="/" element={<Discover />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/blog/features" element={<Features />} />
                <Route path="/songs/add" element={<AddSong />} />
                <Route path="/top-artists" element={<TopArtists />} />
                <Route path="/top-charts" element={<TopCharts />} />
                <Route path="/around-you" element={<AroundYou />} />
                <Route path="/adhesion" element={<Adhesion />} />
                <Route path="/terms-of-service" element={<CGU />} />
                <Route path="/privacy-policy" element={<Confidentialite />} />
                
                {/* Routes protégées */}
                <Route element={<RequireAuth />}>
                  <Route element={<RequireSub />}>
                    <Route path="/favourites" element={<Favourites />} />
                    <Route path="/artists/:id" element={<ArtistDetails />} />
                    <Route path="/artist/:id" element={<ArtistAccount />} />
                    <Route path="/video/:id" element={<Video />} />
                  </Route>
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/payment/:type" element={<Payment />} />
                </Route>

                <Route path="/songs/:songid" element={<SongDetails />} />
                <Route path="/search/:searchTerm" element={<Search />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/politique-confidentialite" element={<Confidentialite />} />
              </Routes>
            </ReactPWAInstallProvider>
          </div>

          {/* Zone latérale droite - Top Artists caché lors du scroll */}
          <div 
            className={`
              xl:sticky relative top-0 h-fit
              transition-all duration-500 ease-in-out
              ${isScrolled 
                ? 'opacity-0 h-0 overflow-hidden hidden pointer-events-none xl:translate-x-full' 
                : 'opacity-100 translate-x-0'
              }
            `}
           
          >
            {!location.pathname.includes("/blog") && (
              <TopPlay />
            )}
          </div>
        </div>

        {/* Lecteur de musique avec gestion de visibilité */}
        {isVisible && activeSong?.attributes?.name && (
          <div className={`
            transition-all duration-300 ease-in-out 
            min-h-[11rem] max-h-[12rem] sm:min-h-[12rem] sm:max-h-[14rem]
            fixed bottom-0 left-0 right-0 w-full z-50 items-center justify-between px-6 backdrop-blur-md bg-gradient-to-r from-black via-black/95 to-black rounded-t-3xl shadow-2xl border-t border-orange-500/30
            ${playerMinimized 
              ? 'transform translate-y-full opacity-0 pointer-events-none' 
              : 'transform translate-y-0 opacity-100'
            }
          `}>
            <MusicPlayer 
              onMinimize={hidePlayer}
              onToggle={togglePlayerVisibility}
              setIsVisible={setIsVisible}
            />
          </div>
        )}

        {/* Icône flottante pour réafficher le lecteur */}
        {isVisible && activeSong?.attributes?.name && playerMinimized && (
          <button
            onClick={showPlayer}
            className="fixed bottom-6 right-6 h-24 z-50 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-full shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-110 group border-2 border-blue-500/40"
            aria-label="Afficher le lecteur de musique"
          >
            {/* Icône de musique */}
            <svg 
              className="w-6 h-6" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            
            {/* Animation d'onde sonore */}
            <div className="absolute -top-1 -right-1 flex space-x-0.5">
              <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
              <div className="w-1 h-2 bg-white rounded-full animate-pulse delay-100"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Afficher le lecteur
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
            </div>
          </button>
        )}

        {/* Indicateur de chanson en cours (version minimale) */}
        {isVisible && activeSong?.attributes?.name && playerMinimized && (
          <div className="fixed bottom-6 left-6 z-40 bg-black/90 h-10 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg shadow-orange-500/20 max-w-xs border border-blue-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded flex-shrink-0 flex items-center justify-center border border-blue-500/40">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{activeSong?.attributes?.name}</p>
                <p className="text-xs text-gray-300 truncate">{activeSong?.attributes?.artist?.data?.attributes?.name}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;