import { useRef, useCallback, useEffect, useState } from 'react';

const usePreventAutoScroll = (options = {}) => {
  const {
    enabled = true,
    protectionDuration = 2000,
    resetOnLocationChange = true,
    rootMargin = '0px 0px 100px 0px',
    debug = false
  } = options;

  const [scrollLocked, setScrollLocked] = useState(false);
  const [isProtectionActive, setIsProtectionActive] = useState(false);
  const containerRef = useRef(null);
  const cleanupTimeoutRef = useRef(null);
  const observerRef = useRef(null);

  // Fonction pour logger (si debug activé)
  const log = useCallback((message, ...args) => {
    if (debug) {
      console.log(`[usePreventAutoScroll] ${message}`, ...args);
    }
  }, [debug]);

  // Reset immédiat de tous les scrolls
  const forceScrollReset = useCallback(() => {
    log('Exécution du reset du scroll');
    
    // Reset window scroll
    if (window.scrollY > 0 || window.scrollX > 0) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    // Reset du container principal si spécifié
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollLeft = 0;
    }

    // Reset de tous les éléments scrollables
    const scrollableElements = document.querySelectorAll(
      '[class*="scroll"], [style*="overflow"], .overflow-auto, .overflow-y-auto, .overflow-x-auto'
    );
    
    scrollableElements.forEach((element, index) => {
      if (element.scrollTop > 0) {
        element.scrollTop = 0;
        log(`Reset scrollTop pour l'élément ${index}`);
      }
      if (element.scrollLeft > 0) {
        element.scrollLeft = 0;
        log(`Reset scrollLeft pour l'élément ${index}`);
      }
    });

    // Reset des éléments avec scroll personnalisé
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    log('Reset du scroll terminé');
  }, [log]);

  // Fonction principale pour empêcher le scroll automatique
  const preventAutoScroll = useCallback(() => {
    if (!enabled) return;

    log('Activation de la protection scroll');
    setIsProtectionActive(true);
    setScrollLocked(true);

    // Fonction pour bloquer les événements de scroll
    const preventScrollEvent = (e) => {
      if (scrollLocked) {
        e.preventDefault();
        e.stopPropagation();
        forceScrollReset();
        return false;
      }
    };

    // Fonction pour observer les mutations DOM
    const handleDOMMutation = (mutations) => {
      if (!scrollLocked) return;

      let shouldReset = false;
      
      mutations.forEach((mutation) => {
        // Vérifier les changements de style qui pourraient causer un scroll
        if (mutation.type === 'attributes' && 
           (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          shouldReset = true;
        }
        
        // Vérifier les nouveaux éléments ajoutés
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldReset = true;
        }
      });

      if (shouldReset) {
        log('Mutation DOM détectée, reset du scroll');
        forceScrollReset();
      }
    };

    // Reset initial
    forceScrollReset();

    // Ajouter les listeners d'événements
    const eventOptions = { passive: false, capture: true };
    window.addEventListener('scroll', preventScrollEvent, eventOptions);
    document.addEventListener('scroll', preventScrollEvent, eventOptions);
    window.addEventListener('wheel', preventScrollEvent, eventOptions);
    document.addEventListener('touchmove', preventScrollEvent, eventOptions);

    // Observer les mutations DOM
    if (window.MutationObserver) {
      observerRef.current = new MutationObserver(handleDOMMutation);
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'scrollTop', 'scrollLeft']
      });
    }

    // Nettoyer après la durée spécifiée
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }

    cleanupTimeoutRef.current = setTimeout(() => {
      log('Fin de la protection scroll');
      setScrollLocked(false);
      setIsProtectionActive(false);
      
      // Nettoyer les listeners
      window.removeEventListener('scroll', preventScrollEvent, eventOptions);
      document.removeEventListener('scroll', preventScrollEvent, eventOptions);
      window.removeEventListener('wheel', preventScrollEvent, eventOptions);
      document.removeEventListener('touchmove', preventScrollEvent, eventOptions);
      
      // Nettoyer l'observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    }, protectionDuration);

    // Retourner la fonction de nettoyage
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      window.removeEventListener('scroll', preventScrollEvent, eventOptions);
      document.removeEventListener('scroll', preventScrollEvent, eventOptions);
      window.removeEventListener('wheel', preventScrollEvent, eventOptions);
      document.removeEventListener('touchmove', preventScrollEvent, eventOptions);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [enabled, scrollLocked, protectionDuration, forceScrollReset, log]);

  // Fonction pour débloquer manuellement le scroll
  const unlockScroll = useCallback(() => {
    log('Déverrouillage manuel du scroll');
    setScrollLocked(false);
    setIsProtectionActive(false);
    
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }
    
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, [log]);

  // Fonction pour activer la protection manuellement
  const lockScroll = useCallback(() => {
    preventAutoScroll();
  }, [preventAutoScroll]);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    containerRef,
    scrollLocked,
    isProtectionActive,
    forceScrollReset,
    preventAutoScroll,
    unlockScroll,
    lockScroll
  };
};

export default usePreventAutoScroll;