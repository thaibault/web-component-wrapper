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
import {ComponentType as ReactComponentType} from 'react'

import ReactWeb from './React'
// endregion
// region exports
export type EventToPropertyMapping =
    Mapping<true|((...parameter:Array<any>) => Mapping<any>)>
export type AttributesReflectionConfiguration =
    Array<string>|Map<string, string|ValueOf<typeof PropertyTypes>>|string|{[key:string]:ValueOf<typeof PropertyTypes>|string}
export interface WebComponentConfiguration {
    attachWebComponentAdapterIfNotExists?:boolean
    eventToPropertyMapping?:EventToPropertyMapping
    propertiesToReflectAsAttributes?:AttributesReflectionConfiguration
    propertyAliases?:Mapping
    propTypes?:Mapping<ValueOf<typeof PropertyTypes>>
}
export interface StaticWebComponent extends WebComponentConfiguration {
    webComponentAdapterWrapped?:string
    wrapped?:any

    _name?:string
    ___types?:{name?:{name?:string}}
}
export type ComponentType = ReactComponentType & StaticWebComponent
export interface WebComponentAdapter<Properties = Mapping<any>, State = Mapping<any>> {
    properties?:Properties
    state?:State
}
export type WebComponentAPI<WebComponent extends typeof ReactWeb = typeof ReactWeb> = {
    component:WebComponent
    register:(tagName?:string) => void
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
