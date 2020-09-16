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
import {Component} from 'react'

import ReactWeb from './adapter/React'
// endregion
// region exports
export type Output = Mapping<true|((...parameter:Array<any>) => Mapping<any>)>
export type WebComponentAPI = {
    component:ReactWeb;
    register:(tagName:string) => void;
}
export interface ReactWebComponent extends Component {
    properties?:Mapping<any>;

    self:{
        readonly output?:Output;
        readonly propertiesToReflectAsAttributes?:Map<string, boolean>;
        readonly propTypes?:Mapping<ValueOf<typeof PropertyTypes>>;
    }
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
