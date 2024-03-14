export default class ComponentName extends HTMLElement {
  static tagName = "component-name";

  static register(tagName = this.tagName, registry = globalThis.customElements) {
    registry?.define(tagName, this);
  }

  connectedCallback() {}
}

ComponentName.register();
