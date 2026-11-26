import MatchMedia from './MatchMedia.js'

const rootSelector = '[data-js-nav-dropdown]'
const canHover = window.matchMedia('(any-hover: hover)')

// На десктопе список открывается наведением и кликом, в мобильном меню — только кликом, как аккордеон
class NavDropdown {
  selectors = {
    root: rootSelector,
    button: '[data-js-nav-dropdown-button]',
  }

  stateClasses = {
    isOpen: 'is-open',
  }

  closeDelay = 200

  constructor(rootElement, collection) {
    this.rootElement = rootElement
    this.collection = collection
    this.buttonElement = rootElement.querySelector(this.selectors.button)
    this.isOpen = false
    this.isHoverOpen = false
    this.closeTimer = null
    this.bindEvents()
  }

  isDesktop() {
    return !MatchMedia.compactHeader.matches
  }

  setOpen(isOpen, { byHover = false } = {}) {
    clearTimeout(this.closeTimer)

    if (isOpen) {
      this.collection.closeOthers(this)
    }

    this.isOpen = isOpen
    this.isHoverOpen = isOpen && byHover
    this.rootElement.classList.toggle(this.stateClasses.isOpen, isOpen)
    this.buttonElement.setAttribute('aria-expanded', String(isOpen))
  }

  close({ returnFocus = false } = {}) {
    if (!this.isOpen) {
      return
    }

    this.setOpen(false)

    if (returnFocus) {
      this.buttonElement.focus()
    }
  }

  // Открыли наведением, потом кликнули — список остаётся открытым, а не схлопывается
  onButtonClick = () => {
    if (this.isOpen && this.isHoverOpen) {
      this.isHoverOpen = false
      return
    }

    this.setOpen(!this.isOpen)
  }

  onPointerEnter = (event) => {
    if (event.pointerType === 'mouse' && canHover.matches && this.isDesktop()) {
      if (!this.isOpen) {
        this.setOpen(true, { byHover: true })
      } else {
        clearTimeout(this.closeTimer)
      }
    }
  }

  onPointerLeave = (event) => {
    if (event.pointerType === 'mouse' && this.isHoverOpen && this.isDesktop()) {
      this.closeTimer = setTimeout(() => this.setOpen(false), this.closeDelay)
    }
  }

  onKeyDown = (event) => {
    if (event.key === 'Escape' && this.isOpen) {
      event.stopPropagation()
      this.close({ returnFocus: true })
    }
  }

  onFocusOut = (event) => {
    if (this.isDesktop() && !this.rootElement.contains(event.relatedTarget)) {
      this.close()
    }
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', this.onButtonClick)
    this.rootElement.addEventListener('pointerenter', this.onPointerEnter)
    this.rootElement.addEventListener('pointerleave', this.onPointerLeave)
    this.rootElement.addEventListener('keydown', this.onKeyDown)
    this.rootElement.addEventListener('focusout', this.onFocusOut)
  }
}

class NavDropdownCollection {
  constructor() {
    this.dropdowns = [...document.querySelectorAll(rootSelector)].map((element) => new NavDropdown(element, this))

    if (!this.dropdowns.length) {
      return
    }

    document.addEventListener('click', this.onDocumentClick)
    MatchMedia.compactHeader.addEventListener('change', () => this.closeOthers())
  }

  closeOthers(except = null) {
    this.dropdowns.forEach((dropdown) => dropdown !== except && dropdown.close())
  }

  // Клик мимо закрывает список на десктопе; аккордеоны мобильного меню остаются как есть
  onDocumentClick = (event) => {
    if (MatchMedia.compactHeader.matches) {
      return
    }

    if (!event.target.closest(rootSelector)) {
      this.closeOthers()
    }
  }
}

export default NavDropdownCollection
