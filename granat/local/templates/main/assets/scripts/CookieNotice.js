const rootSelector = '[data-js-cookie-notice]'
const storageKey = 'granat-cookie-accepted'

const readAccepted = () => {
  try {
    return localStorage.getItem(storageKey) === '1'
  } catch {
    return false
  }
}

class CookieNotice {
  selectors = {
    accept: '[data-js-cookie-notice-accept]',
  }

  constructor(rootElement) {
    this.rootElement = rootElement

    if (readAccepted()) {
      return
    }

    this.rootElement.hidden = false
    this.rootElement.querySelector(this.selectors.accept)?.addEventListener('click', this.onAcceptClick)
  }

  onAcceptClick = () => {
    try {
      localStorage.setItem(storageKey, '1')
    } catch {
      // Без хранилища баннер просто появится снова на следующей странице
    }

    this.rootElement.hidden = true
  }
}

class CookieNoticeCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new CookieNotice(element))
  }
}

export default CookieNoticeCollection
