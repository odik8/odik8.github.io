/**
 * Base class for page components. A component owns one root element
 * (matched by its [data-js] hook) and cleans up after itself in destroy().
 */
export class Component {
  /** @param {HTMLElement} root */
  constructor(root) {
    this.root = root;
    this.init();
  }

  init() {}

  destroy() {}

  /**
   * @param {string} name
   * @returns {HTMLElement|null}
   */
  find(name) {
    return this.root.querySelector(`[data-js="${name}"]`);
  }

  /**
   * @param {string} name
   * @returns {HTMLElement[]}
   */
  findAll(name) {
    return [...this.root.querySelectorAll(`[data-js="${name}"]`)];
  }

  static get reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
