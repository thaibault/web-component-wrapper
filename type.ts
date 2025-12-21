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
import {Mapping, TemplateFunction, ValueOf} from 'clientnode'
import PropertyTypes, {ValidationMap} from 'clientnode/property-types'
import React, {
    ComponentType as ReactComponentType, HTMLAttributes, ReactElement
} from 'react'

import Web from './Web'
// endregion
// region exports
export interface CompilerOptions {
    filter?: (domNode: Node) => boolean
    ignoreComponents?: boolean
    ignoreNestedComponents?: boolean
    unsafe?: boolean
}
export interface CompiledDomNodeTemplateItem {
    domNode: Node
    children: Array<CompiledDomNodeTemplateItem>

    error?: null | string

    scopeNames?: Array<string>
    template?: string
    templateFunction?: TemplateFunction
}
export type DomNodeToCompiledTemplateMap<NodeType = Node> =
    Map<NodeType, CompiledDomNodeTemplateItem>

export type EventCallbackMapping = Map<string, () => void>
export type EventMapping<
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends Mapping<unknown> = Mapping<unknown>
> = (
    null |
    [Partial<ExternalProperties>, Partial<InternalProperties>] |
    Partial<ExternalProperties>
)
export type EventMapper<
    E extends Mapping<unknown> = Mapping<unknown>,
    I extends Mapping<unknown> = Mapping<unknown>,
    P extends Array<unknown> = Array<unknown>
> = (...parameters: P) => EventMapping<E, I> | Promise<EventMapping<E, I>>
export type EventToPropertyMapping<
    E extends Mapping<unknown> = Mapping<unknown>,
    I extends Mapping<unknown> = Mapping<unknown>,
    P extends Array<unknown> = Array<unknown>
> = Mapping<true | EventMapper<E, I, P>>

export type PropertyType = string | ValueOf<typeof PropertyTypes>
export type PropertyConfiguration = PropertyType
export type ValidationMapping = ValidationMap<ValueOf<typeof PropertyTypes>>
export type PropertiesValidationMap =
    Mapping<ValueOf<typeof PropertyTypes>> // & ValidationMapping
export type PropertiesConfiguration = Mapping | PropertiesValidationMap
export type NormalizedAttributesReflectionConfiguration =
    Map<string, PropertyConfiguration>
export type AttributesReflectionConfiguration = (
    string |
    Array<string> |
    PropertiesConfiguration |
    NormalizedAttributesReflectionConfiguration
)

export type ScopeDeclaration = Array<string> | Mapping<unknown>
export interface PreCompiledItem {
    originalScopeNames: Array<string>
    templateFunction: TemplateFunction
}

export type ReactComponentBaseProperties<TElement = HTMLElement> =
    Mapping<unknown> &
    {
        children?: Array<React.ReactNode> | React.ReactNode
        dangerouslySetInnerHTML?: HTMLAttributes<TElement>[
            'dangerouslySetInnerHTML'
        ]
        key?: string
        ref?: null | {current?: ComponentAdapter}
    }

export type ReactRenderBaseItemFactory = (scope: Mapping<unknown>) =>
    ReactRenderBaseItem
export type ReactRenderItemFactory = (scope: Mapping<unknown>) =>
    ReactRenderItem
export type ReactRenderItemsFactory =
    Array<ReactRenderItemFactory> | ReactRenderItemFactory

export type ReactRenderBaseItem = ReactElement | string | null
export type ReactRenderItem =
    ((...parameters: Array<unknown>) => ReactRenderBaseItem) |
    ReactRenderBaseItem
export type ReactRenderItems = Array<ReactRenderItem> | ReactRenderItem

export interface WebComponentConfiguration<
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends Mapping<unknown> = Mapping<unknown>,
    EventParameters extends Array<unknown> = Array<unknown>
> {
    attachWebComponentAdapterIfNotExists?: boolean

    controllableProperties?: Array<string>
    eventToPropertyMapping?: (
        EventToPropertyMapping<
            ExternalProperties, InternalProperties, EventParameters
        > |
        null
    )
    internalProperties?: InternalProperties
    propertiesToReflectAsAttributes?: AttributesReflectionConfiguration
    propertyAliases?: Mapping
    propTypes?: PropertiesConfiguration
    renderProperties?: Array<string>
}
export interface StaticWebComponent<
    ComponentType = unknown,
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends Mapping<unknown> = Mapping<unknown>,
    EventParameters extends Array<unknown> = Array<unknown>
> extends WebComponentConfiguration<
    ExternalProperties, InternalProperties, EventParameters
> {
    webComponentAdapterWrapped?: string
    wrapped?: ComponentType

    _name?: string
    ___types?: {name?: {name?: string}}
}
export type ComponentType<PropertyTypes = Mapping<unknown>> =
    Omit<ReactComponentType<PropertyTypes>, 'propTypes'> &
    StaticWebComponent
export interface ComponentAdapter<
    Properties = Mapping<unknown>, State = Mapping<unknown>
> {
    properties?: Properties
    state?: State
}
export interface WebComponentAPI<
    TElement = HTMLElement,
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends Mapping<unknown> = Mapping<unknown>,
    Type extends typeof Web<TElement, ExternalProperties, InternalProperties> =
        typeof Web<TElement, ExternalProperties, InternalProperties>
> {
    component: Type
    register: (tagName?: string) => void
}
// endregion
