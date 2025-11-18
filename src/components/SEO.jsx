import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Diabara TV - La musique au bout des doigts',
  description = 'Découvrez la meilleure musique africaine sur Diabara TV. Streaming musical, découverte d\'artistes et playlists personnalisées.',
  image = 'https://diabara.tv/logo.png',
  url = 'https://diabara.tv',
  type = 'website',
  siteName = 'Diabara TV'
}) => {
  // S'assurer que l'URL est absolue
  const absoluteUrl = url.startsWith('http') ? url : `https://diabara.tv${url}`;
  
  // S'assurer que l'image est une URL absolue et accessible publiquement
  const absoluteImage = (() => {
    if (!image) return 'https://diabara.tv/logo.png';
    
    // Si c'est déjà une URL complète avec protocole
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    // Si c'est une URL sans protocole (commence par //)
    if (image.startsWith('//')) {
      return `https:${image}`;
    }
    
    // Si c'est une URL relative qui commence par /
    if (image.startsWith('/')) {
      // Si ça contient déjà api.diabara.tv, utiliser directement
      if (image.includes('api.diabara.tv')) {
        return `https://api.diabara.tv${image.replace(/^.*?\/uploads/, '/uploads')}`;
      }
      // Sinon, ajouter le domaine approprié
      return image.includes('/uploads/') || image.includes('/files/')
        ? `https://api.diabara.tv${image}`
        : `https://diabara.tv${image}`;
    }
    
    // Si ça contient déjà api.diabara.tv ou diabara.tv, nettoyer
    if (image.includes('api.diabara.tv') || image.includes('diabara.tv')) {
      const cleaned = image.replace(/^https?:\/\//, '').replace(/^\/\//, '');
      return `https://${cleaned}`;
    }
    
    // Par défaut, supposer que c'est un chemin relatif vers l'API
    return `https://api.diabara.tv${image.startsWith('/') ? image : `/${image}`}`;
  })();

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={absoluteUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:site" content="@diabaratv" />
      <meta name="twitter:creator" content="@diabaratv" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="French" />
      <meta name="author" content="Diabara TV" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={absoluteUrl} />
    </Helmet>
  );
};

export default SEO;

