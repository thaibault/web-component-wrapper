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
import {NullSymbol, UndefinedSymbol} from 'clientnode/property-types'
import {Mapping} from 'clientnode/type'
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
import {ComponentType, WebComponentAdapter, WebComponentAPI} from './type'
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
 * @property preparedSlots - Cache of yet converted slot elements to their
 * react pendants.
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

    preparedSlots:Mapping<null|ReactElement|string> & {
        children?:Array<ReactElement|string>|null|ReactElement|string
    } = {}

    readonly self:typeof ReactWeb = ReactWeb

    wrapMemorizingWrapper:boolean|null = null
    isWrapped:boolean = false
    // region live-cycle
    /**
     * Triggered when this component is mounted into the document. Event
     * handlers will be attached and final render proceed.
     * @returns Nothing.
     */
    connectedCallback():void {
        this.applyComponentWrapper()

        super.connectedCallback()

        this.prepareSlots()

        /*
            We apply properties initially to allow wrapping components access
            them during there slot preparations.
        */
        this.applySlotsToInternalProperties()
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
     * @returns Nothing.
     */
    render():void {
        this.prepareInternalProperties()
        /*
            NOTE: We prevent a nested component from further rendering since
            they will be rendered by their parent.
        */
        if (this.hasParentWithPreparedSlots())
            return

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
     * @param domNodes - Nodes to convert.
     * @returns Transformed react elements.
     */
    convertDomNodesIntoReactElements(
        nodes:Array<Node>
    ):Array<ReactElement|string>|null|ReactElement|string {
        if (nodes.length === 1)
            return this.convertDomNodeIntoReactElement(nodes[0])
        let index:number = 1
        const result:Array<ReactElement|string> = []
        for (const node of nodes) {
            const element:null|ReactElement|string =
                this.convertDomNodeIntoReactElement(node, index.toString())
            if (element) {
                result.push(element)
                index += 1
            }
        }
        return result
    }
    /**
     * Converts given html dom node into a react element.
     * @param node - Node to convert.
     * @returns Transformed react element.
     */
    convertDomNodeIntoReactElement(
        node:Node, key?:string
    ):null|ReactElement|string {
        if (node.nodeType === Node.TEXT_NODE) {
            const value:string = typeof (node as Node).nodeValue === 'string' ?
                ((node as Node).nodeValue as string).trim() :
                ''
            return (key && value) ?
                createElement(Fragment, {children: value, key}) :
                value ? value : null
        }
        const type:typeof ReactWeb =
            (node as ReactWeb).constructor as typeof ReactWeb
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
            const properties:Mapping<any> =
                (node as ReactWeb).internalProperties ?? {}
            if (!Object.prototype.hasOwnProperty.call(properties, 'key'))
                properties.key = key
            this.self.removeKnownUnwantedPropertyKeys(type, properties)

            return createElement(type.content, properties)
        }
        return createElement(
            (node as HTMLElement).tagName.toLowerCase(),
            {
                children: this.convertDomNodesIntoReactElements(
                    Array.from(node.childNodes)
                ),
                key
            }
        )
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
     * Converts yet determined slots into react components and caches the
     * result.
     * @returns Nothing.
     */
    prepareSlots():void {
        this.preparedSlots = {}
        for (const name in this.slots)
            if (Object.prototype.hasOwnProperty.call(this.slots, name))
                if (name === 'default') {
                    if (this.slots.default && this.slots.default.length > 0)
                        this.preparedSlots.children =
                            this.convertDomNodesIntoReactElements(
                                this.slots.default
                            )
                } else
                    this.preparedSlots[name] =
                        this.convertDomNodeIntoReactElement(this.slots[name])
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
     * Determines whether their exist a parent which should trigger this
     * component to render.
     * @returns A boolean indicating whether their is such parent.
     */
    hasParentWithPreparedSlots():boolean {
        let parent:Element|null = this.parentElement
        while (parent) {
            if ((parent as ReactWeb).preparedSlots)
                return true
            parent = parent.parentElement
        }
        return false
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
        for (const name of ['isRoot', 'isTrusted', '__composed'])
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
