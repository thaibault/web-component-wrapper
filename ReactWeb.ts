// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module react */
'use strict'
/* !
    region header
    [Project page](https://torben.website/web-component-wrapper)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {
    camelCaseToDelimited,
    compile,
    copy,
    delimitedToCamelCase,
    extend,
    Mapping,
    represent,
    TemplateFunction,
    timeout
} from 'clientnode'
import {
    func, NullSymbol, UndefinedSymbol
} from 'clientnode/dist/property-types'
import React, {
    Attributes,
    ComponentType as ReactComponentType,
    Fragment,
    ReactElement,
    Ref,

    createElement,
    createRef,
    forwardRef,
    memo as memorize,
    useImperativeHandle
} from 'react'
import {flushSync} from 'react-dom'
import {createRoot, Root as ReactRoot} from 'react-dom/client'

import Web from './Web'
import {
    ComponentAdapter,
    ComponentType,

    PreCompiledItem,

    ReactComponentBaseProperties,
    PropertyConfiguration,

    ReactRenderBaseItemFactory,
    ReactRenderItemFactory,
    ReactRenderItemsFactory,

    ReactRenderBaseItem,
    ReactRenderItem,
    ReactRenderItems,

    WebComponentAPI,
    WebComponentConfiguration
} from './type'
// endregion
/*
    Live cycle:

    1. Render react component with properties (defined in web-component) and
       start listing to "onChange" events.
    2. Reflect component properties to web-component properties and
       attributes (with prevented re-rendering caused by new properties).
    3. Component triggers an "onChange" event (caused by some react event)
       which delivers updated properties to the web-component.
       -> Starting with first step.
*/
/**
 * Adapter for exposing a react component as web-component.
 * @property attachWebComponentAdapterIfNotExists - Indicates whether to wrap
 * with a reference wrapper to get updated about internal state changes.
 * @property content - React component to wrap.
 * @property react - React namespace.
 * @property compiledSlots - Cache of yet pre-compiled slot elements.
 * @property preparedSlots - Cache of yet evaluated slot react elements.
 * @property rootReactInstance - Saves determined root react instance.
 * @property self - Back-reference to this class.
 * @property wrapMemorizingWrapper - Determines whether to wrap component with
 * reacts memorizing wrapper to cache component render results.
 * @property isWrapped - Indicates whether react component is wrapped already.
 */
export class ReactWeb<
    TElement = HTMLElement,
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends ReactComponentBaseProperties<TElement> =
        Mapping<unknown>
