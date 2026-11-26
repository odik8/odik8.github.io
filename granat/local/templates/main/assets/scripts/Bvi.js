const triggerSelector = '[data-js-bvi]'
const activeCookie = 'bvi_panelActive=true'

class Bvi {
  isStarted = false

  constructor() {
    this.baseUrl = new URL('../vendor/bvi/', import.meta.url).href

    if (document.cookie.includes(activeCookie)) {
      this.start()
    }

    document.addEventListener('click', this.onDocumentClick, true)
  }

  start(onReady) {
    if (this.isStarted) {
      return
    }

    this.isStarted = true

    // В слое обычные правила библиотеки (html { font-size: 100% }) не перебивают
    // масштаб сайта, а её !important в режиме для слабовидящих по-прежнему сильнее
    const styleElement = document.createElement('style')

    styleElement.textContent = `@import url("${this.baseUrl}css/bvi.min.css") layer(bvi);`
    document.head.append(styleElement)

    const scriptElement = document.createElement('script')

    scriptElement.src = `${this.baseUrl}js/bvi.min.js`
    scriptElement.addEventListener('load', () => {
      new window.isvek.Bvi()
      onReady?.()
    })
    document.body.append(scriptElement)
  }

  // Библиотека сама вешает обработчик на кнопку .bvi-open, но только после загрузки.
  // Первый клик перехватываем, грузим её и повторяем клик
  onDocumentClick = (event) => {
    const trigger = event.target.closest(triggerSelector)

    if (this.isStarted || !trigger) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    this.start(() => trigger.click())
  }
}

export default Bvi
