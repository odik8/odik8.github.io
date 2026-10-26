import MatchMedia from './MatchMedia.js'

const selector = '[data-reveal]'

const stateClasses = {
  isVisible: 'is-visible',
  isInstant: 'is-instant',
}

const initScrollReveal = () => {
  const elements = [...document.querySelectorAll(selector)]

  if (!elements.length) {
    return
  }

  const groups = new Map()

  elements.forEach((element) => {
    const siblings = groups.get(element.parentElement) ?? []

    element.style.setProperty('--reveal-index', String(Math.min(siblings.length, 6)))
    siblings.push(element)
    groups.set(element.parentElement, siblings)
  })

  if (MatchMedia.reducedMotion.matches || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add(stateClasses.isVisible, stateClasses.isInstant))
    return
  }

  // Что видно сразу после загрузки, проявляем тут же — с той же анимацией и лесенкой, что и при прокрутке
  const revealLine = window.innerHeight * 0.9
  const hiddenElements = elements.filter((element) => {
    const isOnScreen = element.getBoundingClientRect().top < revealLine

    if (isOnScreen) {
      element.classList.add(stateClasses.isVisible)
    }

    return !isOnScreen
  })

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(stateClasses.isVisible)
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

  hiddenElements.forEach((element) => observer.observe(element))
}

export default initScrollReveal
