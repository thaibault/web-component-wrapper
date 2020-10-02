// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module web */
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
import PropertyTypes from 'clientnode/property-types'
import {Mapping, ValueOf} from 'clientnode/type'

import ReactWeb from './React'
import {
    ComponentType,
    EventToPropertyMapping,
    WebComponentAPI,
    WebComponentConfiguration
} from './type'
// endregion
export const wrapAsWebComponent = (
    component:ComponentType,
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
    const propertyTypes:Mapping<ValueOf<typeof PropertyTypes>> =
        configuration.propTypes || component.propTypes || {}
    const allPropertyNames:Array<string> = Object.keys(propertyTypes)
    class ConcreteComponent extends ReactWeb {
        static content:ComponentType = component
        static _name:string = name
        static readonly observedAttributes:Array<string> =
            allPropertyNames.map((name:string):string =>
                Tools.stringCamelCaseToDelimited(name)
            )

        readonly eventToPropertyMapping:EventToPropertyMapping =
            configuration.eventToPropertyMapping ||
            component.eventToPropertyMapping ||
            {}
        readonly self:typeof ConcreteComponent = ConcreteComponent

        _propertiesToReflectAsAttributes:Map<string, boolean> =
            configuration.propertiesToReflectAsAttributes ||
            component.propertiesToReflectAsAttributes ||
            new Map<string, boolean>()
        _propertyTypes:Mapping<ValueOf<typeof PropertyTypes>> = propertyTypes
    }
    const webComponentAPI:WebComponentAPI<typeof ConcreteComponent> = {
        component: ConcreteComponent,
        register: (
            tagName:string = Tools.stringCamelCaseToDelimited(name)
        ):void => customElements.define(tagName, ConcreteComponent)
    }
    for (const propertyName of allPropertyNames)
        Object.defineProperty(
            ConcreteComponent.prototype,
            propertyName,
            {
                get: function():any {
                    return this.getPropertyValue(propertyName)
                },
                set: function(value:any):void {
                    this.setPropertyValue(propertyName, value)
                }
            }
        )
    return webComponentAPI
}
export default wrapAsWebComponent
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
