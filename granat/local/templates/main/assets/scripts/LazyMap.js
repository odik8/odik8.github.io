const rootSelector = '[data-js-map]'

class LazyMap {
  constructor(rootElement) {
    this.rootElement = rootElement

    if (!('IntersectionObserver' in window)) {
      this.load()
      return
    }

    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        this.observer.disconnect()
        this.load()
      }
    }, { rootMargin: '200px' })

    this.observer.observe(this.rootElement)
  }

  load() {
    const iframeElement = document.createElement('iframe')

    iframeElement.src = this.rootElement.getAttribute('data-js-map')
    iframeElement.title = this.rootElement.getAttribute('data-js-map-title') ?? 'Карта проезда'
    iframeElement.loading = 'lazy'
    iframeElement.setAttribute('allowfullscreen', '')
    this.rootElement.append(iframeElement)
  }
}

class LazyMapCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new LazyMap(element))
  }
}

export default LazyMapCollection
