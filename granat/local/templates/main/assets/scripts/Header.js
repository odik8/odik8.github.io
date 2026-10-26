import BaseComponent from './BaseComponent.js'
import MatchMedia from './MatchMedia.js'

const rootSelector = '[data-js-header]'

class Header extends BaseComponent {
  selectors = {
    root: rootSelector,
    top: '[data-js-header-top]',
    openMenuButton: '[data-js-mobile-menu-button][aria-expanded="true"]',
  }

  stateClasses = {
    isCompact: 'is-compact',
    isScrolled: 'is-scrolled',
  }

  cssVars = {
    height: '--header-height',
    topHeight: '--header-top-height',
  }

  scrollThreshold = 8

  constructor(rootElement) {
    super()
    this.rootElement = rootElement
    this.topElement = this.rootElement.querySelector(this.selectors.top)
    this.lastScrollY = window.scrollY
    this.state = this.getProxyState({
      isCompact: false,
      isScrolled: window.scrollY > 0,
    })
    this.updateUI()
    this.measure()
    this.bindEvents()
  }

  updateUI() {
    this.rootElement.classList.toggle(this.stateClasses.isCompact, this.state.isCompact)
    this.rootElement.classList.toggle(this.stateClasses.isScrolled, this.state.isScrolled)
  }

  measure = () => {
    const rootStyle = document.documentElement.style
    const topHeight = MatchMedia.compactHeader.matches || !this.topElement ? 0 : this.topElement.offsetHeight

    rootStyle.setProperty(this.cssVars.height, `${this.rootElement.offsetHeight}px`)
    rootStyle.setProperty(this.cssVars.topHeight, `${topHeight}px`)
  }

  canCompact() {
    const isMenuOpen = Boolean(this.rootElement.querySelector(this.selectors.openMenuButton))
    const hasFocusInTop = this.topElement?.contains(document.activeElement)

    return !MatchMedia.compactHeader.matches && !isMenuOpen && !hasFocusInTop
  }

  onScroll = () => {
    const scrollY = Math.max(window.scrollY, 0)
    const delta = scrollY - this.lastScrollY

    this.state.isScrolled = scrollY > 0

    if (scrollY <= this.rootElement.offsetHeight || !this.canCompact()) {
      this.state.isCompact = false
      this.lastScrollY = scrollY
      return
    }

    if (Math.abs(delta) < this.scrollThreshold) {
      return
    }

    this.state.isCompact = delta > 0
    this.lastScrollY = scrollY
  }

  onFocusIn = () => {
    if (this.topElement?.contains(document.activeElement)) {
      this.state.isCompact = false
    }
  }

  bindEvents() {
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.rootElement.addEventListener('focusin', this.onFocusIn)

    if ('ResizeObserver' in window) {
      new ResizeObserver(this.measure).observe(this.rootElement)
    } else {
      window.addEventListener('resize', this.measure)
    }

    MatchMedia.compactHeader.addEventListener('change', this.measure)
  }
}

class HeaderCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new Header(element))
  }
}

export default HeaderCollection
