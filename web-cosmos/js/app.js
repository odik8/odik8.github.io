import { DotGrid } from './modules/DotGrid.js';
import { Constellation } from './modules/Constellation.js';
import { CursorGlow } from './modules/CursorGlow.js';
import { AuditForm } from './modules/AuditForm.js';
import { Reveal } from './modules/Reveal.js';
import { RevealGroup } from './modules/RevealGroup.js';
import { Loader } from './modules/Loader.js';

/** data-js hook → component class */
const COMPONENTS = {
  'loader': Loader,
  'dot-grid': DotGrid,
  'constellation': Constellation,
  // 'cursor-glow': CursorGlow,
  'audit-form': AuditForm,
  'reveal': Reveal,
  'reveal-group': RevealGroup,
};

class App {
  constructor(scope = document) {
    this.scope = scope;
    this.components = [];
  }

  init() {
    for (const [hook, ComponentClass] of Object.entries(COMPONENTS)) {
      for (const el of this.scope.querySelectorAll(`[data-js="${hook}"]`)) {
        this.components.push(new ComponentClass(el));
      }
    }
    return this;
  }

  destroy() {
    for (const component of this.components) component.destroy();
    this.components = [];
  }
}

new App().init();
