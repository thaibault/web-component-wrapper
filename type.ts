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
import {Mapping, TemplateFunction, ValueOf} from 'clientnode/type'
import {ComponentType as ReactComponentType, ReactElement} from 'react'

import Web from './Web'
// endregion
// region exports
export type CompiledDomNodeTemplateItem = {
    children:Array<CompiledDomNodeTemplate>
    error:null|string
    scopeNames:Array<string>
    template:string
    templateFunction:TemplateFunction
}
export type CompiledDomNodeTemplate<NodeType = Node> =
    Map<NodeType, CompiledDomNodeTemplateItem>

export type EventCallbackMapping = Map<string, () => void>
export type EventMapping<
    ExternalPropertiesType = Mapping<unknown>,
    InternalPropertiesType = Mapping<unknown>
> = [ExternalPropertiesType, InternalPropertiesType]|ExternalPropertiesType
export type EventMapper<
    E = Mapping<unknown>, I = Mapping<unknown>
> = (..._parameter:Array<unknown>) => EventMapping<E, I>
export type EventToPropertyMapping<
    E = Mapping<unknown>, I = Mapping<unknown>, B = {}
> = B & Mapping<true|EventMapper<E, I>>

export type AttributesReflectionConfiguration =
    Array<string> |
    Map<
        string, string |
        ValueOf<typeof PropertyTypes>> |
        string |
        Mapping<ValueOf<typeof PropertyTypes> |
        string
    >

export type ScopeDeclaration = Array<string>|Mapping<unknown>
export type PreCompiledItem = {
    originalScopeNames:Array<string>
    templateFunction:TemplateFunction
}

export type ReactRenderBaseItemFactory = (_scope:Mapping<unknown>) =>
    ReactRenderBaseItem
export type ReactRenderItemFactory = (_scope:Mapping<unknown>) =>
    ReactRenderItem
export type ReactRenderItemsFactory =
    Array<ReactRenderItemFactory>|ReactRenderItemFactory

export type ReactRenderBaseItem = ReactElement|string|null
export type ReactRenderItem =
    ((..._parameters:Array<unknown>) => ReactRenderBaseItem)|ReactRenderBaseItem
export type ReactRenderItems = Array<ReactRenderItem>|ReactRenderItem

export interface WebComponentConfiguration<
    ExternalPropertiesType = Mapping<unknown>,
    InternalPropertiesType = Mapping<unknown>
> {
    attachWebComponentAdapterIfNotExists?:boolean
    controllableProperties?:Array<string>
    eventToPropertyMapping?:EventToPropertyMapping<
        ExternalPropertiesType, InternalPropertiesType
    >
    internalProperties?:Mapping<unknown>
    propertiesToReflectAsAttributes?:AttributesReflectionConfiguration
    propertyAliases?:Mapping
    propTypes?:Mapping<ValueOf<typeof PropertyTypes>>
    renderProperties?:Array<string>
}
export interface StaticWebComponent extends WebComponentConfiguration {
    webComponentAdapterWrapped?:string
    wrapped?:unknown

    _name?:string
    ___types?:{name?:{name?:string}}
}
export type ComponentType = ReactComponentType & StaticWebComponent
export interface ComponentAdapter<
    Properties = Mapping<unknown>, State = Mapping<unknown>
> {
    properties?:Properties
    state?:State
}
export type WebComponentAPI<WebComponent extends typeof Web = typeof Web> = {
    component:WebComponent
    register:(_tagName?:string) => void
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
