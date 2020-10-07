// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module react-input-material */
'use strict'
/* !
    region header
    [Project page](https://torben.website/react-material-input)

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
import {Mapping} from 'clientnode/type'
import {
    Attributes,
    createElement,
    createRef,
    forwardRef,
    Fragment,
    memo as memorize,
    ReactElement,
    Ref,
    useCallback,
    useImperativeHandle
} from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import Web from './Web'
import {ComponentType, WebComponentAdapter} from './type'
// endregion
/*
    Livecycle:

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
 * @property static:content - React component to wrap.
 *
 * @property self - Back-reference to this class.
 */
export class ReactWeb<TElement = HTMLElement> extends Web<TElement> {
    static content:string|ComponentType = 'div'
    static _name:string = 'ReactWebComponent'

    readonly self:typeof ReactWeb = ReactWeb
    // region live-cycle
    /**
     * Triggered when this component is mounted into the document. Event
     * handlers will be attached and final render proceed.
     * @returns Nothing.
     */
    connectedCallback():void {
        if (
            this.self.content !== 'string' &&
            !(this.self.content as ComponentType).webComponentAdapterWrapped
        ) {
            if (!(this.self.content as ComponentType).displayName)
                (this.self.content as ComponentType).displayName =
                    this.self._name

            const wrapped:ComponentType = this.self.content as ComponentType

            this.self.content = memorize(forwardRef((
                properties:Attributes, reference:Ref<WebComponentAdapter>
            ):ReactElement => {
                useImperativeHandle(
                    reference,
                    useCallback(
                        ():WebComponentAdapter => ({properties}),
                        [properties]
                    )
                )
                return createElement(wrapped, properties)
            })) as ComponentType
            (this.self.content as ComponentType).wrapped = wrapped;
            (this.self.content as ComponentType).webComponentAdapterWrapped =
                'react'
        }
        super.connectedCallback()
    }
    /**
     * Triggered when this component is unmounted into the document. Event
     * handlers and state will be removed.
     * @returns Nothing.
     */
    disconnectedCallback():void {
        unmountComponentAtNode(this.root)
    }
    /**
     * Method which does the rendering job. Should be called when ever state
     * changes should be projected to the hosts dom content.
     * @returns Nothing.
     */
    render():void {
        this.properties.ref = createRef()
        if (!this.instance)
            this.instance = this.properties.ref

        this.applySlotsToProperties()

        render(createElement(this.self.content, this.properties), this.root)
        /*
            NOTE: Update current instance if we have a newly created one
            otherwise check after current queue has been finished.
        */
        if (this.properties.ref.current)
            this.reflectInstanceProperties()
        else 
            Tools.timeout(this.reflectInstanceProperties.bind(this))

    }
    // endregion
    // region helper
    /**
     * Converts given html dom node into a react element.
     * @param domNode - Node to convert.
     * @returns Transformed react element.
     */
    convertDomNodeIntoReactElement(
        domNode:Node, key?:string
    ):null|ReactElement {
        if (domNode.nodeType === Node.TEXT_NODE) {
            const value:string =
                typeof (domNode as Node).nodeValue === 'string' ?
                (domNode as Node).nodeValue.trim() :
                ''
            return (key && value) ?
                createElement(Fragment, {children: value, key}) :
                value ? value : null
        }
        const type:typeof Web = (domNode as Web).constructor as typeof Web
        if (
            typeof type.content === 'object' &&
            (type.content as ComponentType).webComponentAdapterWrapped ===
                'react'
        ) {
            const properties = {key}
            /*
            for (const attribute of domNode.attributes)
                properties[attribute.name] = attribute.value
            console.log('TODO what about nested property:', properties)
            */
            // TODO what about children?
            properties.children = domNode.nodeValue
            return createElement(type.content, properties)
        }
        return createElement(
            (domNode as HTMLElement).tagName.toLowerCase(),
            {
                dangerouslySetInnerHTML: {
                    __html: (domNode as HTMLElement).innerHTML || ''
                },
                key
            }
        )
    }
    /**
      * Forward named slots as properties to component.
      * @returns Nothing.
      */
    applySlotsToProperties():void {
        for (let name in this.slots)
            if (Object.prototype.hasOwnProperty.call(this.slots, name))
                if (
                    name === 'default' &&
                    this.slots.default &&
                    this.slots.default.length > 0 &&
                    !Object.prototype.hasOwnProperty.call(
                        this.properties, 'default'
                    )
                ) {
                    if (this.slots.default.length === 1)
                        this.properties.children =
                            this.convertDomNodeIntoReactElement(
                                this.slots.default[0]
                            )
                    else {
                        let index:number = 1
                        this.properties.children = []
                        for (const node of this.slots.default) {
                            const element:null|ReactElement =
                                this.convertDomNodeIntoReactElement(
                                    node, index.toString()
                                )
                            if (element) {
                                this.properties.children.push(element)
                                index += 1
                            }
                        }
                    }
                } else if (!Object.prototype.hasOwnProperty.call(
                    this.properties, name
                ))
                    this.properties[name] = this.slots[name]
    }
    /**
     * Updates current component instance and reflects newly determined
     * properties.
     * @returns Nothing.
     */
    reflectInstanceProperties():void {
        if (this.properties.ref.current) {
            this.instance = this.properties.ref
            if (
                (this.instance as {current:WebComponentAdapter}).current
                    .properties
            )
                this.reflectProperties(
                    (this.instance as {current:WebComponentAdapter}).current
                        .properties as Mapping<any>,
                    false
                )
        }
    }
    // endregion
}
export default ReactWeb
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
