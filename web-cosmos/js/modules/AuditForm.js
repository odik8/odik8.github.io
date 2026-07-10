import { Component } from './Component.js';

/**
 * [data-js="audit-form"] — lead form for the free SEO audit. On a valid
 * submit the form is swapped for the success message ([data-js="success"]);
 * the wrapper is an aria-live region, so the swap is announced, and focus
 * moves to the success title.
 */
export class AuditForm extends Component {
  init() {
    this.form = this.find('form');
    this.success = this.find('success');
    this.successTitle = this.find('success-title');
    this.onSubmit = (e) => this.submit(e);
    this.form.addEventListener('submit', this.onSubmit);
  }

  submit(e) {
    e.preventDefault();
    if (!this.form.reportValidity()) return;

    this.form.hidden = true;
    this.success.hidden = false;
    this.successTitle.focus();
  }

  destroy() {
    this.form.removeEventListener('submit', this.onSubmit);
  }
}
