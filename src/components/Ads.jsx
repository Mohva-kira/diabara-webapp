import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_FILE_URL;
const DEFAULT_IMAGE = "https://via.placeholder.com/300x200?text=Diabara+TV"; // Image par défaut

const Ads = ({ image, title, description, url, artist }) => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Vérification de l'URL de l'image
  const getImageUrl = () => {
    if (imageError) return DEFAULT_IMAGE;
    
    if (!image) return DEFAULT_IMAGE;
    
    // Si l'image commence déjà par http:// ou https://, l'utiliser directement
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    // Si l'image commence par /, construire l'URL complète
    if (image.startsWith('/')) {
      return `${API_URL}${image}`;
    }
    
    // Sinon, ajouter le préfixe API_URL
    return `${API_URL}/${image}`;
  };

  const imageUrl = getImageUrl();
  console.log("Ads imageUrl", imageUrl);

  const handleCount = () => {
    setCount(count + 1);

    if (count > 3) {
      navigate("/artists/" + artist?.id);
    }
  };

  const handleImageError = () => {
    console.warn("Image failed to load, using default");
    setImageError(true);
  };

  return (
    <div
      className="w-full h-full min-h-[300px] cursor-pointer relative rounded-lg overflow-hidden"
      onClick={() => handleCount()}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "300px",
      }}>
      {/* Image de fallback si l'image de fond ne charge pas */}
      <img
        src={imageUrl}
        alt={title || "Publicité"}
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        onError={handleImageError}
        style={{ display: 'none' }}
      />
      
      {count <= 3 ? (
        <a
          href="https://www.effectiveratecpm.com/dk6epffzw?key=d70309a31870584c5914e216f01fb799"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer w-full h-full block"
          onClick={(e) => e.stopPropagation()}>
          <div className="w-full h-full flex justify-end items-end p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
            <div className="text-right">
              {title && (
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {title}
                </h1>
              )}
              {description && (
                <h3 className="text-sm md:text-base text-white drop-shadow-md">
                  {description}
                </h3>
              )}
            </div>
          </div>
        </a>
      ) : (
        <div className="w-full h-full flex justify-end items-end p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
          <div className="text-right">
            {title && (
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {title}
              </h1>
            )}
            {description && (
              <h3 className="text-sm md:text-base text-white drop-shadow-md">
                {description}
              </h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Ads;
