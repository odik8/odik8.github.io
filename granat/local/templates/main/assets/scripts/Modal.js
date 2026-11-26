const rootSelector = '[data-js-modal]'

class Modal {
  selectors = {
    close: '[data-js-modal-close]',
    autofocus: 'input, textarea, select',
  }

  stateClasses = {
    isLock: 'is-lock',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.name = rootElement.getAttribute('data-js-modal')
    this.bindEvents()
  }

  open() {
    if (this.rootElement.open) {
      return
    }

    this.rootElement.showModal()
    document.documentElement.classList.add(this.stateClasses.isLock)
    this.rootElement.dispatchEvent(new CustomEvent('modal:open'))
  }

  close() {
    this.rootElement.close()
  }

  onClose = () => {
    // Событие close приходит позже: если за это время открыли другое окно, прокрутку не возвращаем
    if (!document.querySelector('dialog[open]')) {
      document.documentElement.classList.remove(this.stateClasses.isLock)
    }
    this.rootElement.dispatchEvent(new CustomEvent('modal:close'))
  }

  onClick = (event) => {
    const isBackdropClick = event.target === this.rootElement
    const isCloseClick = Boolean(event.target.closest(this.selectors.close))

    if (isBackdropClick || isCloseClick) {
      this.close()
    }
  }

  bindEvents() {
    this.rootElement.addEventListener('close', this.onClose)
    this.rootElement.addEventListener('click', this.onClick)
  }
}

class ModalCollection {
  selectors = {
    open: '[data-js-modal-open]',
  }

  constructor() {
    this.modals = new Map()

    document.querySelectorAll(rootSelector).forEach((element) => {
      const modal = new Modal(element)

      this.modals.set(modal.name, modal)
    })

    document.addEventListener('click', this.onDocumentClick)
  }

  onDocumentClick = (event) => {
    const trigger = event.target.closest(this.selectors.open)

    if (!trigger) {
      return
    }

    const modal = this.modals.get(trigger.getAttribute('data-js-modal-open'))

    if (modal) {
      event.preventDefault()

      // Из окна поиска можно открыть запись: два диалога друг над другом не держим
      this.modals.forEach((other) => other !== modal && other.close())
      modal.open()
    }
  }
}

export default ModalCollection
