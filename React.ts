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
import React, {
    Attributes,
    forwardRef,
    memo as memorize,
    ReactElement,
    Ref,
    useCallback,
    useImperativeHandle
} from 'react'
import ReactDOM from 'react-dom'

import Web from './Web'
import {ComponentType, WebComponentAdapter} from './type'
// endregion
/*
    1. Render react component with properties (defined in web-component) and
       start listing to "onChange" events.
    2. Reflect components properties to web-components properties and
       attributes (with prevented re-rendering caused by new properties).
    3. Component triggers an "onChange" event (caused by some event) which
       delivers updated properties to the web-component.
    -> Starting with first point.
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
                return React.createElement(wrapped, properties)
            })) as ComponentType
            (this.self.content as ComponentType).wrapped = wrapped;
            (this.self.content as ComponentType).webComponentAdapterWrapped =
                true
        }
        super.connectedCallback()
    }
    /**
     * Triggered when this component is unmounted into the document. Event
     * handlers and state will be removed.
     * @returns Nothing.
     */
    disconnectedCallback():void {
        ReactDOM.unmountComponentAtNode(this.root)
    }
    /**
     * Method which does the rendering job. Should be called when ever state
     * changes should be projected to the hosts dom content.
     * @returns Nothing.
     */
    render():void {
        this.properties.ref = React.createRef()
        if (!this.instance)
            this.instance = this.properties.ref

        this.applySlotsToProperties()

        ReactDOM.render(
            React.createElement(this.self.content, this.properties), this.root
        )
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
                )
                    this.properties.children = (
                        this.slots.default.length === 1 &&
                        this.slots.default[0].nodeType === Node.TEXT_NODE
                    ) ?
                        this.slots.default[0].nodeValue :
                        React.createElement(
                            'div',
                            {dangerouslySetInnerHTML: {
                                __html: this.slots.default
                            }}
                        )
                else if (!Object.prototype.hasOwnProperty.call(
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
