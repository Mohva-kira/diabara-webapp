// File: src/components/SocialShare.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon
} from 'react-share';
import styled from 'styled-components';

const ShareContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  align-items: center;
  
  button {
    transition: transform 0.2s ease;
    cursor: pointer;
    
    &:hover {
      transform: scale(1.1);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
`;

const SocialShare = ({ url, image, title, description }) => {
  // S'assurer que l'URL est absolue et correctement formatée
  const shareUrl = url.startsWith('http') ? url : `https://diabara.tv${url}`;
  
  // Formater le texte pour Facebook et Twitter (combiner titre et description)
  const shareText = title && description 
    ? `${title} - ${description}`.substring(0, 240)
    : title || description || 'Découvrez cette musique sur Diabara TV';
  
  // Formater le texte pour Facebook (quote)
  const facebookQuote = shareText;
  
  // Formater le titre pour Twitter (limité à 280 caractères)
  const twitterTitle = shareText;
  
  // Nettoyer le hashtag (enlever caractères spéciaux et espaces)
  const hashtag = title 
    ? title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20) 
    : 'DiabaraTV';
  
  // S'assurer que l'image est une URL absolue et accessible publiquement
  const shareImage = (() => {
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
    <>
      <Helmet>
        {/* Open Graph pour Facebook */}
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title || 'Diabara TV'} />
        <meta property="og:description" content={description || 'La musique au bout des doigts'} />
        <meta property="og:image" content={shareImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:site_name" content="Diabara TV" />
        <meta property="og:locale" content="fr_FR" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={shareUrl} />
        <meta name="twitter:title" content={title || 'Diabara TV'} />
        <meta name="twitter:description" content={description || 'La musique au bout des doigts'} />
        <meta name="twitter:image" content={shareImage} />
      </Helmet>
      
      <ShareContainer>
        <FacebookShareButton
          url={shareUrl}
          quote={facebookQuote}
          hashtag={`#${hashtag}`}
          description={description}
          picture={shareImage}
          title={title}
        >
          <FacebookIcon size={36} round bgStyle={{ fill: '#1877F2' }} />
        </FacebookShareButton>
      
      <TwitterShareButton
        url={shareUrl}
        title={twitterTitle}
        via="diabaratv"
        hashtags={['DiabaraTV', hashtag].filter(Boolean)}
        related={['diabaratv']}
      >
        <TwitterIcon size={36} round bgStyle={{ fill: '#1DA1F2' }} />
      </TwitterShareButton>
      
      <LinkedinShareButton
        url={shareUrl}
        title={title || 'Diabara TV'}
        summary={description || 'La musique au bout des doigts'}
        source="Diabara TV"
      >
        <LinkedinIcon size={36} round bgStyle={{ fill: '#0077B5' }} />
      </LinkedinShareButton>
    </ShareContainer>
    </>
  );
};

SocialShare.propTypes = {
  url: PropTypes.string.isRequired,
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

SocialShare.defaultProps = {
  image: '',
  description: 'La musique au bout des doigts sur Diabara TV',
};

export default SocialShare;
