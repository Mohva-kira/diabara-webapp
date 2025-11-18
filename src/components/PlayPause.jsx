import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';

const PlayPause = ({ isPlaying, activeSong, song, handlePause, handlePlay }) => (
  <div className="flex items-center justify-center">
    {isPlaying && activeSong?.attributes.name === song?.attributes.name ? (
      <FaPauseCircle
        size={50}
        className="text-white hover:text-orange-400 transition-colors cursor-pointer drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]"
        onClick={(e) => {
          e.stopPropagation();
          handlePause();
        }}
      />
    ) : (
      <FaPlayCircle
        size={50}
        className="text-white hover:text-orange-400 transition-colors cursor-pointer drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]"
        onClick={(e) => {
          e.stopPropagation();
          handlePlay();
        }}
      />
    )}
  </div>
);

export default PlayPause;
