const MatchMedia = {
  mobile: window.matchMedia('(width <= 767.98px)'),
  tablet: window.matchMedia('(width <= 1023.98px)'),
  compactHeader: window.matchMedia('(width <= 1199.98px)'),
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
}

export default MatchMedia
