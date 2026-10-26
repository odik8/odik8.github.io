const rootSelector = '[data-js-scroll-row]'

// Лента с прокруткой вбок: отмечает, есть ли куда листать влево и вправо, и листает по стрелкам
class ScrollRow {
  selectors = {
    root: rootSelector,
    track: '[data-js-scroll-row-track]',
    prev: '[data-js-scroll-row-prev]',
    next: '[data-js-scroll-row-next]',
  }

  stateClasses = {
    isOverflowStart: 'is-overflow-start',
    isOverflowEnd: 'is-overflow-end',
  }

  // Доля ширины ленты, на которую листает одна стрелка
  step = 0.7

  constructor(rootElement) {
    this.rootElement = rootElement
    this.trackElement = rootElement.querySelector(this.selectors.track)
    this.frameId = null

    if (!this.trackElement) {
      return
    }

    this.update()
    this.bindEvents()
  }

  update = () => {
    const { scrollLeft, scrollWidth, clientWidth } = this.trackElement
    const maxScroll = scrollWidth - clientWidth

    this.rootElement.classList.toggle(this.stateClasses.isOverflowStart, scrollLeft > 1)
    this.rootElement.classList.toggle(this.stateClasses.isOverflowEnd, scrollLeft < maxScroll - 1)
  }

  onScroll = () => {
    if (this.frameId) {
      return
    }

    this.frameId = requestAnimationFrame(() => {
      this.frameId = null
      this.update()
    })
  }

  scrollBy(direction) {
    this.trackElement.scrollBy({ left: direction * this.trackElement.clientWidth * this.step, behavior: 'smooth' })
  }

  bindEvents() {
    this.trackElement.addEventListener('scroll', this.onScroll, { passive: true })
    this.rootElement.querySelector(this.selectors.prev)?.addEventListener('click', () => this.scrollBy(-1))
    this.rootElement.querySelector(this.selectors.next)?.addEventListener('click', () => this.scrollBy(1))

    if ('ResizeObserver' in window) {
      new ResizeObserver(this.onScroll).observe(this.trackElement)
    } else {
      window.addEventListener('resize', this.onScroll)
    }
  }
}

class ScrollRowCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new ScrollRow(element))
  }
}

export default ScrollRowCollection
