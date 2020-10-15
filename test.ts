// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import wrapAsWebComponent from './index'
import React from './React'
import Web from './Web'
// TODO
// endregion
describe('Web', () => {
    // region mockup
    // endregion
    // region tests
    test('constructor', ():void => {
        expect(Web).toHaveProperty('content')
        expect(Web).toHaveProperty('observedAttributes')
    })
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
