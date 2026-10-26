// Файл Swiper объявляет глобальную переменную, а не ES-модуль, поэтому подключаем его тегом <script>.
// Промис общий: несколько слайдеров на странице ждут одну загрузку
let swiperPromise = null

const loadSwiper = () => {
  if (swiperPromise) {
    return swiperPromise
  }

  swiperPromise = new Promise((resolve, reject) => {
    const scriptElement = document.createElement('script')

    scriptElement.src = new URL('../../vendor/swiper/swiper-bundle.min.js', import.meta.url).href
    scriptElement.addEventListener('load', resolve)
    scriptElement.addEventListener('error', reject)
    document.head.append(scriptElement)
  })

  return swiperPromise
}

export default loadSwiper
