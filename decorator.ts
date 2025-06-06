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
import {camelCaseToDelimited, copy} from 'clientnode'
import {string} from 'clientnode/property-types'

import Web from './Web'
import {PropertiesConfiguration, PropertyConfiguration} from './type'
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
 * @returns Generated decorator.
 */
export function property(
    options: {
        alias?: string
        readAttribute?: boolean
        type?: PropertyConfiguration
        update?: boolean
        /* eslint-disable @typescript-eslint/no-redundant-type-constituents */
        writeAttribute?: boolean | PropertyConfiguration
        /* eslint-enable @typescript-eslint/no-redundant-type-constituents */
    } = {}
): PropertyDecorator {
    options = {readAttribute: true, type: string, ...options}
    /**
     * Registers given property to different property / attribute conversion
     * data structures.
     * NOTE: It is important to set static configuration properties on its
     * "own" properties instead of some inherited one. So we have to check via
     * "hasOwnProperty" for existence in this decorator.
     * @param target - Instance to apply given property to.
     * @param name - Field name to apply.
     */
    return function(target: object, name: string | symbol): void {
        if (typeof name !== 'string')
            return

        type TargetType = typeof target & typeof Web

        const self: Partial<TargetType> =
            (target as unknown as {self?: TargetType}).self ||
            (target as unknown as {constructor: TargetType}).constructor

        if (options.readAttribute) {
            if (!Object.prototype.hasOwnProperty.call(
                self, 'observedAttributes'
            ))
                self.observedAttributes = self.observedAttributes ?
                    [...self.observedAttributes] :
                    []

            const attributeName: string = camelCaseToDelimited(name)
            if (
                self.observedAttributes &&
                !self.observedAttributes.includes(attributeName)
            )
                self.observedAttributes.push(attributeName)
        }

        if (options.type) {
            if (!Object.prototype.hasOwnProperty.call(self, 'propertyTypes'))
                self.propertyTypes = self.propertyTypes ?
                    {...self.propertyTypes
                    } :
                    {}

            if (
                self.propertyTypes &&
                (
                    options.update ||
                    !Object.prototype.hasOwnProperty.call(self, name)
                )
            )
                self.propertyTypes[name] = options.type
        }

        if (options.writeAttribute) {
            if (!Object.prototype.hasOwnProperty.call(
                self, 'propertiesToReflectAsAttributes'
            ))
                self.propertiesToReflectAsAttributes =
                    self.propertiesToReflectAsAttributes ?
                        copy(self.propertiesToReflectAsAttributes) :
                        []

            if (
                options.update ||
                self.propertiesToReflectAsAttributes instanceof Map &&
                !self.propertiesToReflectAsAttributes.has(name) ||
                Array.isArray(self.propertiesToReflectAsAttributes) &&
                !self.propertiesToReflectAsAttributes.includes(name) ||
                typeof self.propertiesToReflectAsAttributes === 'object' &&
                !Object.prototype.hasOwnProperty.call(
                    self.propertiesToReflectAsAttributes, name
                )
            ) {
                /*
                    eslint-disable
                    @typescript-eslint/no-redundant-type-constituents
                */
                let result: PropertyConfiguration | undefined
                /*
                    eslint-enable
                    @typescript-eslint/no-redundant-type-constituents
                */
                if (typeof options.writeAttribute === 'boolean') {
                    if (
                        options.writeAttribute &&
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
                        else if (self.normalizePropertyTypeList)
                            self.propertiesToReflectAsAttributes =
                                self.normalizePropertyTypeList(
                                    self.propertiesToReflectAsAttributes
                                )

                    if (self.propertiesToReflectAsAttributes instanceof Map)
                        self.propertiesToReflectAsAttributes.set(name, result)
                    if (
                        typeof self.propertiesToReflectAsAttributes ===
                            'object'
                    )
                        (
                            self.propertiesToReflectAsAttributes as
                                PropertiesConfiguration
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
                self.propertyAliases &&
                (
                    options.update ||
                    !Object.prototype.hasOwnProperty.call(self, name)
                )
            )
                self.propertyAliases[name] = options.alias
        }
    }
}
export default property