> extends Web<TElement, ExternalProperties, InternalProperties> {
    static attachWebComponentAdapterIfNotExists = true
    static content:ComponentType|string = 'div'
    static react:typeof React = React

    static _name = 'ReactWebComponent'

    compiledSlots:(
        Mapping<ReactRenderItemsFactory> &
        {children?:ReactRenderItemsFactory}
    ) = {}
    preparedSlots:Mapping<ReactRenderItems> & {children?:ReactRenderItems} = {}
    reactRoot:null|ReactRoot = null
    rootReactInstance:null|ReactWeb = null

    readonly self:typeof ReactWeb = ReactWeb

    wrapMemorizingWrapper:boolean|null = null
    isWrapped = false
    // region live-cycle
    /**
     * Triggered when this component is mounted into the document. Event
     * handlers will be attached and final render proceed.
     */
    connectedCallback() {
        this.applyComponentWrapper()

        // NOTE: Can be overwritten during optional root determining.
        this.rootReactInstance = this as unknown as ReactWeb

        /*
            Attaches event handler, grabs given slots, reflects external
            properties and enqueues first rendering.
        */
        super.connectedCallback()
    }
    /**
     * Triggered when this component is unmounted from the document. Event
     * handlers and state will be removed.
     */
    disconnectedCallback() {
        // TODO Triggers error in "web-input-material"
        // this.reactRoot?.unmount()

        super.disconnectedCallback()
    }
    /**
     * Reflects wrapped component state back to web-component's attributes.
     * @param properties - Properties to update in reflected attribute state.
     */
    reflectExternalProperties(properties:Partial<ExternalProperties>) {
        if (this.isRoot)
            super.reflectExternalProperties(properties)
    }
    /**
     * Method which does the rendering job. Should be called when ever state
     * changes should be projected to the hosts dom content.
     * @param reason - Description why rendering is necessary.
     */
    render(reason = 'unknown'):void {
        /*
            NOTE: We prevent a nested react component from self rendering since
            they will be rendered by highest react parent.
        */
        if (
            this.rootReactInstance !== this as unknown as ReactWeb ||
            !this.dispatchEvent(new CustomEvent(
                'render', {detail: {reason, scope: this.scope}}
            ))
        )
            return

        this.determineRenderScope()

        if (Object.keys(this.compiledSlots).length === 0)
            this.preCompileSlots()

        this.evaluateSlots({...this.scope, parent: this})
        this.prepareProperties(this.internalProperties)

        this.applyShadowRootIfNotExisting()

        if (this.root !== this) {
            /*
                Remove template nodes since they will be replaced by reacts
                render result (only necessary when having a dedicated rendering
                target like shadow root).
            */
            let domNode:ChildNode|null = this.firstChild
            while (domNode) {
                const nextDomNode:ChildNode|null = domNode.nextSibling
                this.removeChild(domNode)
                domNode = nextDomNode
            }
        }

        if (!this.reactRoot)
            this.reactRoot = createRoot(
                this.root,
                {
                    identifierPrefix: String(
                        this.id ||
                        this.internalProperties.id ||
                        this.externalProperties.id ||
                        (this as unknown as {name?:number|string}).name ||
                        this.internalProperties.name ||
                        this.externalProperties.name
                    )
                }
            )

        flushSync(() => {
            this.reactRoot?.render(
                createElement<InternalProperties>(
                    this.self.content as
                        ReactComponentType<InternalProperties>,
                    this.internalProperties
                )
            )
        })

        /*
            NOTE: Update current instance if we have a newly created one
            otherwise check after current queue has been finished.
        */
        if (this.instance?.current)
            this.reflectInstanceProperties()
        else
            void timeout(this.reflectInstanceProperties)
    }
    // endregion
    // region property handling
    /**
     * Generic property setter. Forwards field writes into internal and
     * external property representations.
     *
     * In general, it is a bad idea to write properties which shadow state
     * properties (move to a controlled component instance) and re-set the
     * property to "undefined" later to lose control.
     *
     * The reason causes in avoiding this scenario:
     *
     * 1. Property overwrites state.
     * 2. State changes but is shadowed by recent changes in property.
     *
     * So the following will be ensured:
     *
     * 1. Property overwrites state.
     * 2. Property is overwritten to "undefined" to lose control over state.
     * 3. Now a state change can be represented back after property adaptions.
     *    (Converts reacts declarative nature into an imperative web-component
     *    style).
     * 4. Further state changes should be communicated back via output events.
     * @param name - Property name to write.
     * @param value - New value to write.
     */
    setPropertyValue(name:string, value:unknown) {
        this.reflectProperties(
            {[name]: copy(value, 1)} as unknown as Partial<ExternalProperties>
        )
        this.setInternalPropertyValue(name, copy(value, 1))
    }
    /**
     * Internal property setter. Respects configured aliases.
     * @param name - Property name to write.
     * @param value - New value to write.
     */
    setInternalPropertyValue(name:string, value:unknown) {
        if (value === null)
            value = NullSymbol
        else if (value === undefined)
            value = UndefinedSymbol

        super.setInternalPropertyValue(name, value)
    }
    // endregion
    // region handle slots
    /**
     * Converts given html dom nodes into a compiled function to generate a
     * react-element or a react-element list.
     * @param domNodes - Nodes to convert.
     * @param scope - Additional scope to render subcomponents against.
     * Necessary to bound needed environment variables into compiled context.
     * @param isFunction - Indicates whether given render result should be
     * provided as function (render property) with bound parameters environment
     * variable name.
     * @returns Transformed react elements.
     */
    preCompileDomNodes(
        domNodes:Array<Node>, scope:Mapping<unknown> = {}, isFunction = false
    ):ReactRenderItemsFactory {
        // NOTE: We ignore empty text nodes (like reacts jsx does).
        domNodes = domNodes.filter((domNode:Node):boolean => (
            domNode.nodeType !== Node.TEXT_NODE ||
            typeof domNode.nodeValue === 'string' &&
            domNode.nodeValue.trim() !== ''
        ))

        if (domNodes.length === 1)
            return this.preCompileDomNode(domNodes[0], scope, isFunction)

        let index = 1
        const result:Array<ReactRenderItemFactory> = []
        for (const node of domNodes) {
            const element = this.preCompileDomNode(
                node, scope, isFunction, index.toString()
            )

            if (element) {
                result.push(element)
                index += 1
            }
        }

        if (isFunction)
            return (scope:Mapping<unknown>):ReactRenderItem =>
                ((...parameters:Array<unknown>):ReactRenderItem => {
                    const renderResult:Array<ReactRenderItem> = []

                    for (const factory of result) {
                        const renderItem:ReactRenderItem = factory(scope)
                        if (typeof renderItem === 'function')
                            renderResult.push(renderItem(...parameters))
                    }

                    return createElement(
                        Fragment,
                        {children: renderResult as Array<ReactRenderBaseItem>}
                    )
                }) as ReactRenderItem

        return result
    }
    /**
     * Converts given html dom node into a react-element.
     * @param domNode - Node to convert.
     * @param scope - Additional scope to render subcomponents against.
     * @param isFunction - Indicates whether given nodes should be provided as
     * function (render property).
     * @param key - Optional key to add to component properties.
     * @returns Transformed react element.
     */
    preCompileDomNode(
        domNode:Node,
        scope:Mapping<unknown> = {},
        isFunction = false,
        key?:string
    ):ReactRenderItemFactory {
        type PreCompiledInternalProperties =
            InternalProperties & {children?:ReactRenderItemsFactory}
        // region render property
        if (isFunction) {
            const node:ReactRenderBaseItemFactory = this.preCompileDomNode(
                domNode,
                {
                    ...scope,
                    data: undefined,
                    firstArgument: undefined,
                    firstParameter: undefined,
                    options: undefined,
                    scope: undefined,
                    parameters: undefined
                },
                false,
                key
            ) as ReactRenderBaseItemFactory

            return (scope:Mapping<unknown>):ReactRenderItem =>
                (...parameters:Array<unknown>):ReactRenderBaseItem => {
                    const firstArgument:unknown = parameters.length > 0 ?
                        parameters[0] :
                        null

                    return node({
                        ...scope,
                        data: firstArgument,
                        firstArgument,
                        firstParameter: firstArgument,
                        options: firstArgument,
                        scope: firstArgument,
                        parameters
                    })
                }
        }
        // endregion
        // region text node
        if (domNode.nodeType === Node.TEXT_NODE) {
            const value:string =
                typeof domNode.nodeValue === 'string' ?
                    domNode.nodeValue.trim() :
                    ''

            const result:ReactRenderItem = (key && value) ?
                createElement(Fragment, {children: value, key}) :
                value ? value : null

            return ():ReactRenderItem => result
        }
        // endregion
        if (!(domNode as HTMLElement).getAttributeNames)
            return () => null
        // region native elements and wrapped react components
        /// region prepare type and static properties
        const staticProperties = {} as PreCompiledInternalProperties
        let target:ComponentType|string

        const isComponent:boolean = this.self.isReactComponent(domNode)
        if (isComponent) {
            // region pre-compile nested render context
            (domNode as ReactWeb).determineRenderScope()

            if (Object.keys(this.compiledSlots).length === 0)
                (domNode as ReactWeb).preCompileSlots()
            // endregion
            /*
                NOTE: Nested components are already instantiated and connected
                so use their initialized properties. We need to merge them when
                actual rendering the nested component.
            */

            if (
                key &&
                !Object.prototype.hasOwnProperty.call(staticProperties, 'key')
            )
                staticProperties.key = key

            target = (domNode.constructor as typeof ReactWeb).content
        } else {
            staticProperties.key = key
            target = (domNode as HTMLElement).tagName.toLowerCase()
        }
        /// endregion
        /// region pre-compile dynamic properties
        let knownScopeNames:Array<string> = Object.keys(scope)
        const compiledProperties:Mapping<PreCompiledItem> = {}
        for (const attributeName of (domNode as HTMLElement).getAttributeNames(
        )) {
            let value:unknown =
                (domNode as HTMLElement).getAttribute(attributeName)

            if (value === null)
                continue

            let extend = false
            let name = ''
            if (attributeName.startsWith('data-bind-'))
                name = attributeName.substring('data-bind-'.length)
            else if (attributeName.startsWith('bind-'))
                name = attributeName.substring('bind-'.length)

            if (
                name.startsWith('attribute-') ||
                name === 'attributes' ||
                name.startsWith('property-') ||
                name === 'properties'
            ) {
                const {error, originalScopeNames, templateFunction} =
                    compile(value as string, knownScopeNames)

                if (error) {
                    console.warn(
                        'Error occurred during compiling given attribute ' +
                        `binding "${attributeName}" on node:`,
                        domNode,
                        error
                    )
                    continue
                }

                if (name === 'attributes' || name === 'properties')
                    extend = true
                else
                    name = name.startsWith('attribute-') ?
                        name.substring('attribute-'.length) :
                        name.substring('property-'.length)

                value = {
                    originalScopeNames,
                    templateFunction: templateFunction.bind(this)
                }
            } else if (name.startsWith('on-')) {
                name = delimitedToCamelCase(name)

                if (!Object.prototype.hasOwnProperty.call(scope, 'event'))
                    knownScopeNames = [...knownScopeNames, 'event']
                if (!Object.prototype.hasOwnProperty.call(scope, 'parameters'))
                    knownScopeNames = [...knownScopeNames, 'parameters']
                /*
                    NOTE: We pre-compile event listener since they should
                    usually be called more than it would be re-rendered.
                */
                const {
                    error, originalScopeNames, scopeNames, templateFunction
                } = compile(value as string, knownScopeNames, true)

                if (error) {
                    console.warn(
                        'Error occurred during compiling given event ' +
                        `binding "${attributeName}" on node:`,
                        domNode,
                        error
                    )
                    continue
                }

                const eventHandler:TemplateFunction =
                    templateFunction.bind(this)

                value = (...parameters:Array<unknown>):void => {
                    scope.event = parameters[0]
                    scope.parameters = parameters

                    try {
                        eventHandler(
                            /*
                                NOTE: We want to be ensure to have same
                                ordering as we have for the scope names and to
                                call internal registered getter by retrieving
                                values. So simple using
                                "...Object.values(scope)" is not appreciate
                                here.
                            */
                            ...originalScopeNames.map(
                                (name:string):unknown => scope[name]
                            )
                        )
                    } catch (error) {
                        console.warn(
                            'Error occurred during processing given ' +
                            `event binding "${attributeName}" on node: `,
                            domNode,
                            `Given expression "${value as string}" could ` +
                            'not be evaluated with given scope names "' +
                            `${scopeNames.join('", "')}": ${represent(error)}`
                        )
                    }
                }
            } else
                name = attributeName

            const mapping:Mapping = {class: 'className', for: 'htmlFor'}
            if (Object.prototype.hasOwnProperty.call(mapping, name))
                name = mapping[name]

            name = delimitedToCamelCase(name)

            if ((value as PreCompiledItem)?.originalScopeNames)
                // NOTE: "''" marks a property set like in JSX "{...props}".
                compiledProperties[extend ? '' : name] =
                    value as PreCompiledItem
            else if (!isComponent)
                /*
                    NOTE: Properties of components are evaluated already by
                    them self and set as "internalProperties". Those properties
                    which need to be evaluated against the parent scope should
                    be marked via the "bind-property-" prefix.
                    That's why they are omitted here.
                */
                (staticProperties as Mapping<unknown>)[name] = value
        }
        /// endregion
        /// region pre-compiled nested nodes of native elements
        if (!isComponent) {
            const childNodes:Array<Node> = Array.from(domNode.childNodes)
            if (childNodes.length)
                (staticProperties.children as ReactRenderItemsFactory) =
                    this.preCompileDomNodes(childNodes, scope)
        }
        /// endregion
        /// region create evaluable render function
        return (runtimeScope:Mapping<unknown>):ReactElement => {
            // region prepare scope
            runtimeScope = {...scope, ...runtimeScope}
            runtimeScope.scope = runtimeScope
            // endregion
            let properties:InternalProperties = {...staticProperties}
            // region evaluate dynamic properties
            for (const [
                name, {originalScopeNames, templateFunction}
            ] of Object.entries(compiledProperties)) {
                const value:unknown = templateFunction(
                    ...originalScopeNames.map((name:string):unknown =>
                        runtimeScope[name]
                    )
                )

                if (name === '')
                    properties = {...properties, ...value as Mapping<unknown>}
                else
                    (properties as Mapping<unknown>)[name] = value
            }
            // endregion
            // region prepare react specific element property handling
            if (
                Object.prototype.hasOwnProperty.call(properties, 'innerHTML')
            ) {
                properties.dangerouslySetInnerHTML = {
                    __html: properties.innerHTML as string
                }

                delete properties.children
                delete properties.innerHTML
            }

            if (
                Object.prototype.hasOwnProperty.call(properties, 'textContent')
            ) {
                properties.children = properties.textContent as string

                delete properties.textContent
            } else if (isComponent) {
                // region evaluate nested render contexts
                /*
                    NOTE: Properties of components are evaluated already by
                    them self and set as "internalProperties". Those properties
                    which need to be evaluated against the parent scope should
                    be marked via the "bind-property-" prefix.
                */
                properties = {
                    ...(domNode as ReactWeb).internalProperties as
                        PreCompiledInternalProperties,
                    ...properties
                }
                runtimeScope = {
                    ...properties, ...runtimeScope, parent: domNode
                }

                ;(domNode as ReactWeb).evaluateSlots(runtimeScope)
                ;(domNode as ReactWeb).prepareProperties(properties)
                // endregion
            } else if (properties.children)
                properties.children = this.evaluatePreCompiledDomNodes(
                    properties.children as ReactRenderItemsFactory,
                    runtimeScope
                ) as Array<ReactRenderBaseItem>
            // endregion
            return createElement(target as ReactComponentType, properties)
        }
        /// endregion
        // endregion
    }
    /**
     * Evaluates given pre-compiled nodes into a single react element or a
     * react element list.
     * @param nodes - Pre-compiled nodes.
     * @param scope - Additional scope to render sub components against.
     * @returns Transformed react elements.
     */
    evaluatePreCompiledDomNodes(
        nodes:ReactRenderItemsFactory, scope:Mapping<unknown> = {}
    ):ReactRenderItems {
        if (!Array.isArray(nodes))
            return nodes(scope)

        if (nodes.length === 1)
            return nodes[0](scope)

        const result:Array<ReactRenderItem> = []
        for (const node of nodes) {
            const element:ReactRenderItem = node(scope)

            if (element)
                result.push(element)
        }

        return result
    }
    /**
     * Pre compiles and caches determined slots.
     */
    preCompileSlots() {
        for (const name in this.slots)
            if (
                Object.prototype.hasOwnProperty.call(this.slots, name) &&
                name !== 'default'
            )
                this.compiledSlots[name] = this.preCompileDomNode(
                    this.slots[name],
                    {...this.scope, parent: this},
                    ([func, 'function'] as Array<PropertyConfiguration>)
                        .includes(
                            this.self.propertyTypes &&
                            this.self.propertyTypes[name]
                        )
                )

        if (this.slots.default && this.slots.default.length > 0)
            this.compiledSlots.children = this.preCompileDomNodes(
                this.slots.default,
                {...this.scope, parent: this},
                ([func, 'function'] as Array<PropertyConfiguration>)
                    .includes(this.self.propertyTypes?.children)
            )
    }
    /**
     * Evaluates pre compiled slots.
     * @param scope - To render again.
     */
    evaluateSlots(scope:Mapping<unknown>) {
        this.preparedSlots = {}

        for (const name in this.compiledSlots)
            if (Object.prototype.hasOwnProperty.call(this.compiledSlots, name))
                if (name === 'children')
                    this.preparedSlots.children =
                        this.evaluatePreCompiledDomNodes(
                            this.compiledSlots[name] as
                                Array<ReactRenderItemFactory>,
                            scope
                        )
                else
                    this.preparedSlots[name] = (
                        this.compiledSlots[name] as ReactRenderItemFactory
                    )(scope)
    }
    // endregion
    // region helper
    /**
     * Determines if given element type is a react-wrapped component.
     * @param domNode - Node to determine from.
     * @returns Boolean indicator.
     */
    static isReactComponent(domNode:Node):boolean {
        const type:typeof ReactWeb = domNode.constructor as typeof ReactWeb

        return (
            typeof type.content === 'object' &&
            (
                type.attachWebComponentAdapterIfNotExists === false ||
                type.content.webComponentAdapterWrapped === 'react'
            )
        )
    }
    /**
     * Determines initial root and react root who initializes their rendering
     * digests.
     */
    determineRootBinding() {
        super.determineRootBinding()

        let currentElement:Node|null = this.parentNode
        while (currentElement) {
            if (this.self.isReactComponent(currentElement)) {
                this.rootReactInstance = currentElement as ReactWeb
                break
            }

            currentElement = currentElement.parentNode
        }
    }
    /**
     * Applies missing forward ref and or memorizing wrapper to current react
     * component.
     */
    applyComponentWrapper():void {
        if (typeof this.self.content === 'string' || this.isWrapped)
            return

        this.isWrapped = true

        const wrapped:ComponentType =
            this.self.content.wrapped as ComponentType || this.self.content

        if (this.self.content.webComponentAdapterWrapped) {
            if (this.wrapMemorizingWrapper) {
                this.self.content =
                    memorize(this.self.content as ReactComponentType)
                this.self.content.wrapped = wrapped
            }
        } else if (this.self.attachWebComponentAdapterIfNotExists) {
            if (!this.self.content.displayName)
                this.self.content.displayName = this.self._name

            this.self.content = forwardRef((
                properties:Attributes & Mapping<unknown>,
                reference:Ref<ComponentAdapter<Attributes>>
            ):ReactElement => {
                useImperativeHandle(
                    reference,
                    ():ComponentAdapter<Attributes> => ({properties})
                )

                return createElement(wrapped as ReactComponentType, properties)
            }) as ComponentType

            if (
                this.wrapMemorizingWrapper ||
                this.wrapMemorizingWrapper === null
            )
                this.self.content =
                    memorize(this.self.content as ReactComponentType)

            this.self.content.wrapped = wrapped
            this.self.content.webComponentAdapterWrapped = 'react'
        } else if (this.wrapMemorizingWrapper) {
            this.self.content =
                memorize(this.self.content as ReactComponentType)
            this.self.content.wrapped = wrapped
        }
    }
    /**
     * Prepares given properties object to render against current component.
     * Creates a reference for being recognized of reacts internal state
     * updates.
     * @param properties - Properties to prepare.
     */
    prepareProperties(properties:InternalProperties) {
        extend(properties, this.preparedSlots as Partial<InternalProperties>)

        this.self.removeKnownUnwantedPropertyKeys(this.self, properties)

        /*
            NOTE: Provide instance if and only if not explicitly requested from
            parent via properties.
        */
        if (!properties.ref) {
            this.instance = createRef() as {current?:ComponentAdapter}
            properties.ref = this.instance
        }
    }
    /**
     * Updates current component instance and reflects newly determined
     * properties.
     */
    reflectInstanceProperties = () => {
        if (
            this.instance?.current &&
            (
                this.instance as {current:ComponentAdapter<InternalProperties>}
            ).current.properties
        )
            this.reflectProperties(
                (this.instance as {current:ComponentAdapter}).current
                    .properties as Partial<ExternalProperties>
            )
    }
    /**
     * Removes unwanted known and not specified properties from given
     * properties object (usually added by dev-tools).
     * @param target - ReactElement where properties belong to.
     * @param properties - Properties object to trim.
     */
    static removeKnownUnwantedPropertyKeys(
        target:typeof ReactWeb, properties:Mapping<unknown>
    ):void {
        if (typeof target.content === 'string')
            return

        // NOTE: Known root of errors caused by browsers dev-tools.
        for (const name of ['isRoot', 'isTrusted', '__composed'] as const)
            if (
                Object.prototype.hasOwnProperty.call(properties, name) &&
                (
                    (
                        Object.prototype.hasOwnProperty.call(
                            target.content, 'propTypes'
                        ) &&
                        !Object.prototype.hasOwnProperty.call(
                            target.content.propTypes, name
                        )
                    ) ||
                    (
                        Object.prototype.hasOwnProperty.call(
                            target.content, 'wrapped'
                        ) &&
                        Object.prototype.hasOwnProperty.call(
                            target.content.wrapped, 'propTypes'
                        ) &&
                        !Object.prototype.hasOwnProperty.call(
                            (
                                target.content.wrapped as
                                    WebComponentConfiguration
                            ).propTypes,
                            name
                        )
                    )
                )
            )
                delete properties[name]
    }
    // endregion
}
export const api:WebComponentAPI<
    HTMLElement,
    Mapping<unknown>,
    ReactComponentBaseProperties,
    typeof ReactWeb
> = {
    component: ReactWeb,
    register: (tagName:string = camelCaseToDelimited(ReactWeb._name)):void =>
        customElements.define(tagName, ReactWeb)
}
export default ReactWeb
