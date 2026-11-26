import getParams from './utils/getParams.js'
import loadSwiper from './utils/loadSwiper.js'

const rootSelector = '[data-js-slider]'

// Число слайдов и отступ задаёт CSS (--slides, --slide-gap) по брейкпоинтам:
// одни и те же значения работают и до загрузки Swiper, и после
const readLayout = (element) => {
  const style = getComputedStyle(element)
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
  const gapValue = style.getPropertyValue('--slide-gap').trim()
  const gap = gapValue.endsWith('rem') ? parseFloat(gapValue) * rootFontSize : parseFloat(gapValue) || 0

  return {
    slidesPerView: parseFloat(style.getPropertyValue('--slides')) || 1,
    spaceBetween: gap,
  }
}

class Slider {
  selectors = {
    swiper: '[data-js-slider-swiper]',
    prev: '[data-js-slider-prev]',
    next: '[data-js-slider-next]',
    pagination: '[data-js-slider-pagination]',
  }

  stateClasses = {
    isReady: 'is-ready',
    isFraction: 'slider-pagination--fraction',
  }

  maxBullets = 8

  constructor(rootElement) {
    this.rootElement = rootElement
    this.swiperElement = rootElement.querySelector(this.selectors.swiper)
    this.params = getParams(rootElement, rootSelector)
    this.observe()
  }

  observe() {
    if (!this.swiperElement) {
      return
    }

    if (!('IntersectionObserver' in window)) {
      this.init()
      return
    }

    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        this.observer.disconnect()
        this.init()
      }
    }, { rootMargin: '100% 0px' })

    this.observer.observe(this.rootElement)
  }

  // Больше восьми точек на телефоне не помещаются в строку — показываем счётчик
  getPaginationParams(paginationElement) {
    const slidesCount = this.swiperElement.querySelectorAll('.swiper-slide').length

    if (slidesCount > this.maxBullets) {
      paginationElement.classList.add(this.stateClasses.isFraction)

      return {
        el: paginationElement,
        type: 'fraction',
        currentClass: 'slider-pagination__current',
        totalClass: 'slider-pagination__total',
      }
    }

    return {
      el: paginationElement,
      clickable: true,
      bulletElement: 'button',
      bulletClass: 'slider-pagination__bullet',
      bulletActiveClass: 'is-active',
    }
  }

  applyLayout = (swiper) => {
    Object.assign(swiper.params, readLayout(this.rootElement))
  }

  async init() {
    try {
      await loadSwiper()
    } catch {
      return
    }

    const paginationElement = this.rootElement.querySelector(this.selectors.pagination)

    this.swiper = new window.Swiper(this.swiperElement, {
      ...readLayout(this.rootElement),
      watchOverflow: true,
      grabCursor: true,
      keyboard: { enabled: true, onlyInViewport: true },
      a11y: {
        prevSlideMessage: 'Предыдущий слайд',
        nextSlideMessage: 'Следующий слайд',
        paginationBulletMessage: 'Перейти к слайду {{index}}',
        slideLabelMessage: '{{index}} из {{slidesLength}}',
      },
      navigation: {
        prevEl: this.rootElement.querySelector(this.selectors.prev),
        nextEl: this.rootElement.querySelector(this.selectors.next),
      },
      pagination: paginationElement ? this.getPaginationParams(paginationElement) : false,
      ...this.params,
      on: {
        beforeResize: this.applyLayout,
      },
    })

    this.rootElement.classList.add(this.stateClasses.isReady)
  }
}

class SliderCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new Slider(element))
  }
}

export default SliderCollection
