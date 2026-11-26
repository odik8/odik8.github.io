const rootSelector = '[data-js-phone]'

class PhoneInput {
  constructor(inputElement) {
    this.inputElement = inputElement
    this.bindEvents()
  }

  static getDigits(value) {
    let digits = value.replace(/\D/g, '')

    if (digits.startsWith('8') || digits.startsWith('7')) {
      digits = digits.slice(1)
    }

    return digits.slice(0, 10)
  }

  static format(digits) {
    if (!digits) {
      return ''
    }

    const parts = [
      digits.slice(0, 3),
      digits.slice(3, 6),
      digits.slice(6, 8),
      digits.slice(8, 10),
    ]

    let result = `+7 (${parts[0]}`

    if (digits.length >= 3) result += ')'
    if (parts[1]) result += ` ${parts[1]}`
    if (parts[2]) result += `-${parts[2]}`
    if (parts[3]) result += `-${parts[3]}`

    return result
  }

  static isComplete(value) {
    return PhoneInput.getDigits(value).length === 10
  }

  onInput = (event) => {
    const { value } = this.inputElement
    const isDeleting = event.inputType?.startsWith('delete')
    const digits = PhoneInput.getDigits(value)

    if (isDeleting && value.length < 5) {
      this.inputElement.value = value.replace(/\D/g, '') === '7' ? '' : value
      return
    }

    this.inputElement.value = PhoneInput.format(digits)
  }

  onFocus = () => {
    if (!this.inputElement.value) {
      this.inputElement.value = '+7 ('
    }
  }

  onBlur = () => {
    if (!PhoneInput.getDigits(this.inputElement.value)) {
      this.inputElement.value = ''
    }
  }

  bindEvents() {
    this.inputElement.addEventListener('input', this.onInput)
    this.inputElement.addEventListener('focus', this.onFocus)
    this.inputElement.addEventListener('blur', this.onBlur)
  }
}

export class PhoneInputCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new PhoneInput(element))
  }
}

export default PhoneInput
