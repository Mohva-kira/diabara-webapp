import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_FILE_URL;
const DEFAULT_IMAGE = "https://via.placeholder.com/300"; // Image par défaut

const Ads = ({ image, title, description, url, artist }) => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  // Vérification de l'URL de l'image
  const imageUrl = image ? `${API_URL}${image}` : DEFAULT_IMAGE;
  console.log("imageUrl", imageUrl);

  const handleCount = () => {
    setCount(count + 1);

    if (count > 3) {
      navigate("/artists/" + artist?.id);
    }
  };
  return (
    true? 
    <a
          href="https://www.effectiveratecpm.com/dk6epffzw?key=d70309a31870584c5914e216f01fb799"
          target="_blank"
          className="cursor-pointer h-full">
      <div class="max-w-lg h-full container bg-white rounded-xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl">
    <div>
      <span class="text-white text-xs font-bold rounded-lg bg-green-500 inline-block mt-4 ml-4 py-1.5 px-4 cursor-pointer overflow-hidden">{artist?.attributes?.name}</span>  
      <h1 class="text-lg mt-2 ml-4 font-bold text-gray-800 cursor-pointer hover:text-gray-900 transition duration-100 overflow-hidden">{title}</h1>
      {/* <p class="ml-4 mt-1 mb-2 text-gray-700 hover:underline cursor-pointer">#by {artist?.attributes?.name}</p>  */}
    </div>
    <img class="w-full cursor-pointer h-full object-cover" src={`${imageUrl}`} alt="" />

  </div> </a>: (
    <div
      className="w-full h-full cursor-pointer"
      onClick={() => handleCount()}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {count <= 3 ? (
        <a
          href="https://www.effectiveratecpm.com/dk6epffzw?key=d70309a31870584c5914e216f01fb799"
          target="_blank"
          className="cursor-pointer h-full">
          <div className="w-full h-full flex justify-end items-end p-2 bg-black bg-opacity-50">
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              <h3 className="text-sm text-white">{description}</h3>
            </div>
          </div>
        </a>
      ) : (
        <div className="w-full h-full flex justify-end items-end p-2 bg-black bg-opacity-50">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <h3 className="text-sm text-white">{description}</h3>
          </div>
        </div>
      )}
    </div>)
  );
};

export default Ads;
