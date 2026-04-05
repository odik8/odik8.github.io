import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import './normalize.css';
import './index.css';

import { EffectFade, Mousewheel, Pagination } from 'swiper/modules';

export default function App() {
  return (
    <Swiper
      pagination={{
        enabled: true,
        clickable: true,
        el: ".home-swiper__pagination",
        bulletClass: "home-swiper__bullet",
        bulletActiveClass: "home-swiper__bullet--active"
      }}
      // effect={"fade"}
      mousewheel={{
        enabled: true,
        forceToAxis: true,
      }}
      direction={"vertical"}
      modules={[Pagination, Mousewheel, EffectFade]}
      className="home-swiper"
    >
      <SwiperSlide className="home-swiper__slide">
        <section className="hero section">
          <div className="hero__inner section__inner">
            <div className="hero__info">
              <h2>
                <span className="primary-color">Hello!</span> My name is Odyssey Meltonyan.<br/>
                I am a frontend developer
              </h2>
              <a
                class="button"
                href="/"
              >
                Let's check
              </a>
            </div>
            <div className="hero__scence">
              @
            </div>
          </div>
        </section>
      </SwiperSlide>
      <SwiperSlide className="home-swiper__slide">
        <h2>Skills</h2>
        <p>
          Section about my skills
        </p>
      </SwiperSlide>
      <SwiperSlide className="home-swiper__slide">
        <Swiper
          slidesPerView={1}
          direction={"horizontal"}
          mousewheel={{
            enabled: true,
            forceToAxis: true,
          }}
          modules={[Mousewheel]}
        >
          <SwiperSlide>1</SwiperSlide>
          <SwiperSlide>2</SwiperSlide>
        </Swiper>
      </SwiperSlide>
      <SwiperSlide className="home-swiper__slide">
        <h2>Contacts</h2>
        <p>
          Section about my contacts
        </p>
      </SwiperSlide>
      <div className="home-swiper__pagination"></div>
    </Swiper>
  );
}
