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
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends Mapping<unknown> = Mapping<unknown>
> = (
    [Partial<ExternalProperties>, Partial<InternalProperties>] |
    Partial<ExternalProperties>
)
export type EventMapper<
    E extends Mapping<unknown> = Mapping<unknown>,
    I extends Mapping<unknown> = Mapping<unknown>,
    P extends Array<unknown> = Array<unknown>
> = (..._parameters:P) => EventMapping<E, I>
export type EventToPropertyMapping<
    E extends Mapping<unknown> = Mapping<unknown>,
    I extends Mapping<unknown> = Mapping<unknown>,
    P extends Array<unknown> = Array<unknown>
> = Mapping<true|EventMapper<E, I, P>>

export type PropertyConfiguration = string|ValueOf<typeof PropertyTypes>
export type PropertiesConfiguration = Mapping<PropertyConfiguration>
export type NormalizedAttributesReflectionConfiguration =
    Map<string, PropertyConfiguration>
export type AttributesReflectionConfiguration = (
    string |
    Array<string> |
    PropertiesConfiguration |
    NormalizedAttributesReflectionConfiguration
)

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
export type ReactRenderItem = ((..._parameters:Array<unknown>) =>
    ReactRenderBaseItem)|ReactRenderBaseItem
export type ReactRenderItems = Array<ReactRenderItem>|ReactRenderItem

export interface WebComponentConfiguration<
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends Mapping<unknown> = Mapping<unknown>,
    EventParameters extends Array<unknown> = Array<unknown>
> {
    attachWebComponentAdapterIfNotExists?:boolean

    controllableProperties?:Array<string>
    eventToPropertyMapping?:EventToPropertyMapping<
        ExternalProperties, InternalProperties, EventParameters
    >
    internalProperties?:InternalProperties
    propertiesToReflectAsAttributes?:AttributesReflectionConfiguration
    propertyAliases?:Mapping
    propTypes?:PropertiesConfiguration
    renderProperties?:Array<string>
}
export interface StaticWebComponent extends WebComponentConfiguration {
    webComponentAdapterWrapped?:string
    wrapped?:unknown

    _name?:string
    ___types?:{name?:{name?:string}}
}
export type ComponentType<PropertyTypes = Mapping<unknown>> =
    Omit<ReactComponentType<PropertyTypes>, 'propTypes'> &
    StaticWebComponent
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
