import BaseComponent from './BaseComponent.js'

const rootSelector = '[data-js-contact-fab]'

class ContactFab extends BaseComponent {
  selectors = {
    toggle: '[data-js-contact-fab-toggle]',
    list: '.contact-fab__list',
  }

  stateClasses = {
    isOpen: 'is-open',
  }

  constructor(rootElement) {
    super()
    this.rootElement = rootElement
    this.toggleElement = rootElement.querySelector(this.selectors.toggle)
    this.listElement = rootElement.querySelector(this.selectors.list)
    this.state = this.getProxyState({ isOpen: false })
    this.updateUI()
    this.bindEvents()
  }

  updateUI() {
    const { isOpen } = this.state

    this.rootElement.classList.toggle(this.stateClasses.isOpen, isOpen)
    this.toggleElement.setAttribute('aria-expanded', String(isOpen))
    this.listElement.inert = !isOpen
  }

  onToggleClick = () => {
    this.state.isOpen = !this.state.isOpen
  }

  onDocumentClick = (event) => {
    if (this.state.isOpen && !this.rootElement.contains(event.target)) {
      this.state.isOpen = false
    }
  }

  onKeyDown = (event) => {
    if (event.key === 'Escape' && this.state.isOpen) {
      this.state.isOpen = false
      this.toggleElement.focus()
    }
  }

  bindEvents() {
    this.toggleElement.addEventListener('click', this.onToggleClick)
    document.addEventListener('click', this.onDocumentClick)
    document.addEventListener('keydown', this.onKeyDown)
  }
}

class ContactFabCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new ContactFab(element))
  }
}

export default ContactFabCollection
