import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import usePreventAutoScroll from './usePreventAutoScroll';

const usePageScrollProtection = (options = {}) => {
  const {
    autoProtectOnMount = true,
    autoProtectOnRouteChange = true,
    protectionDelay = 100,
    ...preventScrollOptions
  } = options;

  const location = useLocation();
  const scrollProtection = usePreventAutoScroll(preventScrollOptions);

  // Protection automatique au montage du composant
  useEffect(() => {
    if (autoProtectOnMount) {
      const timer = setTimeout(() => {
        scrollProtection.preventAutoScroll();
      }, protectionDelay);

      return () => clearTimeout(timer);
    }
  }, [autoProtectOnMount, protectionDelay, scrollProtection.preventAutoScroll]);

  // Protection automatique lors des changements de route
  useEffect(() => {
    if (autoProtectOnRouteChange) {
      scrollProtection.forceScrollReset();
      
      const timer = setTimeout(() => {
        scrollProtection.preventAutoScroll();
      }, protectionDelay);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, autoProtectOnRouteChange, protectionDelay, scrollProtection]);

  return scrollProtection;
};

export default usePageScrollProtection;