import PhoneInput from './PhoneInput.js'

const rootSelector = '[data-js-form]'

class Form {
  selectors = {
    root: rootSelector,
    fieldError: '[data-js-field-error]',
    formError: '[data-js-form-error]',
    submit: '[data-js-form-submit]',
    success: '[data-js-form-success]',
    modal: '[data-js-modal]',
    phone: '[data-js-phone]',
  }

  messages = {
    valueMissing: 'Заполните это поле',
    agreement: 'Нужно ваше согласие',
    name: 'Укажите имя буквами, от 2 символов',
    phone: 'Введите номер полностью: +7 (XXX) XXX-XX-XX',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.submitElement = rootElement.querySelector(this.selectors.submit)
    this.formErrorElement = rootElement.querySelector(this.selectors.formError)
    this.containerElement = rootElement.closest(this.selectors.modal) ?? rootElement.parentElement
    this.successElement = this.containerElement.querySelector(this.selectors.success)
    this.wasSubmitted = false
    this.bindEvents()
  }

  getControls() {
    return [...this.rootElement.elements].filter((element) => element.willValidate)
  }

  getErrorMessage(control) {
    if (control.type === 'checkbox') {
      return control.checked ? '' : this.messages.agreement
    }

    if (control.matches(this.selectors.phone)) {
      if (!control.value) return control.required ? this.messages.valueMissing : ''
      return PhoneInput.isComplete(control.value) ? '' : this.messages.phone
    }

    const { validity } = control

    if (validity.valueMissing) return this.messages.valueMissing
    if (validity.patternMismatch || validity.tooShort) return this.messages.name

    return control.validationMessage
  }

  validateControl(control) {
    const message = this.getErrorMessage(control)
    const errorElement = control.closest('.field')?.querySelector(this.selectors.fieldError)

    control.setAttribute('aria-invalid', String(Boolean(message)))

    if (errorElement) {
      errorElement.textContent = message
    }

    return !message
  }

  validate() {
    const invalidControls = this.getControls().filter((control) => !this.validateControl(control))

    invalidControls[0]?.focus()

    return !invalidControls.length
  }

  setBusy(isBusy) {
    this.submitElement?.setAttribute('aria-busy', String(isBusy))
  }

  showSuccess() {
    this.rootElement.hidden = true

    if (this.successElement) {
      this.successElement.hidden = false
      this.successElement.focus()
    }
  }

  reset = () => {
    this.rootElement.reset()
    this.rootElement.hidden = false
    this.wasSubmitted = false

    if (this.successElement) {
      this.successElement.hidden = true
    }

    if (this.formErrorElement) {
      this.formErrorElement.hidden = true
    }

    this.getControls().forEach((control) => {
      control.removeAttribute('aria-invalid')
      const errorElement = control.closest('.field')?.querySelector(this.selectors.fieldError)

      if (errorElement) {
        errorElement.textContent = ''
      }
    })
  }

  onModalClose = () => {
    if (this.rootElement.hidden) {
      this.reset()
    }
  }

  onSubmit = async (event) => {
    event.preventDefault()
    this.wasSubmitted = true

    if (this.formErrorElement) {
      this.formErrorElement.hidden = true
    }

    if (!this.validate()) {
      return
    }

    this.setBusy(true)

    try {
      const response = await fetch(this.rootElement.action, {
        method: 'POST',
        body: new FormData(this.rootElement),
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })

      if (!response.ok) {
        throw new Error(String(response.status))
      }

      this.showSuccess()
    } catch {
      if (this.formErrorElement) {
        this.formErrorElement.hidden = false
      }
    } finally {
      this.setBusy(false)
    }
  }

  onChange = (event) => {
    if (this.wasSubmitted && event.target.willValidate) {
      this.validateControl(event.target)
    }
  }

  bindEvents() {
    this.rootElement.addEventListener('submit', this.onSubmit)
    this.rootElement.addEventListener('input', this.onChange)
    this.rootElement.addEventListener('change', this.onChange)
    this.containerElement.addEventListener('modal:close', this.onModalClose)
  }
}

class FormCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new Form(element))
  }
}

export default FormCollection
