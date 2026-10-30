// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import type {Mapping} from 'clientnode'

import type {
    AttributesReflectionConfiguration,
    CompiledDomNodeTemplateItem,
    ComponentType,
    PropertiesConfiguration,
    WebComponentAPI
} from './type'

import {timeout} from 'clientnode'
import {
    boolean, func, number, object, string
} from 'clientnode/property-types'
import {createElement, FunctionComponent, ReactElement} from 'react'

import {afterEach, describe, expect, jest, test} from '@jest/globals'

import property from './decorator'
import wrapAsWebComponent from './index'
import ReactWeb from './ReactWeb'

import Web, {log} from './Web'
// endregion
// region helper
let tagNameCounter = 0
/**
 * Registers given component class under a unique tag name and creates an
 * (unconnected) instance of it.
 * @param type - Component class to instantiate.
 * @returns Created instance.
 */
const createInstance = <Type extends Web>(type: new () => Type): Type => {
    tagNameCounter += 1
    const tagName = `test-instance-${String(tagNameCounter)}`

    customElements.define(tagName, type)

    return document.createElement(tagName) as Type
}
/**
 * Silences and returns a spy on the web component logger's warn method.
 * @returns Created spy.
 */
const mockWarn = () =>
    jest.spyOn(log, 'warn')
        .mockImplementation((): Promise<void> => Promise.resolve())

