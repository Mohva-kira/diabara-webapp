// import { View, Text } from 'react-native'
import React from 'react'
import { use } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({items = [], imageBaseUrl= ""}) => {

    const item = items && items.length ? items[1] : null;


    // Safe accessors
    const title = item?.attributes?.title ?? "Titre inconnu";
    const description = item?.attributes?.description ?? "";
    const artistName = item?.attributes?.artist?.data?.attributes?.name ?? "";
    const plays = item?.attributes?.plays ?? "1 Million Plays"; // fallback
    const path = item?.attributes.url ?? "#";
    // image path selection (use medium or url)
    const imageData = item?.attributes?.image?.data?.[0]?.attributes ?? null;
    const imageUrl = imageData
      ? (imageBaseUrl.replace(/\/$/, "") + (imageData.url ?? imageData.formats?.medium?.url ?? ""))
      : ""

      const navigate = useNavigate();
  return (
    <section className="relative w-full overflow-hidden h-full bg-black text-white">
      {/* decorative gradient overlay (left) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none"></div>

      <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-6 flex items-center">
        {/* Left content */}
        <div className="w-full lg:w-1/2 z-10 space-y-3">
          <p className="text-xs text-gray-300 uppercase tracking-wider">
            Trending New Hits
          </p>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300">
            <span className="font-medium">{artistName}</span>
            {artistName && " • "}
            <span className="text-gray-400">{plays}</span>
          </p>

          <p className="max-w-lg text-sm text-gray-300 line-clamp-2">
            {description}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 hover:bg-sky-500 active:scale-[0.98] transition-transform px-4 py-2 text-sm text-white font-medium shadow-lg"
              aria-label={`Écouter ${title}`}
              onClick={() => {navigate(path)}}
            >
              {/* play icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M4.5 3.5v13l11-6.5-11-6.5z" />
              </svg>
              Écouter
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/20 hover:bg-white/5 transition"
              aria-label="Ajouter aux favoris"
            >
              {/* heart icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20.8 4.6a5.6 5.6 0 0 0-7.9 0L12 5.5l-0.9-0.9a5.6 5.6 0 1 0-7.9 7.9L12 21l8.8-8.5a5.6 5.6 0 0 0 0-7.9z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right - image container */}
        <div className="block lg:w-1/2 relative h-full">
          {/* vertical dots on the far right like the reference (decorative) */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-2">
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
          </div>

          {/* image: placed to the right, cover, grayscale and contrast similar to reference */}
          <div className="absolute inset-0 w-full h-full">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={imageData?.alternativeText ?? `${artistName} cover`}
                className="object-cover object-center h-full w-full rounded-lg grayscale contrast-[0.9] opacity-90"
              />
            ) : (
              <div className="h-full w-full bg-gray-800/60 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
          </div>

          {/* subtle gradient fade on left of image to blend with content */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none rounded-lg"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection