import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { selectCurrentToken } from "../redux/features/auth/authSlice";

import React, { useEffect, useState } from "react";
import {
  A11y,
  Autoplay,
  Controller,
  FreeMode,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGetPromotionQuery } from "../redux/services/promo";
import { useGetSubscriptionQuery } from "../redux/services/subscription";
import { isSubEnded } from "../utils/validity";
import Ads from "./Ads";
import Modal2 from "./Modal _2";

const RequireSub = () => {
  const dispatch = useDispatch();
  const stateToken = selectCurrentToken();
  const storageAuth = JSON.parse(localStorage.getItem("auth"));
  console.log("useer !!!", storageAuth);
  const [controlledSwiper, setControlledSwiper] = useState(null);
  const [count, setCount] = useState(0);
  const [isValide, setIsValide] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { data, isLoading, isFetching, isSuccess } = useGetSubscriptionQuery(
    storageAuth.user.id
  );

  const {
    data: promotionData,
    isSuccess: isPromotionSuccess,
    isFetching: isPromotionFetching,
  } = useGetPromotionQuery();

  console.log(" subscription data", data);

  const handleCount = () => {
    setCount(count + 1);

    if (count > 3) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      isSuccess && data ? setIsValide(isSubEnded(data.data)) : null;
    }, 30);
  }, [data]);

  const token = storageAuth?.jwt;
  console.log("token !!!", token);
  const location = useLocation();
  setTimeout(() => {
    setIsVisible(isValide ? false : true);
  }, 180000);

  return isValide ? (
    <Outlet />
  ) : (
    <>
      {/* { alert('Youpii')} */}
      <Outlet />
      <Modal2 isActive={isVisible} setIsActive={setIsVisible}>
        <div className="justify-center h-full items-center flex md:w-[90%] md:h-[100%] sm:w-[90%] sm:h-[100%] rounded-xl">
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
            slidesPerView="1"
            spaceBetween={15}
            freeMode
            centeredSlides
            navigation
            centeredSlidesBounds
            controller={{ control: controlledSwiper }}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            className="h-full w-full"
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}>
            {promotionData?.data && promotionData.data.length > 0 ? (
              promotionData.data.map((item, index) => (
                <SwiperSlide
                  key={item.id || index}
                  className="text-white w-full flex justify-center items-center h-full min-h-[300px]">
                  {count <= 3 ? (
                    <a
                      className="w-full h-full flex justify-center items-center"
                      href="https://www.effectiveratecpm.com/dk6epffzw?key=d70309a31870584c5914e216f01fb799"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}>
                      <Ads
                        title={item?.attributes?.title}
                        description={item?.attributes?.description}
                        image={
                          item?.attributes?.image?.data?.[0]?.attributes?.url
                            ? `${item.attributes.image.data[0].attributes.url}`
                            : null
                        }
                        url={item?.attributes?.url || "#"}
                        artist={item?.attributes?.artist?.data}
                      />
                    </a>
                  ) : (
                    <div className="w-full h-full">
                      <Ads
                        title={item?.attributes?.title}
                        description={item?.attributes?.description}
                        image={
                          item?.attributes?.image?.data?.[0]?.attributes?.url
                            ? `${item.attributes.image.data[0].attributes.url}`
                            : null
                        }
                        url={item?.attributes?.url || "#"}
                        artist={item?.attributes?.artist?.data}
                      />
                    </div>
                  )}
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide className="text-white w-full flex justify-center items-center h-full min-h-[300px]">
                <div className="text-center p-4">
                  <p className="text-gray-400">Aucune publicité disponible</p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </Modal2>
    </>
  );
};

export default RequireSub;
