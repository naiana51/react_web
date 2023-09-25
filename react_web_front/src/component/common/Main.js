import { useState } from "react";
import "./main.css";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";

const Main = () => {
  const [swiper, setSwiper] = useState(null);
  const swiperParams = {
    navigation: true,
    onSwiper: setSwiper,
    autoplay: { delay: 2000, disableOnInteraction: false },
    loop: true,
  };
  SwiperCore.use([Autoplay]);
  return (
    <div className="main-slide">
      <Swiper {...swiperParams} ref={setSwiper}>
        <SwiperSlide>
          <img src="/img/img1.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/img/img2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/img/img3.jpg" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Main;
