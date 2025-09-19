import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { playPause, setActiveSong } from "../redux/features/playerSlice";
import { useGetSongsQuery } from "../redux/services/songsApi";
import PlayPause from "./PlayPause";

import { useLiveQuery } from "dexie-react-hooks";
import "swiper/css";
import "swiper/css/free-mode";
import pub from "../assets/himra.jpeg";
import { db } from "../db/db";
import { useGetArtistsQuery } from "../redux/services/artistApi";
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
    <h3 className="fot-bold text-base text-white mr-3">{i + 1}.</h3>
    <div className="flex-1 flex flex-row justify-between items-center">
      <img
        src={
          onLine
            ? `https://api.diabara.tv${song?.attributes?.cover?.data && song?.attributes?.cover?.data[0]?.attributes?.url} `
            : `${song.attributes && song.attributes.cover}`
        }
        alt=""
        className="w-20 h-20 rounded-lg"
      />

      <div className="flex-1 flex-col justify-center mx-3">
        <Link to={`/songs/${song.id}`}>
          <p className="text-xl font-bold line-clamp-1 text-white">
            {song?.attributes.name}
          </p>
        </Link>
        <Link
          to={`/artists/${song.attributes.artist && song.attributes.artist?.data?.id}`}>
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

const TopPlay = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: songData } = useGetSongsQuery();
  const { data: artistData } = useGetArtistsQuery();
  const indexedSongs = useLiveQuery(() => db.songs.toArray());
  const indexedArtist = useLiveQuery(() => db.artists.toArray());
  const [status, setStatus] = useState();

  const divRef = useRef(null);

  async function addArtists({
    name,
    image,
    date_naissance,
    adresse,
    pays,
    ville,
    email,
    biographie,
    genres,
  }) {
    var id;
    try {
      if (name && image) {
        id = await db.streams.add({
          name,
          image,
          date_naissance,
          adresse,
          pays,
          ville,
          email,
          biographie,
          genres,
        });
      } else {
        alert(" provide name and image field of artists ");
      }
      setStatus(`Student ${name} successfully added. Got id ${id}`);
      setName("");
      setAge(defaultAge);
    } catch (error) {
      setStatus(`Failed to add ${name}: ${error}`);
    }
  }

  async function addSongs({
    id,
    name,
    audio,
    artist,
    date_de_sortie,
    cover,
    genre,
    pays,
    ville,
    album,
  }) {
    var id;
    try {
      if (name && audio) {
        id = await db.songs.add({
          name,
          audio,
          cover,
          date_de_sortie,
          artist,
          album,
          pays,
          ville,
        });
      } else {
        alert(" provide name and audio field of song ");
      }
      setStatus(`Student ${name} successfully added. Got id ${id}`);
      setName("");
      setAge(defaultAge);
    } catch (error) {
      setStatus(`Failed to add ${name}: ${error}`);
    }
  }
  useEffect(() => {
    if (artistData?.data.length > 0) {
      if (!indexedArtist || indexedArtist.length === 0) {
        artistData?.data.map((item) => {
          addArtists(item.attributes);
        });
      }
    }
  }, [artistData, songData]);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const onLine = window.navigator.onLine;
  const toSort = onLine
    ? songData && [...songData?.data]
    : indexedSongs &&
      indexedSongs.map((item, index) => ({ id: index, attributes: item }));
  const topPlays = toSort
    ?.sort((a, b) => (a.itemM > b.itemM ? 1 : -1))
    .slice(0, 5);
  const data = songData?.data;

  const toSortArtist = artistData && [...artistData?.data];
  const TopArtists = toSortArtist
    ?.sort((a, b) => (a.itemM > b.itemM ? 1 : -1))
    .slice(0, 5);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };
  const handlePlayClick = (song, i) => {
    console.log(activeSong);
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  return (
    <div
      ref={divRef}
      className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[400px] w-screen px-2 flex flex-col">
      <div className="w-full  flex-col md:flex hidden">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-white font-bold text-xl md:text-2xl">
            Top Classements
          </h2>
          <Link to="/top-charts">
            <p className="text-gray-300 text-sm md:text-base cursor-pointer">
              Voir plus
            </p>
          </Link>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={15}
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className="mt-4 w-full">
          {topPlays?.map((song, i) => (
            <SwiperSlide
              key={song.id}
              className="shadow-lg rounded-2xl animate-slideright">
              <TopChartCard
                key={song.id}
                song={song}
                i={i}
                isPlaying={isPlaying}
                activeSong={activeSong}
                handlePauseClick={handlePauseClick}
                handlePlayClick={() => handlePlayClick(song, i)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="w-full flex flex-col mt-8">
        <div className="flex flex-row justify-between items-center ">
          <h2 className="text-white font-bold text-2xl">Top Artists</h2>
          <Link to="/top-artists">
            <p className="text-gray-300 text-base cursor-pointer">Voir plus</p>
          </Link>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={15}
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className="mt-4">
          {TopArtists?.map((artist, i) => (
            <SwiperSlide
              key={artist.id}
              className="shadow-lg rounded-full animate-slideright"
              style={{ width: "100px", height: "100px" }}>
              {" "}
              {/* Taille fixe pour chaque image */}
              <Link to={`/artists/${artist?.id}`}>
                <img
                  src={`https://api.diabara.tv${artist?.attributes?.image?.data[0]?.attributes?.url}`}
                  alt={artist?.attributes?.name || "Artist"}
                  className="rounded-full w-full h-full object-cover" // Assure que l'image remplit l'espace
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="lg:h-fit lg:w-full lg:block hidden">
        <div className="p-5 rounded-2xl">
          <img src={pub} alt="" className="object-cover rounded-2xl h-fit " />
        </div>
      </div>
    </div>
  );
};

export default TopPlay;
