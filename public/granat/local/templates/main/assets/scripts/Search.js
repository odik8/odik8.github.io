const rootSelector = '[data-js-search]'

const groups = {
  service: { title: 'Услуги', limit: 4 },
  price: { title: 'Цены', limit: 4 },
  doctor: { title: 'Врачи', limit: 3 },
  article: { title: 'Статьи', limit: 3 },
  page: { title: 'Разделы сайта', limit: 3 },
}

const typeIcons = {
  price: 'ruble',
  article: 'article',
  page: 'page',
}

const latinToCyrillic = Object.fromEntries(
  [...'`qwertyuiop[]asdfghjkl;\'zxcvbnm,.'].map((char, index) => [char, 'ёйцукенгшщзхъфывапролджэячсмитьбю'[index]]),
)

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)
const normalize = (value = '') => value.toLowerCase().replaceAll('ё', 'е')
const tokenize = (value = '') => normalize(value).split(/[^a-zа-я0-9]+/).filter(Boolean)

// Грубое отсечение окончания: «зубов» → «зуб», «кариеса» → «кари», «удаление» → «удален»
const stem = (token) => {
  if (token.length <= 3) {
    return token
  }

  const cut = token.length === 4 ? 1 : token.length <= 6 ? 2 : 3

  return token.slice(0, token.length - cut)
}

const plural = (count, one, few, many) => {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few

  return many
}

class Search {
  selectors = {
    root: rootSelector,
    form: '[data-js-search-form]',
    input: '[data-js-search-input]',
    clear: '[data-js-search-clear]',
    tab: '[data-js-search-tab]',
    count: '[data-js-search-count]',
    body: '[data-js-search-body]',
    home: '[data-js-search-home]',
    results: '[data-js-search-results]',
    status: '[data-js-search-status]',
    recent: '[data-js-search-recent]',
    recentList: '[data-js-search-recent-list]',
    recentClear: '[data-js-search-recent-clear]',
    recentRemove: '[data-js-search-recent-remove]',
    query: '[data-js-search-query]',
    showType: '[data-js-search-show]',
    item: '[data-js-search-item]',
    index: '[data-js-search-index]',
    empty: '[data-js-search-empty]',
    emptyQuery: '[data-js-search-empty-query]',
  }

  stateClasses = {
    isActive: 'is-active',
    isEmpty: 'is-empty',
  }

  storageKey = 'granat-search-recent'
  recentLimit = 6
  minQueryLength = 2

  constructor(rootElement) {
    this.rootElement = rootElement
    this.formElement = rootElement.querySelector(this.selectors.form)
    this.inputElement = rootElement.querySelector(this.selectors.input)
    this.clearElement = rootElement.querySelector(this.selectors.clear)
    this.tabElements = [...rootElement.querySelectorAll(this.selectors.tab)]
    this.bodyElement = rootElement.querySelector(this.selectors.body)
    this.homeElement = rootElement.querySelector(this.selectors.home)
    this.resultsElement = rootElement.querySelector(this.selectors.results)
    this.statusElement = rootElement.querySelector(this.selectors.status)
    this.recentElement = rootElement.querySelector(this.selectors.recent)
    this.recentListElement = rootElement.querySelector(this.selectors.recentList)
    this.emptyTemplate = rootElement.querySelector(this.selectors.empty)
    this.spriteUrl = rootElement.querySelector('use')?.getAttribute('href').split('#')[0] ?? ''

    this.items = null
    this.state = { query: '', tab: 'all' }

    this.bindEvents()
  }

  // Индекс разбираем при первом открытии, а не при загрузке страницы
  getItems() {
    if (!this.items) {
      const source = this.rootElement.querySelector(this.selectors.index)
      const items = source ? JSON.parse(source.textContent) : []

      this.items = items.map((item) => ({
        ...item,
        words: tokenize(item.title),
        extraWords: tokenize(`${item.meta ?? ''} ${item.keywords ?? ''}`),
      }))
    }

    return this.items
  }

  icon(id) {
    return `<svg class="icon" aria-hidden="true" focusable="false"><use href="${this.spriteUrl}#${id}"></use></svg>`
  }

  scoreToken(item, token) {
    const tokenStem = stem(token)
    let best = 0

    item.words.forEach((word) => {
      if (word.startsWith(token)) best = Math.max(best, word === token ? 12 : 10)
      else if (word.startsWith(tokenStem)) best = Math.max(best, 6)
      else if (token.length >= 4 && word.includes(token)) best = Math.max(best, 4)
    })

    if (best) {
      return best
    }

    item.extraWords.forEach((word) => {
      if (word.startsWith(token)) best = Math.max(best, 3)
      else if (word.startsWith(tokenStem)) best = Math.max(best, 2)
    })

    return best
  }

