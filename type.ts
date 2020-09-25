// -*- coding: utf-8 -*-
/** @module type */
'use strict'
/* !
    region header
    [Project page](https://torben.website/storelocator)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import PropertyTypes from 'clientnode/property-types'
import {Mapping, ValueOf} from 'clientnode/type'
import {Component, FunctionComponent} from 'react'

import ReactWeb from './adapter/React'
// endregion
// region exports
export type Output = Mapping<true|((...parameter:Array<any>) => Mapping<any>)>
export type WebComponentAPI = {
    component:ReactWeb;
    register:(tagName:string) => void;
}
export interface StaticReactWebComponent {
    output?:Output
    propertiesToReflectAsAttributes?:Map<string, boolean>
    propTypes?:Mapping<ValueOf<typeof PropertyTypes>>
    wrapped?:Component|FunctionComponent<any>
}
export interface ReactWebComponent {
    properties?:Mapping<any>
    state?:Mapping<any>
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
