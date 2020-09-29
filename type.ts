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
import {ComponentType} from 'react'

import ReactWeb from './React'
// endregion
// region exports
export type Output = Mapping<true|((...parameter:Array<any>) => Mapping<any>)>
export interface StaticReactWebComponent {
    output?:Output
    propertiesToReflectAsAttributes?:Map<string, boolean>
    propTypes?:Mapping<ValueOf<typeof PropertyTypes>>
    wrapped?:ComponentType<any>
}
export interface WebComponentAdapter<Properties = Mapping<any>, State = Mapping<any>> {
    properties?:Properties
    state?:State
}
export type WebComponentAPI = {
    component:ReactWeb
    register:(tagName:string) => void
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
