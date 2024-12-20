// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module index */
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
import {camelCaseToDelimited, Mapping, unique} from 'clientnode'

import ReactWebImport, {api as reactWebAPIImport} from './ReactWeb'
import WebImport, {api as webAPIImport} from './Web'
import {
    AttributesReflectionConfiguration,
    ComponentType,
    EventToPropertyMapping,
    PropertiesConfiguration,
    WebComponentAPI,
    WebComponentConfiguration
} from './type'
// endregion
export const ReactWeb = ReactWebImport
export const reactWebAPI = reactWebAPIImport
export const webAPI = webAPIImport
export const Web = WebImport
/**
 * Wraps given react component as web component.
 * @param component - React component to wrap.
 * @param nameHint - A name to set as property in runtime generated web
 * component class.
 * @param configuration - Additional web component configurations.
 * @returns Generated object to register and retrieve generated web component.
 */
export const wrapAsWebComponent = <
    Type extends ComponentType = ComponentType,
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends Mapping<unknown> = Mapping<unknown>,
    EventParameters extends Array<unknown> = Array<unknown>
>(
        component: Type,
        nameHint = 'NoName',
        configuration: WebComponentConfiguration<
            ExternalProperties, InternalProperties, EventParameters
        > = {}
    ): WebComponentAPI<
        Type,
        ExternalProperties,
        InternalProperties,
        typeof ReactWeb<Type, ExternalProperties, InternalProperties>
    > => {
    // Determine class / function name.
    const name: string =
        component._name ||
        // NOTE: Not minifyable save: "component.name ||"
        /*
            NOTE: There exists babel plugins which reflects component name and
            member variables under this property. Try to respect these.
        */
        component.___types?.name?.name ||
        nameHint.replace(/^(.*\/+)?([^/]+)\.tsx$/, '$2')

    if (configuration.propTypes)
        component.propTypes = configuration.propTypes
    const propertyTypes: PropertiesConfiguration = component.propTypes || {}
    const propertyAliases: Mapping =
        configuration.propertyAliases || component.propertyAliases || {}
    const allPropertyNames: Array<string> = unique<string>(
        Object.keys(propertyTypes)
            .concat(Object.keys(propertyAliases))
            .concat(Object.values(propertyAliases))
    )

    // NOTE: We extend given configuration properties by base class defined.
    let propertiesToReflectAsAttributes: AttributesReflectionConfiguration =
        configuration.propertiesToReflectAsAttributes ||
        component.propertiesToReflectAsAttributes ||
        []
    if (ReactWeb.propertiesToReflectAsAttributes)
        if (Array.isArray(propertiesToReflectAsAttributes))
            propertiesToReflectAsAttributes = [
                ...ReactWeb.propertiesToReflectAsAttributes as Array<string>,
                ...propertiesToReflectAsAttributes
            ]
        else if (propertiesToReflectAsAttributes instanceof Map)
            for (
                const name of ReactWeb.propertiesToReflectAsAttributes as
                    Array<string>
            )
                propertiesToReflectAsAttributes.set(
                    name, ReactWeb.propertyTypes[name] as string
                )
        else if (typeof propertiesToReflectAsAttributes === 'object')
            for (
                const name of ReactWeb.propertiesToReflectAsAttributes as
                    Array<string>
            )
                (propertiesToReflectAsAttributes as unknown as Mapping)[
                    name
                ] = ReactWeb.propertyTypes[name] as string

    const attributeNames: Array<string> =
        allPropertyNames.map((name: string): string =>
            camelCaseToDelimited(name)
        )
    /**
     * Runtime generated web component.
     */
    class ConcreteComponent<
        TElement = Type,
        ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
        InternalProperties extends Mapping<unknown> = Mapping<unknown>
    > extends ReactWeb<TElement, ExternalProperties, InternalProperties> {
        static attachWebComponentAdapterIfNotExists: boolean =
            typeof configuration.attachWebComponentAdapterIfNotExists ===
                'boolean' ?
                configuration.attachWebComponentAdapterIfNotExists :
                true

        static content: Type = component

        static readonly observedAttributes: Array<string> =
            ReactWeb.observedAttributes
                .concat(attributeNames)
                // NOTE: Respect pre-evaluation indicator attributes.
                .concat(
                    attributeNames.map((name: string): string => `-${name}`)
                )

        static controllableProperties: Array<string> =
            component.controllableProperties ||
            configuration.controllableProperties ||
            []
        static eventToPropertyMapping: EventToPropertyMapping | null = (
            configuration.eventToPropertyMapping === null ?
                configuration.eventToPropertyMapping :
                configuration.eventToPropertyMapping ?
                    {...configuration.eventToPropertyMapping} :
                    component.eventToPropertyMapping === null ?
                        component.eventToPropertyMapping :
                        component.eventToPropertyMapping ?
                            {...component.eventToPropertyMapping} :
                            {}
        ) as unknown as EventToPropertyMapping | null
        static propertyAliases: Mapping = {
            ...ReactWeb.propertyAliases, ...propertyAliases
        }
        static propertiesToReflectAsAttributes: (
            AttributesReflectionConfiguration
        ) = propertiesToReflectAsAttributes
        static propertyTypes: PropertiesConfiguration = {
            ...ReactWeb.propertyTypes,
            ...propertyTypes
        } as PropertiesConfiguration
        static renderProperties: Array<string> =
            configuration.renderProperties ??
            component.renderProperties ??
            ReactWeb.renderProperties

        static _name: string = name

        readonly self: typeof ConcreteComponent = ConcreteComponent

        internalProperties: InternalProperties = (
            configuration.internalProperties ?
                {...configuration.internalProperties} :
                component.internalProperties ?
                    {...component.internalProperties} :
                    {}
        ) as InternalProperties
    }

    const webComponentAPI: WebComponentAPI<
        Type,
        ExternalProperties,
        InternalProperties,
        typeof ReactWeb<Type, ExternalProperties, InternalProperties>
    > = {
        component: ConcreteComponent as typeof ReactWeb<
            Type, ExternalProperties, InternalProperties
        >,
        register: (tagName: string = camelCaseToDelimited(name)) => {
            customElements.define(tagName, ConcreteComponent)
        }
    }

    return webComponentAPI
}

export default wrapAsWebComponent
