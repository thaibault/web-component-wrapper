// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module decorator */
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
import PropertyTypes, {string} from 'clientnode/property-types'
import {Mapping, ValueOf} from 'clientnode/type'

import Web from './Web'
// endregion
/**
 * Generates a decorator based on given configuration.
 * @param options - Property configuration to define how to transfer attributes
 * and properties into each other.
 * @returns Generated decorator.
 */
export function property(
    options:{
        alias?:string
        readAttribute?:boolean
        type?:string|ValueOf<typeof PropertyTypes>
        update?:boolean
        writeAttribute?:boolean|string|ValueOf<typeof PropertyTypes>
    } = {}
):PropertyDecorator {
    options = {readAttribute: true, type: string, ...options}
    /**
     * Registers given property to different property / attribute conversion
     * data structures.
     * @param target - Instance to apply given property to.
     * @param name - Field name to apply.
     * @returns Modified given property.
     */
    return function(target:Object, name:string|symbol):void {
        if (typeof name !== 'string')
            return

        type TargetType = typeof target & typeof Web

        const self:TargetType =
            (target as unknown as {self:TargetType}).self ||
            (target as unknown as {constructor:TargetType}).constructor

        if (options.readAttribute) {
            if (!self.observedAttributes)
                self.observedAttributes = []

            const attributeName:string = Tools.stringCamelCaseToDelimited(name)
            if (!self.observedAttributes.includes(attributeName))
                self.observedAttributes.push(attributeName)
        }

        if (options.type) {
            if (!self.propertyTypes)
                self.propertyTypes = {}

            if (options.update || !self.propertyTypes.hasOwnProperty(name))
                self.propertyTypes[name] = options.type
        }

        if (options.writeAttribute) {
            if (!self.propertiesToReflectAsAttributes)
                self.propertiesToReflectAsAttributes = new Map()

            if (
                options.update ||
                self.propertiesToReflectAsAttributes instanceof Map &&
                !self.propertiesToReflectAsAttributes.has(name) ||
                Array.isArray(self.propertiesToReflectAsAttributes) &&
                !self.propertiesToReflectAsAttributes.includes(name) ||
                self.propertiesToReflectAsAttributes !== null &&
                typeof self.propertiesToReflectAsAttributes === 'object' &&
                !self.propertiesToReflectAsAttributes.hasOwnProperty(name)
            ) {
                let result:string|ValueOf<typeof PropertyTypes>|undefined
                if (typeof options.writeAttribute === 'boolean') {
                    if (
                        options.writeAttribute === true &&
                        self.propertyTypes?.hasOwnProperty(name)
                    )
                        result = self.propertyTypes[name]
                } else
                    result = options.writeAttribute

                if (result !== undefined) {
                    if (Array.isArray(self.propertiesToReflectAsAttributes))
                        if (options.writeAttribute === true)
                            self.propertiesToReflectAsAttributes.push(name)
                        else
                            self.propertiesToReflectAsAttributes =
                                self.normalizePropertyTypeList(
                                    self.propertiesToReflectAsAttributes
                                )

                    if (self.propertiesToReflectAsAttributes instanceof Map)
                        self.propertiesToReflectAsAttributes.set(name, result)
                    if (
                        self.propertiesToReflectAsAttributes !== null &&
                        typeof self.propertiesToReflectAsAttributes ===
                            'object'
                    )
                        (
                            self.propertiesToReflectAsAttributes as Mapping<
                                string|ValueOf<typeof PropertyTypes>
                            >
                        )[name] = result
                }
            }
        }

        if (options.alias) {
            if (!self.propertyAliases)
                self.propertyAliases = {}

            if (options.update || !self.propertyAliases.hasOwnProperty(name))
                self.propertyAliases[name] = options.alias
        }
    }
}
export default property
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
