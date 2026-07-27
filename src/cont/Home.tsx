import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useAuth } from '../comp/AuthProvider';


const Home = () => {
  const { member, isLoggedIn } = useAuth();

  console.log("현재 회원:", member);
  console.log("로그인 여부:", isLoggedIn);
  console.log(member?.authority);
  
  const banners = [
    {
      id: 1,
      image: "/images/book1.png",
    },
    {
      id: 2,
      image: "/images/book2.png",
    },
    {
      id: 3,
      image: "/images/book3.png",
    },
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop
    >
      {banners.map((banner) => (
        <SwiperSlide key={banner.id}>
          <img
            src={banner.image}
            alt="배너"
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Home;