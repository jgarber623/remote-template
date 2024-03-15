export default class MobyDick extends HTMLElement {
  connectedCallback() {
    this.addEventListener("load", this);
    this.addEventListener("error", this);
  }

  disconnectedCallback() {
    this.removeEventListener("load", this);
    this.removeEventListener("error", this);
  }

  handleEvent(event) {
    this[`on${event.type}`](event);
  }

  onload() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(this.querySelector("template").content.cloneNode(true));

    this.removeEventListener("load", this);
    this.removeEventListener("error", this);
  }

  onerror(event) {
    console.error("Error loading remote template:", event.detail.error);
  }
}

globalThis.customElements.define("moby-dick", MobyDick);