  find(query) {
    const tokens = tokenize(query)
    const phrase = normalize(query.trim())

    if (!tokens.length) {
      return []
    }

    return this.getItems()
      .map((item) => {
        let score = 0

        for (const token of tokens) {
          const tokenScore = this.scoreToken(item, token)

          if (!tokenScore) {
            return null
          }

          score += tokenScore
        }

        if (normalize(item.title).startsWith(phrase)) {
          score += 15
        }

        return { item, score }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
  }

  // Подсвечиваем начало слов, совпавшее с запросом или его основой
  highlight(text, query) {
    const tokens = tokenize(query)

    if (!tokens.length) {
      return escapeHtml(text)
    }

    const ranges = []

    for (const match of text.matchAll(/[a-zа-яё0-9]+/gi)) {
      const word = normalize(match[0])

      for (const token of tokens) {
        const tokenStem = stem(token)
        let start = -1
        let length = 0

        if (word.startsWith(token)) [start, length] = [0, token.length]
        else if (word.startsWith(tokenStem)) [start, length] = [0, tokenStem.length]
        else if (token.length >= 4 && word.includes(token)) [start, length] = [word.indexOf(token), token.length]

        if (start >= 0) {
          ranges.push([match.index + start, match.index + start + length])
          break
        }
      }
    }

    let html = ''
    let cursor = 0

    ranges.forEach(([start, end]) => {
      html += `${escapeHtml(text.slice(cursor, start))}<mark>${escapeHtml(text.slice(start, end))}</mark>`
      cursor = end
    })

    return html + escapeHtml(text.slice(cursor))
  }

  renderItem(item, query) {
    let media

    if (item.type === 'doctor') {
      media = `<img class="search-item__avatar" src="${escapeHtml(item.image)}" alt="" width="44" height="44" loading="lazy" decoding="async">`
    } else {
      const isService = item.type === 'service'

      media = `<span class="search-item__icon${isService ? ' search-item__icon--accent' : ''}">${this.icon(item.icon ?? typeIcons[item.type])}</span>`
    }

    const price = item.price ? `<span class="search-item__price">${escapeHtml(item.price)}</span>` : ''

    return `
      <li>
        <a class="search-item" href="${escapeHtml(item.url)}" data-js-search-item>
          ${media}
          <span class="search-item__body">
            <span class="search-item__title">${this.highlight(item.title, query)}</span>
            <span class="search-item__meta">${escapeHtml(item.meta)}</span>
          </span>
          ${price}
          <span class="search-item__arrow">${this.icon('arrow-right')}</span>
        </a>
      </li>`
  }

  renderGroup(title, items, query, { count = items.length, showType = null } = {}) {
    const more = showType
      ? `<button class="search__section-action" type="button" data-js-search-show="${showType}">Все ${count}</button>`
      : ''

    return `
      <section class="search__group">
        <div class="search__section-head">
          <h3 class="search__section-title">${escapeHtml(title)}</h3>
          ${more}
        </div>
        <ul class="search__list">${items.map((item) => this.renderItem(item, query)).join('')}</ul>
      </section>`
  }

  // Без запроса вкладка показывает весь раздел: цены и услуги — по группам
  renderBrowse(type) {
    const items = this.getItems().filter((item) => item.type === type)

    if (type === 'doctor' || type === 'article') {
      return this.renderGroup(type === 'doctor' ? 'Все врачи' : 'Все статьи', items, '')
    }

    const byMeta = new Map()

    items.forEach((item) => {
      const key = type === 'service' && item.meta === 'Направление' ? 'Направления' : item.meta

      byMeta.set(key, [...(byMeta.get(key) ?? []), item])
    })

    return [...byMeta].map(([title, groupItems]) => this.renderGroup(title, groupItems, '')).join('')
  }

  renderResults(query, found, note) {
    const noteHtml = note
      ? `<p class="search__note">Показаны результаты по запросу «<strong>${escapeHtml(note)}</strong>»</p>`
      : ''

    if (this.state.tab !== 'all') {
      const items = found.filter((item) => item.type === this.state.tab)

      return items.length ? noteHtml + this.renderGroup(groups[this.state.tab].title, items, query) : ''
    }

    return noteHtml + Object.entries(groups)
      .map(([type, { title, limit }]) => {
        const items = found.filter((item) => item.type === type)

        if (!items.length) {
          return ''
        }

        return this.renderGroup(title, items.slice(0, limit), query, {
          count: items.length,
          showType: items.length > limit && type !== 'page' ? type : null,
        })
      })
      .join('')
  }

  renderEmpty(query) {
    const fragment = this.emptyTemplate.content.cloneNode(true)

    fragment.querySelector(this.selectors.emptyQuery).textContent = query

    return fragment
  }

  update() {
    const query = this.inputElement.value
    const hasQuery = query.trim().length >= this.minQueryLength
    let found = []
    let note = ''

    this.clearElement.hidden = !query

    if (hasQuery) {
      found = this.find(query)

      // Набрали в английской раскладке: «ktxtybt» → «лечение»
      if (!found.length && /[a-z]/i.test(query)) {
        const converted = [...query.toLowerCase()].map((char) => latinToCyrillic[char] ?? char).join('')
        const convertedFound = this.find(converted)

        if (convertedFound.length) {
          found = convertedFound
          note = converted
        }
      }
    }

    this.state.query = query
    this.state.found = found
    this.updateTabs(hasQuery, found)

    const isHome = !hasQuery && this.state.tab === 'all'

    this.homeElement.hidden = !isHome
    this.resultsElement.hidden = isHome

    if (isHome) {
      this.statusElement.textContent = ''
      return
    }

    const highlightQuery = note || query
    const html = hasQuery ? this.renderResults(highlightQuery, found, note) : this.renderBrowse(this.state.tab)

    this.resultsElement.replaceChildren()

    if (html) {
      this.resultsElement.innerHTML = html
    } else {
      this.resultsElement.append(this.renderEmpty(query.trim()))
    }

    if (hasQuery) {
      const total = this.state.tab === 'all' ? found.length : found.filter((item) => item.type === this.state.tab).length

      this.statusElement.textContent = total
        ? `Найдено ${total} ${plural(total, 'результат', 'результата', 'результатов')}`
        : 'Ничего не найдено'
    }
  }

  updateTabs(hasQuery, found) {
    const items = this.getItems()

    this.tabElements.forEach((tab) => {
      const type = tab.getAttribute('data-js-search-tab')
      const countElement = tab.querySelector(this.selectors.count)
      const source = hasQuery ? found : items
      const count = type === 'all' ? source.length : source.filter((item) => item.type === type).length

      countElement.textContent = count
      countElement.hidden = type === 'all' && !hasQuery
      tab.classList.toggle(this.stateClasses.isEmpty, hasQuery && count === 0)
    })
  }

  selectTab(type, { focus = false } = {}) {
    this.state.tab = type

    this.tabElements.forEach((tab) => {
      const isActive = tab.getAttribute('data-js-search-tab') === type

      tab.classList.toggle(this.stateClasses.isActive, isActive)
      tab.setAttribute('aria-selected', String(isActive))
      tab.tabIndex = isActive ? 0 : -1

      if (isActive) {
        this.bodyElement.setAttribute('aria-labelledby', tab.id)

        if (focus) {
          tab.focus()
          tab.scrollIntoView({ block: 'nearest', inline: 'nearest' })
        }
      }
    })

    this.bodyElement.scrollTop = 0
    this.update()
  }

  setQuery(value) {
    this.inputElement.value = value
    this.inputElement.focus()
    this.update()
  }

  // ---------------------------------------------------------------- recent
  readRecent() {
    try {
      const value = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]')

      return Array.isArray(value) ? value : []
    } catch {
      return []
    }
  }

  writeRecent(list) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(list))
    } catch {
      // приватный режим или запрет хранилища — история просто не сохранится
    }

    this.renderRecent()
  }

  saveRecent() {
    const query = this.state.query.trim()

    if (query.length < this.minQueryLength) {
      return
    }

    const list = this.readRecent().filter((item) => normalize(item) !== normalize(query))

    this.writeRecent([query, ...list].slice(0, this.recentLimit))
  }

  renderRecent() {
    const list = this.readRecent()

    this.recentElement.hidden = !list.length
    this.recentListElement.innerHTML = list
      .map((query) => `
        <li class="search__recent-item">
          <button class="search__recent-query" type="button" data-js-search-query="${escapeHtml(query)}" data-js-search-item>
            ${this.icon('history')}
            <span>${escapeHtml(query)}</span>
          </button>
          <button class="search__recent-remove" type="button" aria-label="Удалить «${escapeHtml(query)}» из истории"
            data-js-search-recent-remove="${escapeHtml(query)}">
            ${this.icon('close')}
          </button>
        </li>`)
      .join('')
  }

  // ---------------------------------------------------------------- keyboard
  getFocusableItems() {
    return [...this.bodyElement.querySelectorAll(this.selectors.item)].filter((element) => element.offsetParent !== null)
  }

  moveFocus(step) {
    const items = this.getFocusableItems()
    const index = items.indexOf(document.activeElement)
    const next = index + step

    if (next < 0) {
      this.inputElement.focus()
      return
    }

    items[Math.min(next, items.length - 1)]?.focus()
  }

  onInputKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.moveFocus(1)
    }

    // Первый Esc очищает строку, второй закрывает окно
    if (event.key === 'Escape' && this.inputElement.value) {
      event.preventDefault()
      this.setQuery('')
    }
  }

  onBodyKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      this.moveFocus(event.key === 'ArrowDown' ? 1 : -1)
      return
    }

    const isPrintable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey

    if (isPrintable || event.key === 'Backspace') {
      this.inputElement.focus()
    }
  }

  onTabsKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]

    if (!step) {
      return
    }

    event.preventDefault()

    const index = this.tabElements.findIndex((tab) => tab.getAttribute('data-js-search-tab') === this.state.tab)
    const next = this.tabElements[(index + step + this.tabElements.length) % this.tabElements.length]

    this.selectTab(next.getAttribute('data-js-search-tab'), { focus: true })
  }

  onSubmit = (event) => {
    event.preventDefault()

    const first = this.resultsElement.hidden ? null : this.resultsElement.querySelector('a[data-js-search-item]')

    first?.click()
  }

  onClick = (event) => {
    const { target } = event
    const tab = target.closest(this.selectors.tab)
    const showType = target.closest(this.selectors.showType)
    const queryButton = target.closest(this.selectors.query)
    const removeButton = target.closest(this.selectors.recentRemove)
    const link = target.closest('a[href]')

    if (tab) {
      this.selectTab(tab.getAttribute('data-js-search-tab'))
    } else if (showType) {
      this.selectTab(showType.getAttribute('data-js-search-show'))
    } else if (queryButton) {
      this.setQuery(queryButton.getAttribute('data-js-search-query'))
    } else if (removeButton) {
      const value = removeButton.getAttribute('data-js-search-recent-remove')

      this.writeRecent(this.readRecent().filter((item) => item !== value))
      this.inputElement.focus()
    } else if (target.closest(this.selectors.recentClear)) {
      this.writeRecent([])
      this.inputElement.focus()
    } else if (link) {
      this.saveRecent()

      // Ссылка на якорь этой же страницы: закрываем окно, чтобы было видно, куда прокрутило
      const url = new URL(link.href, location.href)

      if (url.pathname === location.pathname && url.hash) {
        this.rootElement.close()
      }
    }
  }

  onOpen = () => {
    this.renderRecent()

    // С пустым запросом окно открывается на «Всё», а не на последней вкладке
    if (this.inputElement.value.trim()) {
      this.update()
    } else {
      this.selectTab('all')
    }

    this.inputElement.focus()
    this.inputElement.select()
  }

  bindEvents() {
    this.rootElement.addEventListener('modal:open', this.onOpen)
    this.rootElement.addEventListener('click', this.onClick)
    this.formElement.addEventListener('submit', this.onSubmit)
    this.inputElement.addEventListener('input', () => this.update())
    this.inputElement.addEventListener('keydown', this.onInputKeyDown)
    this.bodyElement.addEventListener('keydown', this.onBodyKeyDown)
    this.rootElement.querySelector('[role="tablist"]').addEventListener('keydown', this.onTabsKeyDown)
    this.clearElement.addEventListener('click', () => this.setQuery(''))
  }
}

class SearchCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new Search(element))
    document.addEventListener('keydown', this.onKeyDown)
  }

  // «/» и Ctrl/Cmd+K открывают поиск, если человек не печатает в поле
  onKeyDown = (event) => {
    const isTyping = event.target.closest('input, textarea, select, [contenteditable="true"]')
    const isShortcut = (event.key === '/' && !isTyping) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')

    if (!isShortcut || document.querySelector('dialog[open]')) {
      return
    }

    event.preventDefault()
    document.querySelector('[data-js-modal-open="search"]')?.click()
  }
}

export default SearchCollection
