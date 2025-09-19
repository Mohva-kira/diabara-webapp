import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/bundle";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useLiveQuery } from "dexie-react-hooks";
import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/react/';
import {
  A11y,
  Autoplay,
  Controller,
  FreeMode,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper";

import { genres } from "../assets/constants";
import {
  Error,
  Loader,
  Scrollable,
  SongCard,
  VideoPlayer,
} from "../components";
import { selectGenreListId } from "../redux/features/playerSlice";
import { useGetSongsQuery } from "../redux/services/songsApi";

import ReactGA from "react-ga4";
import Introduction from "../components/Introduction";
import { db } from "../db/db";
import { setSongs } from "../redux/features/songsSlice";
import { useGetStreamsQuery } from "../redux/services/streams";
import {
  useAddVisitorMutation,
  useGetVisitorsByUUIDQuery,
} from "../redux/services/visitor";

// import './index.css'
// import Data from '../../data'
import { useGetPromotionQuery } from "../redux/services/promo";
import Ads from "./../components/Ads";
import PlayedList from "../components/PlayedList";

const Discover = () => {
  ReactGA.send({
    hitType: "pageview",
    page: "/",
    title: "Discovery - Decouvertes",
  });

  const dispatch = useDispatch();
  const indexedSongs = useLiveQuery(() => db.songs.toArray());
  const indexedStreams = useLiveQuery(() => db.streamsData.toArray());
  const [firstVisitData, setFirstVisitData] = useState({});

  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  const { activeSong, isPlaying, genreListId } = useSelector(
    (state) => state.player
  );
  const { data, isSuccess, isFetching, isLoading, error } = useGetSongsQuery();

  const {
    data: streamsData,
    isSuccess: isStreamSuccess,
    isFetching: isStreamFetching,
    isError: isStreamError,
    currentData: streamCurrent,
    refetch: refetchStreams,
  } = useGetStreamsQuery("");
  const {
    data: promotionData,
    isSuccess: isPromotionSuccess,
    isFetching: isPromotionFetching,
  } = useGetPromotionQuery();
  const [isVisited, setIsVisited] = useState(false);

  const { userAgent } = window.navigator;
  const { platform } = window.navigator;
  const randomString =
    Math.random().toString(20).substring(2, 14) +
    Math.random().toString(20).substring(2, 14);

  const deviceID = !localStorage.getItem("uuid")
    ? localStorage.setItem("uuid", `${randomString}`)
    : localStorage.getItem("uuid");
  // console.log('device Id', deviceID);
  const deviceInfo = `${userAgent}-${platform}`;
  const {
    data: visitorData,
    isLoading: visitorLoading,
    isFetching: visitorFetching,
    isSuccess: visitorSuccess,
  } = useGetVisitorsByUUIDQuery(deviceID);

  const [addVisitor] = useAddVisitorMutation();

  const navigate = useNavigate();

  const [controlledSwiper, setControlledSwiper] = useState(null);
  const genreTitle = "Pop";
  const artistId = useParams();
  const indexedSongReverse = indexedSongs && indexedSongs;
  const { onLine } = window.navigator;

  const { geolocation } = window.navigator;

  const realData = window.navigator.onLine
    ? data && [...data?.data].reverse()
    : indexedSongReverse?.map((item, index) => ({
        id: index,
        attributes: item,
      }));

  const successCallback = (position) => {
    console.log(position);
  };

  useEffect(() => {
    setFirstVisitData({
      data: {
        uuid: deviceID,
        visited_date: new Date(),
        visited: true,
        location: "",
        device_info: deviceInfo,
      },
    });
  }, []);

  console.log("Indexed", indexedStreams);

  useEffect(() => {
    const result = visitorData?.data[0].attributes.uuid === deviceID;
    setIsVisited(result);
  }, [visitorData?.data.length > 0]);

  useEffect(() => {
    dispatch(setSongs(data));
  }, [isSuccess]);

  console.log("promotion", promotionData);

  if (isFetching) return <Loader title="loading songs...." />;

  if (error) return <Error />;

  // console.log("location", geolocation.getCurrentPosition(successCallback));

  return (
    <div className="flex flex-col">
      {!isVisited && (
        <Introduction
          setIsVisited={setIsVisited}
          isVisited={isVisited}
          firstVisitData={firstVisitData}
          addVisitor={addVisitor}
          visitorData={visitorData}
        />
      )}
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">
          {" "}
          Discover {genreTitle}{" "}
        </h2>
        <select
          name=""
          id=""
          onChange={(e) => {
            dispatch(selectGenreListId(e.target.value));
          }}
          value={genreListId || "pop"}
          className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mt-0 mt-5">
          {genres.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {" "}
              {genre.title}{" "}
            </option>
          ))}
        </select>
      </div>
      {status}
      <div className="flex max-w-xxl h-[350px] flex-col mb-10 inset-0 rounded-xl justify-center items-center ">
        <div className=" md:w-[720px] w-[360px] h-full   mx-auto">
          <Swiper
            modules={[
              Navigation,
              Pagination,
              Scrollbar,
              A11y,
              FreeMode,
              Controller,
              Autoplay,
            ]}
            
            freeMode={true}
            spaceBetween={20} // Espacement entre les slides
            slidesPerView={2} // Nombre par défaut pour petits écrans
            navigation={true}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }} // Activation de l'autoplay
          >
            {promotionData?.data?.map((item, index) => (
              <SwiperSlide
                key={index}
                className="text-white w-full h-full md:h-full p-4 flex justify-between items-center">
                <Ads
                  title={item?.attributes?.title}
                  description={item?.attributes?.description}
                  image={item?.attributes?.image?.data[0]?.attributes?.url}
                  url="aaa"
                  artist={item?.attributes?.artist?.data}
                />
              </SwiperSlide>
            ))}

            <SwiperSlide className="w-full h-full p-4 flex justify-between items-center">
              <VideoPlayer />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      {isLoading || isFetching || !realData ? (
        <Loader />
      ) : (
        <Scrollable data={realData}>
          <div className="mt-6 mb-10 max-w-4xl">
            <h2 className="text-white font-bold text-2xl px-2 mb-4">
              {" "}
              Les recents{" "}
            </h2>

             <PlayedList />
         
          </div>

          <div className="mt-6">
            <h2 className="text-white font-bold text-2xl px-2 mb-4">
              {" "}
              Les choix du peuple{" "}
            </h2>

            <div className="flex flex-wrap sm:justify-start justify-center gap-8 py-2">
              {realData?.slice(8).map((song, i) => (
                <SongCard
                  key={song.id}
                  song={song}
                  i={i}
                  isPlaying={isPlaying}
                  activeSong={activeSong}
                  data={realData}
                  isStreamFetching={isStreamFetching}
                  refetchStreams={refetchStreams}
                  streams={
                    onLine
                      ? streamsData?.data.filter(
                          (item) => item?.attributes?.song?.data?.id === song?.id
                        )
                      : indexedStreams.filter(
                          (item) => item?.song && item?.song?.data?.id === song?.id
                        )
                  }
                />
              ))}
            </div>
          </div>
        </Scrollable>
      )}
    </div>
  );
};

export default Discover;