afterEach((): void => {
    jest.restoreAllMocks()
})
// endregion
// region Web
describe('Web', (): void => {
    test('constructor', (): void => {
        /**
         * Mock Test class.
         */
        class WebTest extends Web {
            static observedAttributes = ['is-root', 'on-click', 'on-event']
        }

        expect(WebTest).toHaveProperty('content')
        expect(WebTest).toHaveProperty('observedAttributes')

        customElements.define('test-web', WebTest)
        const web = document.createElement('test-web') as
            WebTest & {onClick: () => void}

        expect(web).not.toHaveProperty('clicked')

        web.setAttribute('on-click', 'this.clicked = true')
        expect(web).not.toHaveProperty('clicked')

        document.body.appendChild(web)

        expect(web).toHaveProperty('rootInstance', web)

        expect(web).not.toHaveProperty('clicked')
        web.onClick()
        expect(web).toHaveProperty('clicked', true)

        const clickCallback = jest.fn()
        web.addEventListener('click', clickCallback)
        expect(clickCallback).not.toHaveBeenCalled()
        web.onClick()
        expect(clickCallback).toHaveBeenCalled()
    })
    /// region static helper
    test('hasCode', (): void => {
        expect(Web.hasCode(undefined)).toStrictEqual(false)
        expect(Web.hasCode(null)).toStrictEqual(false)
        expect(Web.hasCode(1)).toStrictEqual(false)
        expect(Web.hasCode({})).toStrictEqual(false)
        expect(Web.hasCode('')).toStrictEqual(false)
        expect(Web.hasCode('plain text')).toStrictEqual(false)
        expect(Web.hasCode('${ without end')).toStrictEqual(false)
        expect(Web.hasCode('end without start }')).toStrictEqual(false)
        expect(Web.hasCode('} wrong order ${')).toStrictEqual(false)
        expect(Web.hasCode('${}')).toStrictEqual(false)

        expect(Web.hasCode('${a}')).toStrictEqual(true)
        expect(Web.hasCode('Hello ${name}!')).toStrictEqual(true)
        expect(Web.hasCode('${\n    a\n}')).toStrictEqual(true)
    })
    test('normalizePropertyTypeList', (): void => {
        expect(Web.normalizePropertyTypeList('isRoot'))
            .toStrictEqual(new Map([['isRoot', boolean]]))
        expect(Web.normalizePropertyTypeList(['isRoot', 'unknown']))
            .toStrictEqual(new Map([['isRoot', boolean]]))
        expect(Web.normalizePropertyTypeList([]))
            .toStrictEqual(new Map())
        expect(Web.normalizePropertyTypeList({a: string, b: 'number'}))
            .toStrictEqual(new Map([['a', string], ['b', 'number']]))
    })
    /// endregion
    /// region properties
    test('generateAliasIndex/getPropertyAlias', (): void => {
        /**
         * Mock test class.
         */
        class AliasWeb extends Web {
            static propertyAliases = {alternateName: 'name'}
            static propertyTypes: PropertiesConfiguration = {
                ...Web.propertyTypes, name: string
            }
        }

        const web = createInstance(AliasWeb)

        expect(AliasWeb._propertyAliasIndex).toStrictEqual(
            {alternateName: 'name', name: 'alternateName'}
        )
        // Source configuration should not be touched.
        expect(AliasWeb.propertyAliases)
            .toStrictEqual({alternateName: 'name'})

        expect(web.getPropertyAlias('alternateName')).toStrictEqual('name')
        expect(web.getPropertyAlias('name')).toStrictEqual('alternateName')
        expect(web.getPropertyAlias('unknown')).toBeNull()
        // Inherited object properties should not be interpreted as alias.
        expect(web.getPropertyAlias('toString')).toBeNull()
    })
    test('set(Internal|External)PropertyValue', (): void => {
        /**
         * Mock test class.
         */
        class AliasWeb extends Web {
            static propertyAliases = {alternateName: 'name'}
        }

        const web = createInstance(AliasWeb)

        web.setExternalPropertyValue('name', 'external')
        expect(web.externalProperties).toHaveProperty('name', 'external')
        expect(web.externalProperties)
            .toHaveProperty('alternateName', 'external')
        expect(web.internalProperties).not.toHaveProperty('name')

        web.setInternalPropertyValue('alternateName', 'internal')
        expect(web.internalProperties).toHaveProperty('name', 'internal')
        expect(web.internalProperties)
            .toHaveProperty('alternateName', 'internal')
        expect(web.externalProperties).toHaveProperty('name', 'external')

        web.setInternalPropertyValue('other', 1)
        expect(web.internalProperties).toHaveProperty('other', 1)
        expect(web.internalProperties).not.toHaveProperty('alternateOther')
    })
    test('getPropertyValue/isStateProperty', (): void => {
        const web = createInstance(class extends Web {})

        web.setInternalPropertyValue('internal', 'internal')
        web.setExternalPropertyValue('internal', 'shadowed')
        web.setExternalPropertyValue('external', 'external')

        expect(web.getPropertyValue('internal')).toStrictEqual('internal')
        expect(web.getPropertyValue('external')).toStrictEqual('external')
        expect(web.getPropertyValue('unknown')).toBeUndefined()
        expect(web.isStateProperty('internal')).toStrictEqual(false)

        const onClick = (): void => {
            // Do nothing.
        }
        web.setInternalPropertyValue('onClick', onClick)
        web.instance = {current: {
            properties: {internal: 'wrapped'},
            state: {modelState: {model: 'model'}, state: 'state'}
        }}

        // Wrapped component properties should win.
        expect(web.getPropertyValue('internal')).toStrictEqual('wrapped')
        // State should win over everything.
        expect(web.getPropertyValue('state')).toStrictEqual('state')
        // Base properties should not be shadowed.
        expect(web.getPropertyValue('onClick')).toStrictEqual(onClick)

        expect(web.isStateProperty('state')).toStrictEqual(true)
        expect(web.isStateProperty('model')).toStrictEqual(true)
        expect(web.isStateProperty('internal')).toStrictEqual(false)
    })
    test('evaluateStringOrNullAndSetAsProperty', (): void => {
        /**
         * Mock test class.
         */
        class AttributeWeb extends Web {
            static propertyAliases = {alternateLabel: 'label'}
            static propertyTypes: PropertiesConfiguration = {
                ...Web.propertyTypes,
                config: 'json',
                count: number,
                data: object,
                flag: boolean,
                label: string,
                onSelect: func
            }
        }

        const web = createInstance(AttributeWeb)
        const set = (name: string, value: null | string): void => {
            web.evaluateStringOrNullAndSetAsProperty(name, value)
        }
        const internal = web.internalProperties
        const external = web.externalProperties
        const warn = mockWarn()

        // Unknown properties are ignored.
        set('unknown', 'value')
        expect(internal).not.toHaveProperty('unknown')

        // region boolean
        set('flag', '')
        expect(internal).toHaveProperty('flag', true)
        expect(external).toHaveProperty('flag', true)
        set('flag', 'false')
        expect(internal).toHaveProperty('flag', false)
        set('flag', 'true')
        expect(internal).toHaveProperty('flag', true)
        set('flag', null)
        expect(internal).toHaveProperty('flag', false)
        expect(external).toHaveProperty('flag', false)
        // endregion
        // region number
        set('count', '2.5')
        expect(internal).toHaveProperty('count', 2.5)
        expect(external).toHaveProperty('count', 2.5)
        set('count', 'not a number')
        expect(internal).toHaveProperty('count', undefined)
        set('count', null)
        expect(internal).toHaveProperty('count', null)
        // endregion
        // region string
        set('label', 'text')
        expect(internal).toHaveProperty('label', 'text')
        expect(external).toHaveProperty('label', 'text')
        set('label', null)
        expect(internal).toHaveProperty('label', null)
        // Attribute names are converted and aliases are respected.
        set('alternate-label', 'aliased')
        expect(internal).toHaveProperty('label', 'aliased')
        expect(internal).toHaveProperty('alternateLabel', 'aliased')
        // endregion
        // region json
        set('config', '{"a": {"b": 1}}')
        expect(internal).toHaveProperty('config', {a: {b: 1}})
        expect(external).toHaveProperty('config', {a: {b: 1}})
        expect(external.config).not.toBe(internal.config)
        set('config', '')
        expect(internal).toHaveProperty('config', null)
        expect(external).toHaveProperty('config', null)

        expect(warn).not.toHaveBeenCalled()
        set('config', '{invalid')
        expect(warn).toHaveBeenCalledTimes(1)
        // Previous value is kept.
        expect(internal).toHaveProperty('config', null)
        // endregion
        // region evaluated (default)
        set('data', '[1, 2]')
        expect(internal).toHaveProperty('data', [1, 2])
        expect(external).toHaveProperty('data', [1, 2])

        set('data', null)
        expect(internal).toHaveProperty('data', null)

        web.setAttribute('data', '')
        set('data', '')
        expect(internal).toHaveProperty('data', true)
        web.removeAttribute('data')

        set('data', '(')
        expect(warn).toHaveBeenCalledTimes(2)
        expect(internal).toHaveProperty('data', true)
        // endregion
        // region pre-evaluation
        set('-count', '1 + 2')
        expect(internal).toHaveProperty('count', 3)
        expect(external).toHaveProperty('count', 3)

        // Pre-evaluated strings are not interpreted as numbers.
        set('-label', '`a` + `b`')
        expect(internal).toHaveProperty('label', 'ab')

        // Empty pre-evaluation values are ignored.
        set('-count', '')
        expect(internal).toHaveProperty('count', 3)

        set('-count', '(')
        expect(warn).toHaveBeenCalledTimes(3)
        expect(internal).toHaveProperty('count', undefined)
        expect(external).toHaveProperty('count', 3)
        // endregion
    })
    test('evaluateStringOrNullAndSetAsProperty (function)', (): void => {
        /**
         * Mock test class.
         */
        class HandlerWeb extends Web {
            static propertyTypes: PropertiesConfiguration = {
                ...Web.propertyTypes, onSelect: func
            }
        }

        const web = createInstance(HandlerWeb) as
            InstanceType<typeof HandlerWeb> & {selected?: unknown}
        const getHandler = (): ((...parameters: Array<unknown>) => unknown) =>
            (web.internalProperties as Mapping<() => unknown>).onSelect
        const selectCallback = jest.fn()
        web.addEventListener('select', selectCallback)
        const warn = mockWarn()

        web.evaluateStringOrNullAndSetAsProperty(
            'on-select', 'this.selected = event'
        )
        expect(web.externalProperties)
            .toHaveProperty('onSelect', expect.any(Function))
        expect(web).not.toHaveProperty('selected')

        getHandler()('value', 'second')
        expect(web).toHaveProperty('selected', 'value')
        expect(selectCallback).toHaveBeenCalledTimes(1)
        expect(selectCallback.mock.calls[0][0])
            .toHaveProperty('detail.parameters', ['value', 'second'])

        // A runtime error is caught and the event is still forwarded.
        web.evaluateStringOrNullAndSetAsProperty(
            'on-select', 'event.not.existing'
        )
        expect(getHandler()(undefined)).toBeUndefined()
        expect(warn).toHaveBeenCalledTimes(1)
        expect(selectCallback).toHaveBeenCalledTimes(2)

        // A compile error is reported and external property is left as is.
        const externalHandler =
            web.externalProperties.onSelect
        web.evaluateStringOrNullAndSetAsProperty('on-select', '(')
        expect(warn).toHaveBeenCalledTimes(2)
        expect(web.externalProperties)
            .toHaveProperty('onSelect', externalHandler)
        expect(getHandler()()).toBeUndefined()
        expect(selectCallback).toHaveBeenCalledTimes(3)
    })
    /// endregion
    /// region events
    test('forwardEvent', (): void => {
        const web = createInstance(class extends Web {})

        const callbacks: Mapping<ReturnType<typeof jest.fn>> = {}
        for (const name of ['fooBar', 'on', 'onX', 'plain']) {
            callbacks[name] = jest.fn()
            web.addEventListener(name, callbacks[name])
        }

        expect(web.forwardEvent('onFooBar', [1, 2])).toStrictEqual(true)
        expect(callbacks.fooBar).toHaveBeenCalledTimes(1)
        expect(callbacks.fooBar.mock.calls[0][0])
            .toHaveProperty('detail.parameters', [1, 2])

        // Too short names are not interpreted as handler names.
        web.forwardEvent('on', [])
        expect(callbacks.on).toHaveBeenCalledTimes(1)
        web.forwardEvent('onX', [])
        expect(callbacks.onX).toHaveBeenCalledTimes(1)

        web.forwardEvent('plain', [])
        expect(callbacks.plain).toHaveBeenCalledTimes(1)

        web.addEventListener('plain', (event: Event): void => {
            event.preventDefault()
        })
        // Not cancelable events can not be prevented.
        expect(web.forwardEvent('plain', [])).toStrictEqual(true)
    })
    test('addSecureEventListener/unregisterDomNodeEventBindings', (): void => {
        const web = createInstance(class extends Web {})
        const domNode = document.createElement('div')

        const firstHandler = jest.fn()
        const deregister =
            web.addSecureEventListener(domNode, 'click', firstHandler)
        domNode.dispatchEvent(new Event('click'))
        expect(firstHandler).toHaveBeenCalledTimes(1)

        deregister()
        expect(web.domNodeEventBindings.size).toStrictEqual(0)
        domNode.dispatchEvent(new Event('click'))
        expect(firstHandler).toHaveBeenCalledTimes(1)

        const focusHandler = jest.fn()
        web.addSecureEventListener(domNode, 'focus', focusHandler)
        web.addSecureEventListener(window, 'resize', focusHandler)

        // A new handler for the same event replaces the old one.
        web.addSecureEventListener(domNode, 'click', firstHandler)
        const secondHandler = jest.fn()
        web.addSecureEventListener(domNode, 'click', secondHandler)
        domNode.dispatchEvent(new Event('click'))
        expect(firstHandler).toHaveBeenCalledTimes(1)
        expect(secondHandler).toHaveBeenCalledTimes(1)

        expect(web.domNodeEventBindings.get(domNode)?.size).toStrictEqual(2)
        expect(web.domNodeEventBindings.size).toStrictEqual(2)

        web.unregisterDomNodeEventBindings()
        expect(web.domNodeEventBindings.size).toStrictEqual(0)
        domNode.dispatchEvent(new Event('click'))
        domNode.dispatchEvent(new Event('focus'))
        window.dispatchEvent(new Event('resize'))
        expect(secondHandler).toHaveBeenCalledTimes(1)
        expect(focusHandler).not.toHaveBeenCalled()
    })
    /// endregion
    /// region templates
    test('evaluateDomNodeTemplate', (): void => {
        const web = createInstance(class extends Web {})

        const domNode = document.createElement('div')
        domNode.innerHTML =
            'Hello ${name}!<span>${name.length}</span><x-nested>${name}' +
            '</x-nested><p>static</p>'

        web.evaluateDomNodeTemplate(domNode, {name: 'World'})
        expect(domNode.innerHTML).toStrictEqual(
            'Hello World!<span>5</span><x-nested>${name}</x-nested>' +
            '<p>static</p>'
        )
        expect(web.domNodeTemplateCache.has(domNode)).toStrictEqual(true)

        // Compiled templates are cached and therefore re-evaluable.
        web.evaluateDomNodeTemplate(domNode, {name: 'you'})
        expect(domNode.innerHTML).toStrictEqual(
            'Hello you!<span>3</span><x-nested>${name}</x-nested>' +
            '<p>static</p>'
        )

        // A separate cache leads to a fresh compilation.
        const otherDomNode = document.createElement('div')
        otherDomNode.innerHTML = '<span>${a}</span>${a}'
        const domNodeTemplateCache = new Map()
        web.evaluateDomNodeTemplate(
            otherDomNode,
            {a: 'b'},
            {
                domNodeTemplateCache,
                filter: (domNode: Node): boolean => domNode.nodeName !== 'SPAN'
            }
        )
        expect(otherDomNode.innerHTML).toStrictEqual('<span>${a}</span>b')
        expect(domNodeTemplateCache.has(otherDomNode)).toStrictEqual(true)
        expect(web.domNodeTemplateCache.has(otherDomNode))
            .toStrictEqual(false)

        // Nested components can be traversed explicitly.
        const nestedDomNode = document.createElement('div')
        nestedDomNode.innerHTML = '<x-nested>${a}</x-nested>'
        web.evaluateDomNodeTemplate(
            nestedDomNode, {a: 'b'}, {ignoreNestedComponents: false}
        )
        expect(nestedDomNode.innerHTML).toStrictEqual('<x-nested>b</x-nested>')

        // Given components itself are ignored by default.
        const componentDomNode = document.createElement('x-component')
        componentDomNode.innerHTML = '${a}'
        web.evaluateDomNodeTemplate(componentDomNode, {a: 'b'})
        expect(componentDomNode.innerHTML).toStrictEqual('${a}')
    })
    test('evaluateDomNodeTemplate (unsafe)', (): void => {
        const web = createInstance(class extends Web {})

        const domNode = document.createElement('div')
        domNode.innerHTML = '<b>${name}</b>'
        web.evaluateDomNodeTemplate(
            domNode, {name: '<i>markup</i>'}, {unsafe: true}
        )
        expect(domNode.innerHTML).toStrictEqual('<b><i>markup</i></b>')

        // Safe rendering escapes markup.
        const safeDomNode = document.createElement('div')
        safeDomNode.innerHTML = '<b>${name}</b>'
        web.evaluateDomNodeTemplate(safeDomNode, {name: '<i>markup</i>'})
        expect(safeDomNode.innerHTML)
            .toStrictEqual('<b>&lt;i&gt;markup&lt;/i&gt;</b>')

        // Nodes without code are not compiled in unsafe mode.
        const plainDomNode = document.createElement('div')
        plainDomNode.innerHTML = '<b>plain</b>'
        expect(web.compileDomNodeTemplate(plainDomNode, [], {unsafe: true}))
            .toBeNull()

        // Grabbed templates are used when no content exists.
        const templateDomNode = document.createElement('div') as
            HTMLDivElement & {template: string}
        templateDomNode.template = '${a}'
        expect(web.compileDomNodeTemplate(
            templateDomNode, ['a'], {unsafe: true}
        )).toHaveProperty('template', '${a}')
    })
    test('evaluateCompiledDomNodeTemplate', (): void => {
        const web = createInstance(class extends Web {})
        const domNode = document.createTextNode('')
        const item = (
            properties: Partial<CompiledDomNodeTemplateItem>
        ): CompiledDomNodeTemplateItem =>
            ({domNode, children: [], ...properties})
        const warn = mockWarn()

        expect(web.evaluateCompiledDomNodeTemplate(item({}), {})).toBeNull()
        expect(web.evaluateCompiledDomNodeTemplate(
            item({templateFunction: (): string => 'a'}), {}
        )).toBeNull()

        expect(web.evaluateCompiledDomNodeTemplate(
            item({
                scopeNames: ['a', 'b'],
                templateFunction: (...parameters: Array<unknown>): string =>
                    parameters.join('-')
            }),
            {a: 'A', b: 'B', c: 'C'}
        )).toStrictEqual('A-B')
        expect(warn).not.toHaveBeenCalled()

        expect(web.evaluateCompiledDomNodeTemplate(
            item({
                error: 'compile error',
                scopeNames: [],
                templateFunction: (): string => 'a'
            }),
            {}
        )).toBeNull()
        expect(warn).toHaveBeenCalledTimes(1)

        expect(web.evaluateCompiledDomNodeTemplate(
            item({
                scopeNames: [],
                templateFunction: (): string => {
                    throw new Error('runtime error')
                }
            }),
            {}
        )).toBeNull()
        expect(warn).toHaveBeenCalledTimes(2)
    })
    /// endregion
    /// region slots
    test('grabGivenSlots', (): void => {
        const web = createInstance(class extends Web {})
        web.innerHTML =
            '<div slot="header">Header</div>' +
            '<x-nested><div slot="inner">Inner</div></x-nested>' +
            '<span> Default </span>'

        web.grabGivenSlots()

        expect(web.slots.header).toBe(web.firstChild)
        // Slots of nested components are left to them.
        expect(web.slots).not.toHaveProperty('inner')
        // Without explicit default slot all children are used.
        expect(web.slots.default).toStrictEqual(Array.from(web.childNodes))

        const explicitWeb = createInstance(class extends Web {})
        explicitWeb.innerHTML =
            '<div slot="default">Default</div><span>Other</span>'
        explicitWeb.grabGivenSlots()
        expect(explicitWeb.slots.default)
            .toStrictEqual([explicitWeb.firstChild])

        const emptyWeb = createInstance(class extends Web {})
        emptyWeb.grabGivenSlots()
        expect(emptyWeb.slots).toStrictEqual({default: []})
    })
    test('grabSlotContent', (): void => {
        const web = createInstance(class extends Web {})

        const templateSlot = document.createElement('div')
        templateSlot.className = 'web-component-template'
        templateSlot.innerHTML = '<textarea>${name}</textarea>'

        const grabbed = web.grabSlotContent(templateSlot) as
            HTMLElement & {template: string}
        expect(grabbed).not.toBe(templateSlot)
        expect(grabbed).toHaveProperty('template', '${name}')
        expect(grabbed.innerHTML).toStrictEqual('')
        expect(grabbed.classList.contains('web-component-template'))
            .toStrictEqual(false)
        // Source node is untouched to allow re-instantiation.
        expect(templateSlot.classList.contains('web-component-template'))
            .toStrictEqual(true)
        expect(templateSlot.innerHTML)
            .toStrictEqual('<textarea>${name}</textarea>')

        templateSlot.firstElementChild?.setAttribute(
            'data-no-template', 'false'
        )
        expect(web.grabSlotContent(templateSlot))
            .toHaveProperty('template', '${name}')

        templateSlot.firstElementChild?.setAttribute('data-no-template', '')
        expect(web.grabSlotContent(templateSlot)).toBe(templateSlot)

        const plainSlot = document.createElement('div')
        plainSlot.innerHTML = '<span>content</span>'
        expect(web.grabSlotContent(plainSlot)).toBe(plainSlot)
        const textSlot = document.createTextNode('text')
        expect(web.grabSlotContent(textSlot)).toBe(textSlot)

        const cloningWeb = createInstance(class extends Web {
            static cloneSlots = true
        })
        const cloned = cloningWeb.grabSlotContent(plainSlot)
        expect(cloned).not.toBe(plainSlot)
        expect(cloned.isEqualNode(plainSlot)).toStrictEqual(true)
    })
    /// endregion
    /// region render
    test('determineRenderScope', (): void => {
        const web = createInstance(class extends Web {
            static _name = 'ScopeTest'
        })
        web.setInternalPropertyValue('internal', 'value')

        web.determineRenderScope({given: 'given'})

        expect(web.scope).toHaveProperty('given', 'given')
        expect(web.scope).toHaveProperty('internal', 'value')
        expect(web.scope).toHaveProperty('self', web)
        expect(web.scope).toHaveProperty('scopeTest', web)
        expect(web.scope).toHaveProperty('rootInstance', web)
        expect(web.scope.scope).toBe(web.scope)

        const child = createInstance(class extends Web {
            static _name = ''
        })
        child.parentInstance = web
        child.determineRenderScope()

        // Parent scope is inherited.
        expect(child.scope).toHaveProperty('given', 'given')
        expect(child.scope).toHaveProperty('parentInstance', web)
        // Fallback name.
        expect(child.scope).toHaveProperty('instance', child)
        expect(child.scope).toHaveProperty('self', child)
    })
    /// endregion
})
// endregion
// region ReactWeb
describe('ReactWeb', (): void => {
    test('constructor', async (): Promise<void> => {
        let triggerOnEvent: (() => void) | undefined
        let componentProperty = 'initial'

        const component: FunctionComponent<{
            property: string
            onEvent?: () => void
            /*
                eslint-disable @typescript-eslint/no-useless-default-assignment
            */
        }> = ({onEvent, property = componentProperty}): ReactElement => {
            /*
                eslint-enable @typescript-eslint/no-useless-default-assignment
            */
            triggerOnEvent = onEvent
            componentProperty = property

            return createElement('div', {className: property})
        }

        /**
         * Mock test class.
         */
        class TestReactWeb<
            TElement = HTMLElement,
            ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
            InternalProperties extends Mapping<unknown> = Mapping<unknown>
        > extends ReactWeb<TElement, ExternalProperties, InternalProperties> {
            static _name = 'Test'

            static content = component as ComponentType
            static observedAttributes = ['is-root', 'on-click', 'on-event']
            static propertyTypes: PropertiesConfiguration = {
                ...Web.propertyTypes,

                onEvent: func,

                property: string
            }

            readonly self = TestReactWeb
        }

        expect(TestReactWeb).toHaveProperty('content')
        expect(TestReactWeb).toHaveProperty('observedAttributes')

        customElements.define('test-react', TestReactWeb)
        const react = document.createElement('test-react') as
            TestReactWeb &
            {
                property: string

                onClick: () => void
                onEvent: () => void
            }

        expect(react).not.toHaveProperty('clicked')
        react.setAttribute('on-click', 'this.clicked = true')
        expect(react).toHaveProperty('onClick')
        expect(react).not.toHaveProperty('clicked')

        react.setAttribute('on-event', 'this.eventHappened = true')
        expect(react).toHaveProperty('onEvent')

        expect(triggerOnEvent).not.toBeDefined()

        document.body.appendChild(react)

        expect(react).toHaveProperty('rootInstance', react)
        expect(react).toHaveProperty('reactRoot')

        expect(triggerOnEvent).not.toBeDefined()
        await timeout()
        expect(triggerOnEvent).toBeDefined()

        expect(react).not.toHaveProperty('eventHappened')
        if (triggerOnEvent)
            triggerOnEvent()
        expect(react).toHaveProperty('eventHappened', true)

        const eventCallback = jest.fn()
        react.addEventListener('event', eventCallback)
        expect(eventCallback).not.toHaveBeenCalled()
        if (triggerOnEvent)
            triggerOnEvent()
        expect(eventCallback).toHaveBeenCalled()

        expect(react).not.toHaveProperty('clicked')
        react.onClick()
        expect(react).toHaveProperty('clicked', true)

        const clickCallback = jest.fn()
        react.addEventListener('click', clickCallback)
        expect(clickCallback).not.toHaveBeenCalled()
        react.onClick()
        expect(clickCallback).toHaveBeenCalled()

        expect(componentProperty).toStrictEqual('initial')
        expect(document.querySelector('div')?.className)
            .toStrictEqual('initial')

        react.property = 'test'
        await timeout()
        expect(react).toHaveProperty('property', 'test')
        expect(document.querySelector('div')?.className).toStrictEqual('test')
    })
    test('isReactComponent', (): void => {
        const domNode = (type: Mapping<unknown>): Node =>
            ({constructor: type}) as unknown as Node

        expect(ReactWeb.isReactComponent(domNode({content: 'template'})))
            .toStrictEqual(false)
        expect(ReactWeb.isReactComponent(domNode({content: () => null})))
            .toStrictEqual(false)
        expect(ReactWeb.isReactComponent(domNode({content: {}})))
            .toStrictEqual(true)
        expect(ReactWeb.isReactComponent(domNode({
            attachWebComponentAdapterIfNotExists: true, content: {}
        }))).toStrictEqual(false)
        expect(ReactWeb.isReactComponent(domNode({
            attachWebComponentAdapterIfNotExists: true,
            content: {webComponentAdapterWrapped: 'react'}
        }))).toStrictEqual(true)
    })
    test('removeKnownUnwantedPropertyKeys', (): void => {
        const remove = (
            content: unknown, properties: Mapping<unknown>
        ): Mapping<unknown> => {
            ReactWeb.removeKnownUnwantedPropertyKeys(
                {content} as unknown as typeof ReactWeb, properties
            )

            return properties
        }
        const properties = (): Mapping<unknown> =>
            ({__composed: true, isRoot: true, isTrusted: true, other: 1})

        expect(remove('template', properties())).toStrictEqual(properties())
        // Without any type information nothing is known to be unwanted.
        expect(remove({}, properties())).toStrictEqual(properties())

        expect(remove({propTypes: {}}, properties())).toStrictEqual({other: 1})
        expect(remove({propTypes: {isRoot: boolean}}, properties()))
            .toStrictEqual({isRoot: true, other: 1})

        expect(remove(
            {wrapped: {propTypes: {isTrusted: boolean}}}, properties()
        )).toStrictEqual({isTrusted: true, other: 1})
        expect(remove({wrapped: {}}, properties())).toStrictEqual(properties())
    })
})
// endregion
// region decorator
/* eslint-disable @typescript-eslint/no-extraneous-class */
describe('decorator', (): void => {
    test('property (attribute reading and types)', (): void => {
        /**
         * Mock base class.
         */
        class Base {
            static observedAttributes: Array<string> = ['base']
            static propertyTypes: PropertiesConfiguration = {base: string}
        }
        /**
         * Mock test class.
         */
        class Target extends Base {
            static existing = 1
        }

        property()(Target.prototype, 'fooBar')
        property({type: number})(Target.prototype, 'count')
        property({readAttribute: false, type: boolean})(
            Target.prototype, 'hidden'
        )
        // Duplicates are not added twice.
        property()(Target.prototype, 'fooBar')
        // Symbols are ignored.
        property()(Target.prototype, Symbol('symbol'))

        expect(Target.observedAttributes)
            .toStrictEqual(['base', 'foo-bar', 'count'])
        expect(Target.propertyTypes).toStrictEqual({
            base: string, count: number, fooBar: string, hidden: boolean
        })
        // Parent configurations stay untouched.
        expect(Base.observedAttributes).toStrictEqual(['base'])
        expect(Base.propertyTypes).toStrictEqual({base: string})

        // Existing static members are only overwritten via "update".
        property({type: number})(Target.prototype, 'existing')
        expect(Target.propertyTypes).not.toHaveProperty('existing')
        property({type: number, update: true})(Target.prototype, 'existing')
        expect(Target.propertyTypes).toHaveProperty('existing', number)

        // Explicitly given "self" references are respected.
        /**
         * Mock self class.
         */
        class Self {}
        property({type: undefined})({self: Self}, 'viaSelf')
        expect(Self).toHaveProperty('observedAttributes', ['via-self'])
        expect(Self).not.toHaveProperty('propertyTypes')
    })
    test('property (attribute writing and aliases)', (): void => {
        /**
         * Mock array based class.
         */
        class ArrayTarget {
            static propertiesToReflectAsAttributes: Array<string> = ['base']
            static propertyAliases = {base: 'alternateBase'}
        }
        property({writeAttribute: true})(ArrayTarget.prototype, 'label')
        property({writeAttribute: true})(ArrayTarget.prototype, 'label')
        property({alias: 'alternateName'})(ArrayTarget.prototype, 'other')

        expect(Array.from(ArrayTarget.propertiesToReflectAsAttributes))
            .toStrictEqual(['base', 'label'])
        expect(ArrayTarget.propertyAliases)
            .toStrictEqual({base: 'alternateBase', other: 'alternateName'})

        /**
         * Mock map based class.
         */
        class MapTarget {
            static normalizePropertyTypeList = (
                value: AttributesReflectionConfiguration
            ) => Web.normalizePropertyTypeList(value)
            static propertiesToReflectAsAttributes: (
                Array<string> | Map<string, unknown>
            ) = ['isRoot']
        }
        // Explicitly given types convert lists to maps.
        property({writeAttribute: number})(MapTarget.prototype, 'count')
        expect(MapTarget.propertiesToReflectAsAttributes)
            .toBeInstanceOf(Map)
        expect(Array.from(
            (MapTarget.propertiesToReflectAsAttributes as Map<string, unknown>)
                .entries()
        )).toStrictEqual([['isRoot', boolean], ['count', number]])

        /**
         * Mock object based class.
         */
        class ObjectTarget {
            static propertiesToReflectAsAttributes:
                PropertiesConfiguration = {base: string}
        }
        property({type: boolean, writeAttribute: true})(
            ObjectTarget.prototype, 'flag'
        )
        property({writeAttribute: string})(ObjectTarget.prototype, 'flag')
        property({update: true, writeAttribute: number})(
            ObjectTarget.prototype, 'base'
        )
        expect(ObjectTarget.propertiesToReflectAsAttributes)
            .toStrictEqual({base: number, flag: boolean})

        // Without type information nothing will be reflected.
        /**
         * Mock untyped class.
         */
        class UntypedTarget {}
        property({type: undefined, writeAttribute: true})(
            UntypedTarget.prototype, 'label'
        )
        expect(UntypedTarget)
            .toHaveProperty('propertiesToReflectAsAttributes', [])
    })
})
/* eslint-enable @typescript-eslint/no-extraneous-class */
// endregion
// region index
describe('index', (): void => {
    test('wrapAsWebComponent', (): void => {
        const componentAPI: WebComponentAPI<typeof ReactWeb> =
            wrapAsWebComponent<FunctionComponent<unknown>>(
                (): ReactElement => createElement('div'),
                'TestComponent',
                {
                    eventToPropertyMapping: {},
                    propertyAliases: {alternateName: 'name'},
                    propertiesToReflectAsAttributes: [],
                    propTypes: {name: 'string'}
                }
            )

        expect(componentAPI).toHaveProperty('component')
        expect(componentAPI).toHaveProperty('register')

        expect(componentAPI.component).toHaveProperty('_name', 'TestComponent')
        expect(componentAPI.component)
            .toHaveProperty('propertyTypes.name', 'string')
        expect(componentAPI.component)
            .toHaveProperty('propertiesToReflectAsAttributes', ['isRoot'])
        expect(componentAPI.component)
            .toHaveProperty('eventToPropertyMapping', {})

        expect(componentAPI.component.observedAttributes).toStrictEqual(
            expect.arrayContaining([
                'name', 'alternate-name', '-name', '-alternate-name'
            ])
        )
        expect(componentAPI.component.propertyAliases)
            .toHaveProperty('alternateName', 'name')
    })
    test('wrapAsWebComponent (name determination)', (): void => {
        const component = (
            properties: Mapping<unknown> = {}
        ): FunctionComponent<unknown> & Mapping<unknown> =>
            Object.assign(
                (): ReactElement => createElement('div'), properties
            )

        expect(wrapAsWebComponent(component()).component)
            .toHaveProperty('_name', 'NoName')
        expect(wrapAsWebComponent(component(), 'src/path/Hint.tsx').component)
            .toHaveProperty('_name', 'Hint')
        expect(wrapAsWebComponent(component(), 'Hint.tsx').component)
            .toHaveProperty('_name', 'Hint')
        expect(wrapAsWebComponent(component(), 'Hint.ts').component)
            .toHaveProperty('_name', 'Hint.ts')
        expect(wrapAsWebComponent(
            component({___types: {name: {name: 'Typed'}}}), 'Hint'
        ).component).toHaveProperty('_name', 'Typed')
        expect(wrapAsWebComponent(
            component({_name: 'Explicit', ___types: {name: {name: 'Typed'}}}),
            'Hint'
        ).component).toHaveProperty('_name', 'Explicit')
    })
    test('wrapAsWebComponent (configuration merging)', (): void => {
        const component = Object.assign(
            (): ReactElement => createElement('div'),
            {
                controllableProperties: ['value'],
                eventToPropertyMapping: {onChange: (): null => null},
                internalProperties: {internal: 'component'},
                propTypes: {value: 'string'},
                propertiesToReflectAsAttributes: new Map([['value', 'string']]),
                renderProperties: ['render']
            }
        )

        const ConcreteComponent = wrapAsWebComponent(component).component

        expect(ConcreteComponent.controllableProperties)
            .toStrictEqual(['value'])
        expect(ConcreteComponent.eventToPropertyMapping)
            .toStrictEqual(component.eventToPropertyMapping)
        expect(ConcreteComponent.eventToPropertyMapping)
            .not.toBe(component.eventToPropertyMapping)
        expect(ConcreteComponent.renderProperties).toStrictEqual(['render'])
        // Base class reflected properties are added to given maps.
        expect(Array.from(
            (
                ConcreteComponent.propertiesToReflectAsAttributes as
                    Map<string, unknown>
            ).entries()
        )).toStrictEqual([['value', 'string'], ['isRoot', boolean]])

        const ConfiguredComponent = wrapAsWebComponent(
            component,
            'Configured',
            {
                attachWebComponentAdapterIfNotExists: false,
                eventToPropertyMapping: null,
                internalProperties: {internal: 'configuration'},
                propertiesToReflectAsAttributes: {value: 'string'},
                renderProperties: []
            }
        ).component

        expect(ConfiguredComponent.attachWebComponentAdapterIfNotExists)
            .toStrictEqual(false)
        expect(ConfiguredComponent.eventToPropertyMapping).toBeNull()
        expect(ConfiguredComponent.renderProperties).toStrictEqual([])
        // Base class reflected properties are added to given objects.
        expect(ConfiguredComponent.propertiesToReflectAsAttributes)
            .toStrictEqual({isRoot: boolean, value: 'string'})

        const NullComponent = wrapAsWebComponent(
            Object.assign(
                (): ReactElement => createElement('div'),
                {eventToPropertyMapping: null}
            )
        ).component
        expect(NullComponent.eventToPropertyMapping).toBeNull()
        expect(NullComponent.attachWebComponentAdapterIfNotExists)
            .toStrictEqual(true)
        expect(NullComponent.renderProperties)
            .toStrictEqual(ReactWeb.renderProperties)
    })
    test('wrapAsWebComponent (register)', (): void => {
        const component = (): ReactElement => createElement('div')

        wrapAsWebComponent<FunctionComponent<unknown>>(
            component, 'RegisterTest'
        ).register()
        expect(customElements.get('register-test')).toBeDefined()

        wrapAsWebComponent<FunctionComponent<unknown>>(
            component, 'RegisterTest'
        ).register('custom-tag')
        expect(customElements.get('custom-tag')).toBeDefined()
    })
})
//  endregion
