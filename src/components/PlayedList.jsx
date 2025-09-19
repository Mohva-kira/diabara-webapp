import React from 'react'
import { useGetPlayedsByUUIDQuery, useGetPlayedsQuery } from '../redux/services/played';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from "swiper";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PlayPause from './PlayPause';
const { onLine } = window.navigator;

export const TopChartCard = ({
  song,
  i,
  isPlaying,
  activeSong,
  handlePauseClick,
  handlePlayClick,
}) => (
  <div className="w-full flex flex-row items-center hover:bg-[#4c426e] py-2 p-4 rounded-lg cursor-pointer mb-2">
    {console.log("song", song)}
    <h3 className="fot-bold text-base text-white mr-3">{i + 1}.</h3>
    <div className="flex-1 flex flex-row justify-between items-center">
      <img
        src={
          onLine
            ? `https://api.diabara.tv${song?.attributes?.cover?.data && song?.attributes?.cover?.data[0]?.attributes?.url} `
            : `${song?.attributes?.cover}`
        }
        alt=""
        className="w-20 h-20 rounded-lg"
      />

      <div className="flex-1 flex-col justify-center mx-3">
        <Link to={`/songs/${song?.data?.id}`}>
          <p className="text-xl font-bold line-clamp-1 text-white">
            {song?.attributes.name}
          </p>
        </Link>
        <Link
          to={`/artists/${song?.attributes.artist && song.attributes.artist?.data?.id}`}>
          <p className="text-base  text-gray-300 mt-1">
            {song?.attributes.artist &&
              song?.attributes.artist?.data?.attributes?.name}
          </p>
        </Link>
      </div>
    </div>
    <PlayPause
      isPlaying={isPlaying}
      activeSong={activeSong}
      song={song}
      handlePause={handlePauseClick}
      handlePlay={handlePlayClick}
    />
  </div>
);


const PlayedList = ({page, size}) => {
  const deviceId = localStorage.getItem("uuid");
    const dispatch = useDispatch();
    const { activeSong, isPlaying } = useSelector((state) => state.player);

    const {data, isLoading, isError, error} = useGetPlayedsByUUIDQuery(deviceId, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
    skip: !deviceId,
  });

   const handlePauseClick = () => {
      dispatch(playPause(false));
    };
    const handlePlayClick = (song, i) => {
      console.log(activeSong);
      dispatch(setActiveSong({ song, data, i }));
      dispatch(playPause(true));
    };
  
    console.log("played", data);

  return (
    <div className="">
       
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error: {error.message}</p>}
        {data && data.data.length > 0 ? (
          <Swiper
          slidesPerView={3}
           spaceBetween={20} // Espacement entre les slides
            
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className="mt-4 ">
            {data.data.map((played, index) => (
              <SwiperSlide
              key={played.id}
                 freeMode={true}
            spaceBetween={20} // Espacement entre les slides
            slidesPerView={2} // Nombre par défaut pour petits écrans
              className="shadow-lg rounded-2xl animate-slideright">
              <TopChartCard
                key={played?.id}
                song={played?.attributes?.song?.data}
                i={index}
                isPlaying={isPlaying}
                activeSong={activeSong}
                handlePauseClick={handlePauseClick}
                handlePlayClick={() => handlePlayClick(played?.attributes?.song?.data, index)}
              />
            </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>Musique non trouvée.</p>
        )}
      </div>

  )
}

export default PlayedList
