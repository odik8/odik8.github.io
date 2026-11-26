const rootSelector = '[data-js-lightbox]'

class Lightbox {
  selectors = {
    item: '[data-js-lightbox-item]',
    image: '[data-js-lightbox-image]',
    caption: '[data-js-lightbox-caption]',
    prev: '[data-js-lightbox-prev]',
    next: '[data-js-lightbox-next]',
    close: '[data-js-lightbox-close]',
  }

  stateClasses = {
    isSingle: 'is-single',
    isLock: 'is-lock',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.imageElement = rootElement.querySelector(this.selectors.image)
    this.captionElement = rootElement.querySelector(this.selectors.caption)
    this.items = []
    this.index = 0
    this.touchStartX = null
    this.bindEvents()
  }

  getGroupItems(trigger) {
    const group = trigger.getAttribute('data-js-lightbox-item')

    return [...document.querySelectorAll(this.selectors.item)]
      .filter((element) => element.getAttribute('data-js-lightbox-item') === group)
  }

  show(index) {
    const count = this.items.length

    this.index = (index + count) % count

    const item = this.items[this.index]
    const thumb = item.querySelector('img')

    this.imageElement.src = item.getAttribute('href')
    this.imageElement.alt = thumb?.alt ?? ''
    this.captionElement.textContent = item.dataset.caption ?? thumb?.alt ?? ''
  }

  open(trigger) {
    this.items = this.getGroupItems(trigger)
    this.rootElement.classList.toggle(this.stateClasses.isSingle, this.items.length < 2)
    this.show(this.items.indexOf(trigger))
    this.rootElement.showModal()
    document.documentElement.classList.add(this.stateClasses.isLock)
  }

  onDocumentClick = (event) => {
    const trigger = event.target.closest(this.selectors.item)

    if (!trigger) {
      return
    }

    event.preventDefault()
    this.open(trigger)
  }

  onRootClick = (event) => {
    if (event.target.closest(this.selectors.prev)) {
      this.show(this.index - 1)
    } else if (event.target.closest(this.selectors.next)) {
      this.show(this.index + 1)
    } else if (event.target.closest(this.selectors.close) || event.target === this.rootElement) {
      this.rootElement.close()
    }
  }

  onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') this.show(this.index - 1)
    if (event.key === 'ArrowRight') this.show(this.index + 1)
  }

  onTouchStart = (event) => {
    this.touchStartX = event.touches[0].clientX
  }

  onTouchEnd = (event) => {
    if (this.touchStartX === null || this.items.length < 2) {
      return
    }

    const delta = event.changedTouches[0].clientX - this.touchStartX

    if (Math.abs(delta) > 50) {
      this.show(this.index + (delta < 0 ? 1 : -1))
    }

    this.touchStartX = null
  }

  onClose = () => {
    document.documentElement.classList.remove(this.stateClasses.isLock)
    this.items[this.index]?.focus({ preventScroll: true })
  }

  bindEvents() {
    document.addEventListener('click', this.onDocumentClick)
    this.rootElement.addEventListener('click', this.onRootClick)
    this.rootElement.addEventListener('keydown', this.onKeyDown)
    this.rootElement.addEventListener('touchstart', this.onTouchStart, { passive: true })
    this.rootElement.addEventListener('touchend', this.onTouchEnd)
    this.rootElement.addEventListener('close', this.onClose)
  }
}

class LightboxCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new Lightbox(element))
  }
}

export default LightboxCollection
