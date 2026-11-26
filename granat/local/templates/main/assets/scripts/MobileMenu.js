import BaseComponent from './BaseComponent.js'
import MatchMedia from './MatchMedia.js'
import trapFocus from './utils/focusTrap.js'

const rootSelector = '[data-js-mobile-menu]'

class MobileMenu extends BaseComponent {
  selectors = {
    root: rootSelector,
    button: '[data-js-mobile-menu-button]',
    header: '[data-js-header]',
    link: 'a, [data-js-modal-open]',
    outside: '#main, .footer, [data-js-contact-fab]',
  }

  stateClasses = {
    isActive: 'is-active',
    isLock: 'is-lock',
  }

  labels = {
    open: 'Открыть меню',
    close: 'Закрыть меню',
  }

  constructor(rootElement) {
    super()
    this.rootElement = rootElement
    this.headerElement = rootElement.closest(this.selectors.header)
    this.buttonElement = this.headerElement?.querySelector(this.selectors.button)
    this.state = this.getProxyState({ isOpen: false })
    this.bindEvents()
    this.syncInert()
  }

  updateUI() {
    const { isOpen } = this.state

    this.rootElement.classList.toggle(this.stateClasses.isActive, isOpen)
    document.documentElement.classList.toggle(this.stateClasses.isLock, isOpen)
    this.buttonElement?.classList.toggle(this.stateClasses.isActive, isOpen)
    this.buttonElement?.setAttribute('aria-expanded', String(isOpen))
    this.buttonElement?.setAttribute('aria-label', isOpen ? this.labels.close : this.labels.open)
    document.querySelectorAll(this.selectors.outside).forEach((element) => {
      element.inert = isOpen
    })
    this.syncInert()
  }

  syncInert() {
    this.rootElement.inert = MatchMedia.compactHeader.matches && !this.state.isOpen
  }

  close({ returnFocus = false } = {}) {
    this.state.isOpen = false

    if (returnFocus) {
      this.buttonElement?.focus({ preventScroll: true })
    }
  }

  onButtonClick = () => {
    this.state.isOpen = !this.state.isOpen
  }

  onRootClick = (event) => {
    if (event.target.closest(this.selectors.link)) {
      this.close()
    }
  }

  onKeyDown = (event) => {
    if (!this.state.isOpen) {
      return
    }

    if (event.key === 'Escape') {
      this.close({ returnFocus: true })
      return
    }

    if (event.key === 'Tab') {
      trapFocus(this.headerElement, event)
    }
  }

  onCompactHeaderChange = () => {
    if (!MatchMedia.compactHeader.matches && this.state.isOpen) {
      this.close()
    }

    this.syncInert()
  }

  bindEvents() {
    this.buttonElement?.addEventListener('click', this.onButtonClick)
    this.rootElement.addEventListener('click', this.onRootClick)
    document.addEventListener('keydown', this.onKeyDown)
    MatchMedia.compactHeader.addEventListener('change', this.onCompactHeaderChange)
  }
}

class MobileMenuCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new MobileMenu(element))
  }
}

export default MobileMenuCollection
