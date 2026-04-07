import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import './normalize.css';
import './index.css';

import {
  EffectCreative, HashNavigation,
  Mousewheel,
  Pagination
} from 'swiper/modules';

export default function App() {
  return (
    <Swiper
      slidesPerView={"auto"}
      speed={750}
      pagination={{
        enabled: true,
        clickable: true,
        el: ".home-swiper__pagination",
        bulletClass: "home-swiper__bullet",
        bulletActiveClass: "home-swiper__bullet--active"
      }}
      effect={'creative'}
      creativeEffect={{
        prev: {
          shadow: true,
          translate: [0, "-20%", -1],
        },
        next: {
          translate: [0, '100%', 0],
        },
      }}
      mousewheel={{
        enabled: true,
        forceToAxis: true,
        // noMousewheelClass: "skills"
      }}
      hashNavigation={{
        replaceState: true,
      }}
      direction={"vertical"}
      modules={[Pagination, Mousewheel, EffectCreative, HashNavigation]}
      className="home-swiper"
    >
      <SwiperSlide
        className="home-swiper__slide"
        data-hash=" "
      >
        <section className="section hero">
          <div className="hero__inner section__inner">
            <div className="hero__info">
              <h2>
                <span className="primary-color">Hello!</span> My name is Odyssey Meltonyan.<br />
                I am a frontend developer
              </h2>
              <a
                className="button"
                href="/"
              >
                Let's check
              </a>
            </div>
            <div
              className="hero__scence"
              style={{
                width: "100%",
                aspectRatio: "1/1",
                backgroundColor: "var(--bg-light)",
                boxShadow: "var(--shadow-s)",
                borderRadius: "1rem"
              }}
            ></div>
          </div>
        </section>
      </SwiperSlide>
      <SwiperSlide
        className="home-swiper__slide"
        data-hash="skills"
      >
        <section className="section skills">
          <div className="skills__inner grid grid--2">
            <div className="skills__column">
              <h2 className="skills__title">
                <span className="primary-color">Hard</span> skills
              </h2>
              <div className="skills__body">
                <ul className="skills__list grid swiper-no-mousewheel">
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      <span className="text-light">HTML5, JSX</span>
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      <span className="text-light">CSS3, </span>
                      <span className="text-light">SASS, </span>
                      <span>Bootstrap, </span>
                      <span className="text-light">Animations</span>
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      <span className="text-light">JavaScript, </span> jQuery, TypeScript
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      <span className="text-light">React</span>
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">Zustand</div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      React Hook Form, Axios, React Router
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">Vite</div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">REST API, WebSockets, Long Polling</div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      BEM, Feature-Sliced Design, Accessibility, UX
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">Git</div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">Figma</div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">CMS 1C-Bitrix, WordPress</div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      Basic understanding of Go, Python, PHP, C++, Kotlin
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      Strong written and verbal communication skills
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">English level: A2–B1</div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="skills__column">
              <h2 className="skills__title">
                <span className="primary-color">Soft</span> skills
              </h2>
              <div className="skills__body">
                <ul className="skills__list grid swiper-no-mousewheel">
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      I work well in a team and have experience communicating with designers, managers, and other developers.
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      I take deadlines seriously and am responsible for meeting them.
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      I pay close attention to the technical requirements and details of the task.
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      I care about code quality and follow coding standards.
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      I value constructive feedback and am always open to professional and personal growth.
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      I know how to handle conflict situations.
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      I communicate ideas clearly and ask questions in a structured way.
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      I prepare detailed reports on completed work when needed.
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      I have experience working with distributed remote teams.
                    </div>
                  </li>
                  <li className="skills__item grid__item">
                    <div className="skill-card">
                      I am motivated to keep improving my skills and regularly learn new technologies in my field.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </SwiperSlide>
      <SwiperSlide
        className="home-swiper__slide"
        data-hash="cases"
      >
        <Swiper
          slidesPerView={1}
          direction={"horizontal"}
          mousewheel={{
            enabled: true,
            forceToAxis: true,
          }}
          modules={[Mousewheel]}
        >
          <SwiperSlide>
            <section className="section">
              <h2>Cases</h2>
              <p>
                Section about my cases
              </p>
            </section>
          </SwiperSlide>
          <SwiperSlide>2</SwiperSlide>
        </Swiper>
      </SwiperSlide>
      <SwiperSlide
        className="home-swiper__slide"
        data-hash="contacts"
      >
        <section className="section">
          <div className="section__inner">
            <h2>
              Do you want to ask<br />
              <span className="primary-color">something interesting?</span>
            </h2>
            <a
              className="soc1al"
              href="https://t.me/odysseys_7098"
            >
              <svg
                className="i-icon icon-telegram"
                data-js-svg-id="icon-telegram"
                width={40}
                height={40}
                viewBox="0 0 40 40"
              >
                <path
                  d="m31.78 11.82-3.599 16.973c-.271 1.198-.98 1.496-1.985.931l-5.484-4.04-2.646 2.544c-.293.293-.537.538-1.102.538l.394-5.584 10.163-9.184c.442-.394-.096-.612-.687-.218l-12.563 7.91-5.41-1.692c-1.176-.367-1.197-1.177.245-1.74l21.157-8.151c.98-.368 1.837.218 1.517 1.714Z"
                  fill="#fff"
                ></path>
              </svg>
            </a>
          </div>
        </section>
      </SwiperSlide>
      <div className="home-swiper__pagination"></div>
    </Swiper>
  );
}
