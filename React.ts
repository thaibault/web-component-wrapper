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
import Tools from 'clientnode'
import {
    func, NullSymbol, PropertyTypes, UndefinedSymbol
} from 'clientnode/property-types'
import {
    CompilationResult, EvaluationResult, Mapping, TemplateFunction, ValueOf
} from 'clientnode/type'
import React, {
    Attributes,
    createElement,
    createRef,
    forwardRef,
    Fragment,
    isValidElement as isValidReactElement,
    memo as memorize,
    ReactElement,
    Ref,
    useCallback,
    useImperativeHandle
} from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import Web from './Web'
import {
    ComponentType,

    PreCompiledBaseItem,
    PreCompiledItem,
    PreCompiledItems,

    ReactRenderBaseItem,
    ReactRenderItem,
    ReactRenderItems,

    WebComponentAdapter,
    WebComponentAPI
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
 * @property static:attachWebComponentAdapterIfNotExists - Indicates whether to
 * wrap with a reference wrapper to get updated about internal state changes.
 * @property static:content - React component to wrap.
 * @property static:react - React namespace.
 *
 * @property compiledSlots - Cache of yet pre-compiled slot elements.
 * @property preparedSlots - Cache of yet evaluated slot react elements.
 *
 * @property self - Back-reference to this class.
 * @property wrapMemorizingWrapper - Determines whether to wrap component with
 * reacts memorizing wrapper to cache component render results.
 * @property isWrapped - Indicates whether react component is wrapped already.
 */
export class ReactWeb<TElement = HTMLElement> extends Web<TElement> {
    static attachWebComponentAdapterIfNotExists:boolean = true
    static content:ComponentType|string = 'div'
    static react:typeof React = React
    static _name:string = 'ReactWebComponent'

    comiledSlots:Mapping<PreCompiledItems> & {children?:PreCompiledItems} = {}
    preparedSlots:Mapping<ReactRenderItems> & {children?:ReactRenderItems} = {}

    readonly self:typeof ReactWeb = ReactWeb

    wrapMemorizingWrapper:boolean|null = null
    isWrapped:boolean = false
    // region live-cycle
    /**
     * Initializes host dom content, properties and prepares wrapped react
     * component.
     * @returns Nothing.
     */
    constructor() {
        super()
        this.applyComponentWrapper()
    }
    /**
     * Triggered when this component is mounted into the document. Event
     * handlers will be attached and final render proceed.
     *
     * @returns Nothing.
     */
    connectedCallback():void {
        /*
            Attaches event handler, grabs given slots, reflects external
            properties and enqueues first rendering.
        */
        super.connectedCallback()

        this.determineRenderScope()
        this.preCompileSlots()
    }
    /**
     * Triggered when this component is unmounted into the document. Event
     * handlers and state will be removed.
     * @returns Nothing.
     */
    disconnectedCallback():void {
        unmountComponentAtNode(this.root)
        super.disconnectedCallback()
    }
    /**
     * Method which does the rendering job. Should be called when ever state
     * changes should be projected to the hosts dom content.
     *
     * @param reason - Description why rendering is necessary.
     *
     * @returns Nothing.
     */
    render(reason:string = 'unknown'):void {
        this.determineRenderScope()

        /*
            NOTE: We prevent a nested component from further rendering since
            they will be rendered by their parent.
        */
        if (
            this.rootInstance !== this ||
            !this.dispatchEvent(new CustomEvent(
                'render', {detail: {reason, scope: this.scope}}
            ))
        )
            return

        this.evaluateSlots()
        this.prepareInternalProperties()

        this.applyShadowRootIfNotExisting()

        if (this.root !== this) {
            /*
                Remove template nodes since they will be replaced by reacts
                render result (only necessary when having a dedicated rendering
                target like shadow root).
            */
            let domNode:HTMLElement = this.firstChild
            while (domNode) {
                const nextDomNode:HTMLElement = domNode.nextSibling
                this.removeChild(domNode)
                domNode = nextDomNode
            }
        }

        render(
            createElement(this.self.content, this.internalProperties),
            this.root
        )

        /*
            NOTE: Update current instance if we have a newly created one
            otherwise check after current queue has been finished.
        */
        if (this.instance?.current)
            this.reflectInstanceProperties()
        else
            Tools.timeout(this.reflectInstanceProperties)
    }
    // endregion
    // region property handling
    /**
     * Generic property setter. Forwards field writes into internal and
     * external property representations.
     *
     * In general it is a bad idea to write properties which shadow state
     * properties (move to a controlled component instance) and re-set the
     * property to "undefined" later to lose control.
     *
     * The reason causes in avoiding this scenario:
     *
     * 1. Property overwrites state.
     * 2. State changes but is shadowed by recent changes in property.
     *
     * Ensure:
     *
     * 1. Property overwrites state.
     * 2. Property is overwritten to "undefined" to lose control over state.
     * 3. State can change post property adaption didn't take effect anymore:
     *    Communicate change back by triggering output events.
     *
     * @param name - Property name to write.
     * @param value - New value to write.
     *
     * @returns Nothing.
     */
    setPropertyValue(name:string, value:any):void {
        this.reflectProperties({[name]: Tools.copy(value, 1)})
        this.setInternalPropertyValue(name, Tools.copy(value, 1))
    }
    /**
     * Internal property setter. Respects configured aliases.
     * @param name - Property name to write.
     * @param value - New value to write.
     * @returns Nothing.
     */
    setInternalPropertyValue(name:string, value:any):void {
        if (value === null)
            value = NullSymbol
        else if (value === undefined)
            value = UndefinedSymbol

        super.setInternalPropertyValue(name, value)
    }
    // endregion
    // region handle slots
    /**
     * Converts given html dom nodes into a single react element or a react
     * element list.
     *
     * @param domNodes - Nodes to convert.
     * @param scope - Additional scope to render sub components against.
     * @param isFunction - Indicates whether given nodes should be provided as
     * function (render property).
     *
     * @returns Transformed react elements.
     */
    preCompileDomNodes(
        domNodes:Array<Node>,
        scope:Mapping<unknown> = {},
        isFunction:boolean = false
    ):PreCompiledItems {
        if (domNodes.length === 1)
            return this.preCompileDomNode(domNodes[0], scope, isFunction)

        let index:number = 1
        const result:Array<ReactRenderItem> = []
        for (const node of domNodes) {
            const element:ReactRenderItem = this.preCompileDomNode(
                node, scope, isFunction, index.toString()
            )

            if (element) {
                result.push(element)
                index += 1
            }
        }

        return result
    }
    /**
     * Converts given html dom node into a react element.
     *
     * @param domNode - Node to convert.
     * @param scope - Additional scope to render sub components against.
     * @param isFunction - Indicates whether given nodes should be provided as
     * function (render property).
     * @param key - Optional key to add to component properties.
     *
     * @returns Transformed react element.
     */
    preCompileDomNode(
        domNode:Node,
        scope:Mapping<unknown> = {},
        isFunction:boolean = false,
        key?:string,
    ):PreCompiledItem {
        // region render property
        if (isFunction) {
            const node:PreCompiledBaseItem = this.preCompileDomNode(
                domNode, {...scope, parameters: undefined}, false, key
            ) as PreCompiledBaseItem

            return (scope:Mapping<unknown>):ReactRenderItem =>
                (...parameters:Array<unknown>):ReactRenderBaseItem =>
                    node({...scope, parameters}) as ReactRenderBaseItem
        }
        // endregion
        // region text node
        if (domNode.nodeType === Node.TEXT_NODE) {
            const value:string =
                typeof (domNode as Node).nodeValue === 'string' ?
                    ((domNode as Node).nodeValue as string).trim() :
                    ''

            const result:ReactRenderItem = (key && value) ?
                createElement(Fragment, {children: value, key}) :
                value ? value : null

            return ():ReactRenderItem => result
        }
        // endregion
        if (!(domNode as HTMLElement).getAttributeNames)
            return ():ReactRenderItem => null
        // TODO
        // region known component
        /*
            TODO
            Problem they already have converted react elements in
            their "slots"! Who has the final render responsibility? Parent
            or component?
        */
        const type:typeof ReactWeb =
            (domNode as ReactWeb).constructor as typeof ReactWeb
        if (
            typeof type.content === 'object' &&
            (
                type.attachWebComponentAdapterIfNotExists === false ||
                (type.content as ComponentType).webComponentAdapterWrapped ===
                    'react'
            )
        ) {
            /*
                NOTE: Nested components are already instantiated so use their
                properties.
            */
            const properties:Mapping = (domNode as ReactWeb).internalProperties

            /*
            const evaluatedProperties:Mapping<unknown> = {}
            for (const [name, value] of Object.entries(properties)) {
                const evaluationResult:EvaluationResult = Tools.stringEvaluate(
                    value, scope, false, domNode
                )

                if (evaluationResult.error)
                    console.warn(
                        `Failed to evaluate property "${name}" for "` +
                        `${(domNode as ReactWeb).constructor._name}":`,
                        evaluationResult.error
                    )
                else
                    evaluatedProperties[name] = evaluationResult.result
            }

            if (!Object.prototype.hasOwnProperty.call(
                evaluatedProperties, 'key'
            ))
                evaluatedProperties.key = key
            */
            if (
                key && !Object.prototype.hasOwnProperty.call(properties, 'key')
            )
                properties.key = key

            this.self.removeKnownUnwantedPropertyKeys(type, properties)

            return createElement(type.content, properties)
        }
        // endregion
        // region html element
        const properties:Mapping<unknown> = {key}

        const childNodes:Array<Node> = Array.from(domNode.childNodes)
        if (childNodes.length)
            properties.children = this.preCompileDomNodes(childNodes, scope)

        for (const attributeName of (domNode as HTMLElement).getAttributeNames(
        )) {
            let value:unknown =
                (domNode as HTMLElement).getAttribute(attributeName)

            if (value === null)
                continue

            let name:string = ''
            if (attributeName.startsWith('data-bind-'))
                name = attributeName.substring('data-bind-'.length)
            else if (attributeName.startsWith('bind-'))
                name = attributeName.substring('bind-'.length)

            if (
                name.startsWith('attribute-') || name.startsWith('property-')
            ) {
                const evaluated:EvaluationResult = Tools.stringEvaluate(
                    value as string, scope, false, domNode
                )

                if (evaluated.error) {
                    console.warn(
                        'Error occurred during processing given attribute ' +
                        `binding "${attributeName}" on node:`,
                        domNode,
                        evaluated.error
                    )
                    continue
                }

                name = name.startsWith('attribute-') ?
                    name.substring('attribute-'.length) :
                    name.substring('property-'.length)

                value = evaluated.result
            } else if (name.startsWith('on-')) {
                name = Tools.stringDelimitedToCamelCase(name)

                scope = {event: undefined, parameters: undefined, ...scope}
                /*
                    NOTE: We pre-compile event listener since they should
                    usually be called more than it would be re-rendered.
                */
                const compilation:CompilationResult = Tools.stringCompile(
                    value as string, {event, ...scope}, true
                )

                if (compilation.error) {
                    console.warn(
                        'Error occurred during compiling given event ' +
                        `binding "${attributeName}" on node:`,
                        domNode,
                        compilation.error
                    )
                    continue
                }

                const templateFunction:TemplateFunction =
                    compilation.templateFunction.bind(domNode)

                value = (...parameters:Array<unknown>):void => {
                    scope.event = parameters[0]
                    scope.parameters = parameters

                    try {
                        templateFunction(
                            /*
                                NOTE: We want to be ensure to have same
                                ordering as we have for the scope names and to
                                call internal registered getter by retrieving
                                values. So simple using
                                "...Object.values(scope)" is not appreciate
                                here.
                            */
                            ...compilation.originalScopeNames.map(
                                (name:string):unknown => scope[name]
                            )
                        )
                    } catch (error) {
                        console.warn(
                            'Error occurred during processing given ' +
                            `event binding "${attributeName}" on node: `,
                            domNode,
                            `Given expression "${value}" could not be ` +
                            'evaluated with given scope names "' +
                            `${compilation.scopeNames.join('", "')}": ` +
                            Tools.represent(error)
                        )
                    }
                }
            } else
                name = attributeName

            if (name === 'inner-html') {
                properties.dangerouslySetInnerHTML = {
                    __html: ():string => value
                }
                continue
            }

            const mapping:Mapping = {
                class: 'className',
                for: 'htmlFor',
                'text-content': 'children'
            }
            if (Object.prototype.hasOwnProperty.call(mapping, name))
                name = mapping[name]

            properties[Tools.stringDelimitedToCamelCase(name)] = value
        }

        return createElement(
            (domNode as HTMLElement).tagName.toLowerCase(), properties
        )
        // endregion
    }
    /**
     * Evaluates given pre-compiled nodes into a single react element or a
     * react element list.
     *
     * @param nodes - Pre-compiled nodes.
     * @param scope - Additional scope to render sub components against.
     *
     * @returns Transformed react elements.
     */
    evaluatePreCompiledDomNodes(
        nodes:Array<PreCompiledItem>, scope:Mapping<unknown> = {}
    ):ReactRenderItems {
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
      * Forward named slots as properties to component.
      * @returns Nothing.
      */
    applySlotsToInternalProperties():void {
        for (const name in this.preparedSlots)
            if (
                Object.prototype.hasOwnProperty.call(
                    this.preparedSlots, name
                ) &&
                !Object.prototype.hasOwnProperty.call(
                    this.internalProperties, name
                )
            )
                this.internalProperties[name] = this.preparedSlots[name]
    }
    /**
     * Pre compiles and caches determined slots.
     * @returns Nothing.
     */
    preCompileSlots():void {
        this.compiledSlots = {}

        for (const name in this.slots)
            if (Object.prototype.hasOwnProperty.call(this.slots, name))
                if (name === 'default') {
                    if (this.slots.default && this.slots.default.length > 0)
                        this.compiledSlots.children = this.preCompileDomNodes(
                            this.slots.default,
                            {...this.scope, parent: this},
                            ([func, 'function'] as
                                Array<ValueOf<typeof PropertyTypes>|string>
                            ).includes(this.self.propertyTypes?.children)
                        )
                } else
                    this.compiledSlots[name] = this.preCompileDomNode(
                        this.slots[name],
                        {...this.scope, parent: this},
                        ([func, 'function'] as
                            Array<ValueOf<typeof PropertyTypes>|string>
                        ).includes(
                            this.self.propertyTypes &&
                            this.self.propertyTypes[name]
                        )
                    )
    }
    /**
     * Evaluates pre compiled slots.
     * @returns Nothing.
     */
    evaluateSlots():void {
        this.preparedSlots = {}

        for (const name in this.compiledSlots)
            if (Object.prototype.hasOwnProperty.call(this.compiledSlots, name))
                if (name === 'children') {
                    this.preparedSlots.children = evaluatePreCompiledNodes(
                        this.compiledSlots[name],
                        {...this.scope, parent: this}
                    )
                } else
                    this.preparedSlots[name] = this.compiledSlots[name](
                        {...this.scope, parent: this}
                    )
    }
    // endregion
    // region helper
    /**
     * Applies missing forward ref and or memorizing wrapper to current react
     * component.
     * @returns Nothing.
     */
    applyComponentWrapper():void {
        if (typeof this.self.content === 'string' || this.isWrapped)
            return

        this.isWrapped = true

        const wrapped:ComponentType =
            (this.self.content as ComponentType).wrapped ||
            this.self.content as ComponentType

        if ((this.self.content as ComponentType).webComponentAdapterWrapped) {
            if (this.wrapMemorizingWrapper) {
                this.self.content =
                    memorize(this.self.content as ComponentType)
                ;(this.self.content as ComponentType).wrapped = wrapped
            }
        } else if (this.self.attachWebComponentAdapterIfNotExists) {
            if (!(this.self.content as ComponentType).displayName)
                (this.self.content as ComponentType).displayName =
                    this.self._name

            this.self.content = forwardRef((
                properties:Attributes, reference:Ref<WebComponentAdapter>
            ):ReactElement => {
                useImperativeHandle(
                    reference, ():WebComponentAdapter => ({properties})
                )
                return createElement(wrapped, properties)
            }) as ComponentType

            if (
                this.wrapMemorizingWrapper ||
                this.wrapMemorizingWrapper === null
            )
                this.self.content = memorize(this.self.content)

            ;(this.self.content as ComponentType).wrapped = wrapped
            ;(this.self.content as ComponentType).webComponentAdapterWrapped =
                'react'
        } else if (this.wrapMemorizingWrapper) {
            this.self.content = memorize(this.self.content as ComponentType)
            ;(this.self.content as ComponentType).wrapped = wrapped
        }
    }
    /**
     * Prepares the properties object to render against current component.
     * Creates a reference for being recognized of reacts internal state
     * updates.
     * @returns Nothing.
     */
    prepareInternalProperties():void {
        this.applySlotsToInternalProperties()
        this.self.removeKnownUnwantedPropertyKeys(
            this.self, this.internalProperties
        )
        this.instance = createRef() as {current?:WebComponentAdapter}
        this.internalProperties.ref = this.instance
    }
    /**
     * Updates current component instance and reflects newly determined
     * properties.
     * @returns Nothing.
     */
    reflectInstanceProperties = ():void => {
        if (this.instance?.current) {
            if (
                (this.instance as {current:WebComponentAdapter}).current
                    .properties
            )
                this.reflectProperties(
                    (this.instance as {current:WebComponentAdapter}).current
                        .properties as Mapping<any>
                )
        }
    }
    /**
     * Removes unwanted known and not specified properties from given
     * properties object (usually added by dev-tools).
     * @param target - ReactElement where properties belong to.
     * @param properties - Properties object to trim.
     * @returns Nothing.
     */
    static removeKnownUnwantedPropertyKeys(
        target:typeof ReactWeb, properties:Mapping<any>
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
                            (target.content as ComponentType).propTypes, name
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
                            target.content.wrapped!.propTypes, name
                        )
                    )
                )
            )
                delete properties[name]
    }
    // endregion
}
export const api:WebComponentAPI<typeof ReactWeb> = {
    component: ReactWeb,
    register: (
        tagName:string = Tools.stringCamelCaseToDelimited(ReactWeb._name)
    ):void => customElements.define(tagName, ReactWeb)
}
export default ReactWeb
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
