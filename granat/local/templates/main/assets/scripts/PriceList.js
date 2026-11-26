const rootSelector = '[data-js-price-list]'

const normalize = (value = '') => value.toLowerCase().replaceAll('ё', 'е')

// «зубов» → «зуб», «кариеса» → «кари»: ищем по основе, чтобы окончания не мешали
const stem = (token) => (token.length <= 4 ? token : token.slice(0, token.length - (token.length <= 6 ? 2 : 3)))

const plural = (count, one, few, many) => {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few

  return many
}

class PriceList {
  selectors = {
    root: rootSelector,
    search: '[data-js-price-search]',
    group: '[data-js-price-group]',
    row: '[data-js-price-row]',
    empty: '[data-js-price-empty]',
    emptyQuery: '[data-js-price-empty-query]',
    status: '[data-js-price-status]',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.searchElement = rootElement.querySelector(this.selectors.search)
    this.emptyElement = rootElement.querySelector(this.selectors.empty)
    this.emptyQueryElement = rootElement.querySelector(this.selectors.emptyQuery)
    this.statusElement = rootElement.querySelector(this.selectors.status)

    this.groups = [...rootElement.querySelectorAll(this.selectors.group)].map((element) => ({
      element,
      chip: rootElement.querySelector(`a[href="#${element.id}"]`)?.closest('li'),
      rows: [...element.querySelectorAll(this.selectors.row)].map((row) => ({
        element: row,
        text: normalize(row.textContent.replace(/\s+/g, ' ')),
      })),
    }))

    this.searchElement?.addEventListener('input', this.onInput)
  }

  onInput = () => {
    const query = this.searchElement.value.trim()
    const stems = normalize(query).split(/[\s,.;:()«»"]+/).filter(Boolean).map(stem)
    let total = 0

    this.groups.forEach((group) => {
      let visible = 0

      group.rows.forEach((row) => {
        const isMatch = stems.every((part) => row.text.includes(part))

        row.element.hidden = !isMatch
        visible += Number(isMatch)
      })

      group.element.hidden = visible === 0

      if (group.chip) {
        group.chip.hidden = visible === 0
      }

      total += visible
    })

    this.emptyElement.hidden = total > 0
    this.emptyQueryElement.textContent = query

    this.statusElement.textContent = query
      ? (total ? `Найдено ${total} ${plural(total, 'услуга', 'услуги', 'услуг')}` : 'Ничего не найдено')
      : ''

    // Список стал короче — возвращаемся к его началу, если уже уехали ниже (отступ под шапку даёт scroll-padding)
    if (this.rootElement.getBoundingClientRect().top < 0) {
      this.rootElement.scrollIntoView({ block: 'start', behavior: 'instant' })
    }

    // Подсветка разделов (ScrollSpy) пересчитывается по прокрутке — пусть учтёт скрытые группы
    window.dispatchEvent(new Event('scroll'))
  }
}

class PriceListCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new PriceList(element))
  }
}

export default PriceListCollection
