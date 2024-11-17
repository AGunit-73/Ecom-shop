"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Head from "next/head";
import "swiper/css";
import "swiper/css/pagination";

const AboutPage = () => {
  const team = [
    { name: "TEAM ISOLORA", role: "CEO" },
    { name: "TEAM ISOLORA", role: "CTO" },
    { name: "TEAM ISOLORA", role: "CMO" },
  ];

  return (
    <>
      <Head>
        <title>About Us - Isolora</title>
        <meta
          name="description"
          content="Learn more about Isolora and our mission to redefine fashion."
        />
      </Head>

      <div className="py-12 px-4 md:px-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 relative group">
          <span className="inline-block">
            <span className="text-blue-600 group-hover:text-blue-400 transition-colors duration-300">
              About Us
            </span>
          </span>
          <div className="w-0 h-1 bg-blue-600 mt-2 mx-auto group-hover:w-full transition-all duration-500"></div>
        </h1>

        <p className="text-lg mb-8 text-gray-600">
          Isolora is dedicated to bringing you the finest collection of fashion and
          accessories. Our mission is to redefine fashion for everyone. We believe in
          blending style and comfort, and we aim to provide the best shopping experience
          for our customers.
        </p>

        <div className="mb-12">
          <Swiper
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="w-full h-[300px] md:h-[400px]"
          >
            <SwiperSlide>
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{
                  backgroundImage: "url('/image1.jpg')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
                <div className="flex items-center justify-center h-full text-white text-center px-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Our Mission</h2>
                    <p className="text-lg">
                      To make fashion accessible and redefine the way people shop.
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            {/* Additional slides */}
          </Swiper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="text-center hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-2xl font-bold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AboutPage;
