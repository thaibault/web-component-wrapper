<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*-
region header
Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

License
-------

This library written by Torben Sickert stands under a creative commons naming
3.0 unported license. See https://creativecommons.org/licenses/by/3.0/deed.de
endregion -->

Project status
--------------

[![npm](https://img.shields.io/npm/v/web-component-wrapper?color=%23d55e5d&label=npm%20package%20version&logoColor=%23d55e5d&style=for-the-badge)](https://www.npmjs.com/package/web-component-wrapper)
[![npm downloads](https://img.shields.io/npm/dy/web-component-wrapper.svg?style=for-the-badge)](https://www.npmjs.com/package/web-component-wrapper)

[![build](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/build.yaml?style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/build.yaml)
[![build push package](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/build-package-and-push.yaml?label=build%20push%20package&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/build-package-and-push.yaml)

[![check types](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/check-types.yaml?label=check%20types&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/check-types.yaml)
[![lint](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/lint.yaml?label=lint&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/lint.yaml)
[![test](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/test-coverage-report.yaml?label=test&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/test-coverage-report.yaml)

[![code coverage](https://img.shields.io/coverallsCoverage/github/thaibault/web-component-wrapper?label=code%20coverage&style=for-the-badge)](https://coveralls.io/github/thaibault/web-component-wrapper)

[![deploy web documentation](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/deploy-web-documentation.yaml?label=deploy%20web%20documentation&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/deploy-web-documentation.yaml)
[![web documentation](https://img.shields.io/website-up-down-green-red/https/torben.website/web-component-wrapper.svg?label=web-documentation&style=for-the-badge)](https://torben.website/web-component-wrapper)

Use case
--------

Encapsulate your components as web-components.

<div class="wd-table-of-contents">
    <h2 id="content">Content<!--deDE:Inhalt--></h2>
    <!--wd-table-of-contents-->
</div>

<!--|deDE:Installation-->
Installation
------------

You can install via package manager, simply download the compiled version as
zip file here and inject or request via cdn in HTML:
<!--deDE:
    Sie können das Paket über den Paketmanager installieren oder einfach die
    kompilierte Version als ZIP-Datei hier herunterladen und in HTML einbinden
    oder über ein CDN abrufen:
-->

```bash
npm install web-component-wrapper
```

```TypeScript
import {func, object} from 'clientnode/property-types'
import {property} from 'web-component-wrapper/decorator'
import {Web} from 'web-component-wrapper/Web'

export class MyWebComponent<
    TElement = HTMLElement,
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends Mapping<unknown> = Mapping<unknown>
> extends Web<TElement, ExternalProperties, InternalProperties> {
    static content = `
        <div class="wrapper" on-click="this.rootInstance.onClick(event)">
            <slot>Please provide a template to transclude.</slot>
        </div>
    `
    
    @property({type: object})
    options = {} as Options

    @property({type: func})
    onClick: (event: MouseEvent) => Promise<void> = NOOP
    /**
     * Defines dynamic getter and setter interface and resolves a configuration
     * object. Initializes the map implementation.
     */
    constructor() {
        super()
        /*
            Babel property declaration transformation overwrites defined
            properties at the end of an implicit constructor. So we have to
            redefine them as long as we want to declare expected component
            interface properties to enable static type checks.
        */
        this.defineGetterAndSetterInterface()
    }
    /**
     * Triggered when ever a given attribute has changed and triggers to update
     * configured dom content.
     * @param name - Attribute name which was updates.
     * @param newValue - New updated value.
     * @returns Returns when attribute has been updated.
     */
    async onUpdateAttribute(name: string, newValue: string): Promise<void> {
        await super.onUpdateAttribute(name, newValue)

        // ...
    }
    /**
     * Updates controlled dom elements.
     * @param reason - Why an update has been triggered.
     * @param resolveRendering - Indicates whether rendering should be resolved
     * finally. Should be set to "false" via super calls in inherited render
     * methods which do further dom manipulations afterward and resolve the
     * rendering process by their own.
     * @returns A promise resolving when rendering has finished. A promise may
     * be needed for classes inheriting from this class.
     */
    async render(reason = 'unknown', resolveRendering = true): Promise<void> {
        await super.render(reason, false)

        await this.waitForNestedComponentRendering()

        // ...

        await this.resolveRenderingPromiseIfSet(reason, resolveRendering)
    }
    
    // ...
}

customElements.define('my-web-component', MyWebComponent)
```

<!--|deDE:Beispiele-->
Examples
--------

<!--|deDE:Lade via CDN-->
### Load via CDN

<!--showExample:hidden-->

```HTML
<script
    src="https://unpkg.com/web-component-wrapper@latest/dist/bundle/index.js"
></script>
```

<!--|deDE:Einfaches Web-Component Beispiel-->
### Simple Web-Component

<!--showExample:JavaScript-->

```JavaScript
class MyGreeting extends webComponentWrapper.Web {
    static doRender = true
    static evaluateSlots = true
    static determineRootBinding = false
    static content = '<div>Hello ${this.name}</div>'
}
// Alternative to the decorator syntax:
webComponentWrapper.property()({self: MyGreeting}, 'name')

customElements.define('my-greeting', MyGreeting)
```

<!--showExample-->

```HTML
<my-greeting name="World"></my-greeting>
```

<!--|deDE:Einfaches React-Web-Component Beispiel-->
### Simple React-Web-Component

```JavaScript
class MyReactGreeting extends webComponentWrapper.ReactWeb {
    static doRender = true
    static evaluateSlots = true
    // Content has a react component to wrap.
    static content = ({name}) => <div>Hello {name}</div>
}
// Alternative to the decorator syntax:
webComponentWrapper.property()({self: MyReactGreeting}, 'name')

customElements.define('my-react-greeting', MyReactGreeting)
```

### Data-Flow

Data can flow into a component via

- External property set `instance.value = 'value'`
- Trigger Events `instance.triggerEvent('click')`

Data can be communicated back via:

- Properties `log.info(instance.value)`
- Observable events `instance.addEventListener('click', (event) => console.log(event.detail.value))`

#### Configuring Data-Flow

A Web-Component-Wrapper component forwards (transformed) given properties into
a wrapped React component via `props` and reads data via provided callbacks
as part of `props` or as part of reacts `ref` object.
