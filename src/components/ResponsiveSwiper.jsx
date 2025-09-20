import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, FreeMode, Controller, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const ResponsiveSwiper = ({ promotionData, controlledSwiper }) => {
  return (
    <div className="flex justify-center items-center w-full h-full py-2 px-4 rounded-xl">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, FreeMode, Controller, Autoplay]}
        slidesPerView={1} // Par défaut, un seul slide visible
        spaceBetween={15}
        freeMode={true}
        centeredSlides={true}
        navigation={true}
        centeredSlidesBounds={true}
        controller={{ control: controlledSwiper }}
        className="w-full h-full"
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }} // Activation de l'autoplay avec options
        breakpoints={{
          640: { slidesPerView: 1 }, // Mobile
          768: { slidesPerView: 2 }, // Tablette
          1024: { slidesPerView: 3 }, // Desktop
        }}
      >
        {/* Génération des slides à partir des données */}
        {promotionData?.data?.map((item, index) => (
          <SwiperSlide
            key={index}
            className="text-white w-full h-auto p-4 flex flex-col justify-between items-center bg-gray-900 rounded-lg shadow-lg"
          >
            <Ads
              title={item?.attributes?.title}
              description={item?.attributes?.description}
              image={item?.attributes?.image?.data[0]?.attributes?.url}
              url={'aaa'}
              artist={item?.attributes?.artist?.data}
            />
          </SwiperSlide>
        ))}

        {/* Slide avec le lecteur vidéo */}
        <SwiperSlide className="w-full h-auto p-4 flex justify-center items-center bg-gray-800 rounded-lg shadow-lg">
          <VideoPlayer />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ResponsiveSwiper;
