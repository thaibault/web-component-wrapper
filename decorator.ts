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
 * @param options.alias - Alternate property name.
 * @param options.readAttribute - Indicates whether to read from existing
 * attribute also.
 * @param options.type - Value type to parse value.
 * @param options.update - Indicates whether to already existing property
 * configurations.
 * @param options.writeAttribute - Indicates whether to sync attribute
 * representation back into dom.
 *
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
     * NOTE: It is important to set static configuration properties on its
     * "own" properties instead of some inherited one. So we have to check via
     * "hasOwnProperty" for existence in this decorator.
     * @param target - Instance to apply given property to.
     * @param name - Field name to apply.
     *
     * @returns Modified given property.
     */
    return function(target:object, name:string|symbol):void {
        if (typeof name !== 'string')
            return

        type TargetType = typeof target & typeof Web

        const self:TargetType =
            (target as unknown as {self:TargetType}).self ||
            (target as unknown as {constructor:TargetType}).constructor

        if (options.readAttribute) {
            if (!Object.prototype.hasOwnProperty.call(
                self, 'observedAttributes'
            ))
                self.observedAttributes = self.observedAttributes ?
                    [...self.observedAttributes] :
                    []

            const attributeName:string = Tools.stringCamelCaseToDelimited(name)
            if (!self.observedAttributes.includes(attributeName))
                self.observedAttributes.push(attributeName)
        }

        if (options.type) {
            if (!Object.prototype.hasOwnProperty.call(self, 'propertyTypes'))
                self.propertyTypes = self.propertyTypes ?
                    {...self.propertyTypes} :
                    {}

            if (
                options.update ||
                !Object.prototype.hasOwnProperty.call(self, name)
            )
                self.propertyTypes[name] = options.type
        }

        if (options.writeAttribute) {
            if (!Object.prototype.hasOwnProperty.call(
                self, 'propertiesToReflectAsAttributes'
            ))
                self.propertiesToReflectAsAttributes =
                    self.propertiesToReflectAsAttributes ?
                        Tools.copy(self.propertiesToReflectAsAttributes) :
                        new Map()

            if (
                options.update ||
                self.propertiesToReflectAsAttributes instanceof Map &&
                !self.propertiesToReflectAsAttributes.has(name) ||
                Array.isArray(self.propertiesToReflectAsAttributes) &&
                !self.propertiesToReflectAsAttributes.includes(name) ||
                self.propertiesToReflectAsAttributes !== null &&
                typeof self.propertiesToReflectAsAttributes === 'object' &&
                !Object.prototype.hasOwnProperty.call(
                    self.propertiesToReflectAsAttributes, name
                )
            ) {
                let result:string|ValueOf<typeof PropertyTypes>|undefined
                if (typeof options.writeAttribute === 'boolean') {
                    if (
                        options.writeAttribute === true &&
                        self.propertyTypes &&
                        Object.prototype.hasOwnProperty.call(
                            self.propertyTypes, name
                        )
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
            if (!Object.prototype.hasOwnProperty.call(self, 'propertyAliases'))
                self.propertyAliases = self.propertyAliases ?
                    {...self.propertyAliases} :
                    {}

            if (
                options.update ||
                !Object.prototype.hasOwnProperty.call(self, name)
            )
                self.propertyAliases[name] = options.alias
        }
    }
}
export default property
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
