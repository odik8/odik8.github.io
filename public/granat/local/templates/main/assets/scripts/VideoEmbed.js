const rootSelector = '[data-js-video]'

class VideoEmbed {
  selectors = {
    button: '[data-js-video-button]',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.buttonElement = rootElement.querySelector(this.selectors.button)
    this.buttonElement?.addEventListener('click', this.onButtonClick)
  }

  onButtonClick = () => {
    const iframeElement = document.createElement('iframe')
    const url = new URL(this.rootElement.getAttribute('data-js-video'))

    url.searchParams.set('autoplay', '1')
    iframeElement.src = url.href
    iframeElement.title = this.rootElement.getAttribute('data-js-video-title') ?? 'Видео'
    iframeElement.allow = 'autoplay; clipboard-write; fullscreen; picture-in-picture'
    iframeElement.setAttribute('allowfullscreen', '')
    this.buttonElement.replaceWith(iframeElement)
    iframeElement.focus()
  }
}

class VideoEmbedCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((element) => new VideoEmbed(element))
  }
}

export default VideoEmbedCollection
