"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const HeroSwiper = () => {
  return (
    <section className="bg-gray-100">
      <Swiper
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Pagination, Autoplay]}
        className="w-full h-[300px] md:h-[400px]"
      >
        <SwiperSlide>
          <div
            className="flex items-center justify-center h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/slide-2.jpg')",
            }}
          >
            <div className="text-white text-center bg-black bg-opacity-50 p-6 rounded-lg">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Discover Your Style
              </h1>
              <p className="text-lg">
                Shop the latest collections and redefine fashion.
              </p>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div
            className="flex items-center justify-center h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/slide-1.jpg')",
            }}
          >
            <div className="text-white text-center bg-black bg-opacity-50 p-6 rounded-lg">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Exclusive Offers
              </h1>
              <p className="text-lg">Up to 50% off on your favorite brands.</p>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div
            className="flex items-center justify-center h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/slide-3.jpg')",
            }}
          >
            <div className="text-white text-center bg-black bg-opacity-50 p-6 rounded-lg">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Shop Now, Pay Later
              </h1>
              <p className="text-lg">
                Flexible payment options available for everyone.
              </p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default HeroSwiper;
