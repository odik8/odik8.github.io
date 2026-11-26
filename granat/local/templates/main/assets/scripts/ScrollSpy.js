const rootSelector = '[data-js-scroll-spy]'

class ScrollSpy {
  stateClasses = {
    isActive: 'is-active',
  }

  constructor(rootElement) {
    this.links = [...rootElement.querySelectorAll('a[href^="#"]')]
    this.sections = this.links
      .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
      .filter(Boolean)

    this.frameId = null
    this.activeId = null

    if (!this.sections.length) {
      return
    }

    this.update()
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onScroll)
  }

  setActive(id) {
    if (id === this.activeId) {
      return
    }

    this.activeId = id

    this.links.forEach((link) => {
      const isActive = link.hash === `#${id}`

      link.classList.toggle(this.stateClasses.isActive, isActive)

      if (isActive) {
        link.setAttribute('aria-current', 'location')
        this.revealLink(link)
      } else {
        link.removeAttribute('aria-current')
      }
    })
  }

  // Лента разделов прокручивается вбок — подводим активный раздел в поле зрения (только саму ленту, не страницу)
  revealLink(link) {
    const list = link.closest('ul')

    if (!list || list.scrollWidth <= list.clientWidth) {
      return
    }

    // Края ленты закрыты затуханием и стрелками — считаем видимой только середину
    const inset = 56
    const left = link.offsetLeft - list.offsetLeft
    const isVisible = left >= list.scrollLeft + inset && left + link.offsetWidth <= list.scrollLeft + list.clientWidth - inset

    if (!isVisible) {
      list.scrollTo({ left: left - (list.clientWidth - link.offsetWidth) / 2, behavior: 'smooth' })
    }
  }

  // Активна последняя группа, верх которой уже выше 40% экрана; выше первой — первая
  update = () => {
    const line = window.innerHeight * 0.4
    const visible = this.sections.filter((section) => !section.hidden)
    const passed = visible.filter((section) => section.getBoundingClientRect().top <= line)

    // Если все группы скрыты фильтром, подсветку снимаем совсем
    this.setActive((passed.at(-1) ?? visible[0])?.id)
  }

  onScroll = () => {
    if (this.frameId) {
      return
    }

    this.frameId = requestAnimationFrame(() => {
      this.frameId = null
    this.activeId = null
      this.update()
    })
  }
}

class ScrollSpyCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new ScrollSpy(element))
  }
}

export default ScrollSpyCollection
