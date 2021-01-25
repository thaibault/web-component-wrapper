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
import Tools from 'clientnode'
import PropertyTypes from 'clientnode/property-types'
import {Mapping, ValueOf} from 'clientnode/type'

import ReactWebImport, {api as reactWebAPIImport} from './React'
import WebImport, {api as webAPIImport} from './Web'
import {
    AttributesReflectionConfiguration,
    ComponentType,
    EventToPropertyMapping,
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
export const wrapAsWebComponent = <Type extends ComponentType = ComponentType>(
    component:Type,
    nameHint:string = 'NoName',
    configuration:WebComponentConfiguration = {}
):WebComponentAPI => {
    // Determine class / function name.
    const name:string =
        component._name ||
        // NOTE: Not minifyable save: "component.name ||"
        /*
            NOTE: There exists babel plugins which reflects component name and
            member variables under this property. Try to respect these.
        */
        component.___types?.name?.name ||
        nameHint.replace(/^(.*\/+)?([^\/]+)\.tsx$/, '$2')

    if (configuration.propTypes)
        component.propTypes = configuration.propTypes
    const propertyTypes:Mapping<string|ValueOf<typeof PropertyTypes>> =
        component.propTypes || {}
    const propertyAliases:Mapping =
        configuration.propertyAliases || component.propertyAliases || {}
    const allPropertyNames:Array<string> = Tools.arrayUnique(
        Object.keys(propertyTypes)
            .concat(Object.keys(propertyAliases))
            .concat(Object.values(propertyAliases))
    )
    /**
     * Runtime generated web component.
     */
    class ConcreteComponent extends ReactWeb {
        static attachWebComponentAdapterIfNotExists:boolean =
            typeof configuration.attachWebComponentAdapterIfNotExists ===
                'boolean' ?
                    configuration.attachWebComponentAdapterIfNotExists :
                    true
        static content:ComponentType = component
        static propertyAliases:Mapping = propertyAliases
        static propertiesToReflectAsAttributes:AttributesReflectionConfiguration =
            configuration.propertiesToReflectAsAttributes ||
            component.propertiesToReflectAsAttributes ||
            []
        static propertyTypes:Mapping<string|ValueOf<typeof PropertyTypes>> =
            propertyTypes
        static readonly observedAttributes:Array<string> =
            allPropertyNames.map((name:string):string =>
                Tools.stringCamelCaseToDelimited(name)
            )

        static _name:string = name

        readonly eventToPropertyMapping:EventToPropertyMapping =
            configuration.eventToPropertyMapping ||
            component.eventToPropertyMapping ||
            {}
        readonly self:typeof ConcreteComponent = ConcreteComponent
    }

    const webComponentAPI:WebComponentAPI<typeof ConcreteComponent> = {
        component: ConcreteComponent,
        register: (
            tagName:string = Tools.stringCamelCaseToDelimited(name)
        ):void => customElements.define(tagName, ConcreteComponent)
    }

    return webComponentAPI
}
export default wrapAsWebComponent
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
