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
import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Web from './Web'
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
 * @property self - Back-reference to this class.
 *
 * @property _content - React component to wrap.
 */
export class ReactWeb<TElement = HTMLElement> extends Web<TElement> {
    readonly self:typeof ReactWeb = ReactWeb

    _content:typeof Component = 'div'
    // region helper
    /**
     * Updates current component instance and reflects newly determined
     * properties.
     * @returns Nothing.
     */
    reflectInstanceProperties():void {
        if (this.properties.ref.current) {
            this.instance = this.properties.ref
            if (this.instance.current.properties)
                this.reflectProperties(this.instance.current.properties, false)
        }
    }
    // endregion
    // region live-cycle
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
        ReactDOM.render(
            React.createElement(this._content, this.properties), this.root
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
}
export default ReactWeb
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
