import React, { useEffect } from "react";
import { logEvent } from "../../analytics";

const { onLine } = window.navigator;
const API_FILE_URL = import.meta.env.VITE_API_FILE_URL;

const Track = ({ isPlaying, isActive, activeSong }) => {
  useEffect(() => {
    logEvent(
      "song",
      "song played",
      `${activeSong?.attributes?.name} - ${activeSong?.attributes?.artist?.data?.attributes?.name}`
    );
  }, [activeSong]);

  return (
    <div className="flex-1 flex items-center w-full justify-start">
      <div
        className={`${isPlaying && isActive ? "animate-[spin_3s_linear_infinite]" : ""} hidden sm:block h-16 w-16 mr-4`}>
        <img
          src={
            onLine && activeSong?.attributes?.cover?.data && Array.isArray(activeSong.attributes.cover.data) && activeSong.attributes.cover.data.length > 0 && activeSong.attributes.cover.data[0]?.attributes?.url
              ? `${API_FILE_URL}${activeSong.attributes.cover.data[0].attributes.url}`
              : activeSong?.attributes?.cover || ''
          }
          alt="cover art"
          className="rounded-full"
        />
      </div>
      <div className="w-[50%]">
        <p className="truncate text-white font-bold text-lg">
          {activeSong?.attributes.name
            ? activeSong?.attributes.name
            : "No active Song"}
        </p>
        <p className="truncate text-gray-300">
          {activeSong?.attributes?.artist
            ? activeSong?.attributes?.artist.data.attributes.name
            : "No active Song"}
        </p>
      </div>
    </div>
  );
};
export default Track;
