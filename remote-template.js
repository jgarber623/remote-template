export default class RemoteTemplate extends HTMLElement {
  static tagName = "remote-template";

  static observedAttributes = ["src"];

  static register(tagName = this.tagName, registry = globalThis.customElements) {
    registry?.define(tagName, this);
  }

  #src = "";

  async #fetchTemplate() {
    const { document, fetch } = globalThis;

    const url = new URL(this.getAttribute("src"), document.baseURI);
    const response = await fetch(url, {
      headers: {
        accept: "text/template+html, text/html"
      }
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const shim = document.createElement("div");
    shim.innerHTML = await response.text();

    let template = shim.querySelector(`template${url.hash}`);

    if (!template) {
      template = document.createElement("template");
      template.innerHTML = shim.innerHTML;
    }

    return template;
  }

  get src() {
    return this.#src;
  }

  set src(value) {
    value = String(value);
    this.setAttribute("src", value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.#src = newValue;
  }

  async connectedCallback() {
    if (!this.hasAttribute("src")) {
      return;
    }

    let eventType;
    let eventDetail;

    try {
      this.append(await this.#fetchTemplate());

      eventType = "load";
    } catch (error) {
      eventType = "error";
      eventDetail = { error };
    }

    let eventOptions = {
      bubbles: true,
      composed: true
    };

    if (eventType === "error") {
      eventOptions.detail = eventDetail;
    }

    this.dispatchEvent(new CustomEvent(eventType, eventOptions));
  }
}

RemoteTemplate.register();
