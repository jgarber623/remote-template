# `<remote-template>` Web Component

**A dependency-free [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components) that fetches a URL and appends the response to a [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).**

[![npm](https://img.shields.io/npm/v/@jgarber/remote-template.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@jgarber/remote-template)
[![Downloads](https://img.shields.io/npm/dt/@jgarber/remote-template.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@jgarber/remote-template)
[![Build](https://img.shields.io/github/actions/workflow/status/jgarber623/remote-template/ci.yml?branch=main&logo=github&style=for-the-badge)](https://github.com/jgarber623/remote-template/actions/workflows/ci.yml)

🐶 🧩 **[See `<remote-template>` in action!](https://jgarber623.github.io/remote-template/example)**

## Getting `<remote-template>`

You've got several options for adding this Web Component to your project:

- [Download a release](https://github.com/jgarber623/remote-template/releases) from GitHub and do it yourself _(old school)_.
- Install using [npm](https://www.npmjs.com/package/@jgarber/remote-template): `npm install @jgarber/remote-template --save`
- Install using [Yarn](https://yarnpkg.com/en/package/@jgarber/remote-template): `yarn add @jgarber/remote-template`

## Usage

First, add this `<script>` element to your page which defines the `<remote-template>` Web Component:

```html
<script type="module" src="remote-template.js"></script>
```

The `<remote-template>` Web Component may then be used to append a `<template>` element loaded from a remote URL:

```html
<remote-template src="/templates/basic.html"></remote-template>
```

The response text of `basic.html` is queried for a `<template>` element. If none is found, this Web Component treats the response text as a "bare" template, wrapping a `<template>` element around the contents before appending to the DOM.

The following two examples are functionally equivalent:

```html
<template>
  <p>Hello, world!</p>
</template>
```

```html
<p>Hello, world!</p>
```

You may also use a fragment identifier to append a specific `<template>` from a collection of templates embedded in a single HTML file:

```html
<remote-template src="/templates/collection.html#template-2"></remote-template>
```

The HTML file at `/templates/collection.html` may contain something like:

```html
<template id="template-1">
  <p>Hello from Template #1!</p>
</template>

<template id="template-2">
  <p>Hello from Template #2!</p>
</template>
```

> [!NOTE]
> Fragment identifiers _can_ match attributes other than `id`. For the purposes of this Web Component, fragment identifiers are considered `id` attribute values.

This Web Component may also be embedded in other Web Components to achieve various effects:

```html
<parent-component>
  <remote-template src="/templates/shared.html"></remote-template>

  <p slot="greeting">Call me Ishmael.</p>
</parent-component>
```

> [!TIP]
> See the [Events](#events) documentation below for details on how to respond to events dispatched by the `<remote-template>` Web Component.

> [!IMPORTANT]
> Unfortunately, this implementation will not work with [Declarative Shadow DOM](https://github.com/mfreed7/declarative-shadow-dom). In that mode, `<template>` elements must be present in the document when the HTML parser executes.

### HTTP Request Headers

When fetching remote templates, this Web Component uses the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with the following [HTTP request header](https://developer.mozilla.org/en-US/docs/Glossary/Request_header):

```txt
Accept: text/template+html, text/html
```

Note that `text/template+html` is not an official [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types). You can just like… make things up. Despite this, its presence may be useful if you configure your application server to respond differently based on this value. Otherwise, [plain old semantic HTML](https://microformats.org/wiki/posh) works just fine.

## Events

The `<remote-template>` Web Component dispatches a `load` event after the remote template has been successfully fetched and appended to the DOM. Listening for this event is most useful when embedding a `<remote-template>` within another Web Component.

```js
connectedCallback() {
  this.addEventListener("load", this);
}

handleEvent(event) {
  if (event.type === "load") {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(this.querySelector("template").content.cloneNode(true));
  }
}
```

An `error` event may be emitted if the Web Component encounters a problem loading the remote template. In this case, the underyling `Error` may be accessed by inspecting the event's `detail` property.

```js
connectedCallback() {
  this.addEventListener("error", this);
}

handleEvent(event) {
  if (event.type === "error") {
    console.error("Error loading remote template:", event.detail.error);
  }
}
```

## License

The `<remote-template>` Web Component is freely available under the [MIT License](https://opensource.org/licenses/MIT).
