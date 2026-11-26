import BaseComponent from './BaseComponent.js'

const rootSelector = '[data-js-expandable]'

class ExpandableText extends BaseComponent {
  selectors = {
    content: '[data-js-expandable-content]',
    button: '[data-js-expandable-button]',
  }

  stateClasses = {
    isExpanded: 'is-expanded',
    isShort: 'is-short',
  }

  labels = {
    expand: 'Читать полностью',
    collapse: 'Свернуть',
  }

  constructor(rootElement) {
    super()
    this.rootElement = rootElement
    this.contentElement = rootElement.querySelector(this.selectors.content)
    this.buttonElement = rootElement.querySelector(this.selectors.button)
    this.state = this.getProxyState({ isExpanded: false })
    this.checkOverflow()
    this.buttonElement?.addEventListener('click', this.onButtonClick)
  }

  checkOverflow() {
    const isShort = this.contentElement.scrollHeight <= this.contentElement.clientHeight + 2

    this.rootElement.classList.toggle(this.stateClasses.isShort, isShort)
  }

  updateUI() {
    const { isExpanded } = this.state

    this.rootElement.classList.toggle(this.stateClasses.isExpanded, isExpanded)
    this.buttonElement.setAttribute('aria-expanded', String(isExpanded))
    this.buttonElement.textContent = isExpanded ? this.labels.collapse : this.labels.expand
  }

  onButtonClick = () => {
    this.state.isExpanded = !this.state.isExpanded
  }
}

class ExpandableTextCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new ExpandableText(element))
  }
}

export default ExpandableTextCollection
