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
import Tools from 'clientnode'
import {createElement, ReactElement} from 'react'

import wrapAsWebComponent from './index'
import React from './React'
import Web from './Web'
import {WebComponentAPI} from './type'
// endregion
// region Web
describe('Web', ():void => {
    test('constructor', async ():Promise<void> => {
        expect(Web).toHaveProperty('content')
        expect(Web).toHaveProperty('observedAttributes')

        customElements.define('test-web', Web)
        const web:Web = document.createElement('test-web') as Web
        document.body.appendChild(web)

        expect(web).toHaveProperty('root', web)

        // TODO
        web.setAttribute('bind-on-click', "console.log('click', event)")

        await Tools.timeout()

        web.click()
    })
})
// endregion
// region React
describe('React', ():void => {
    test('constructor', ():void => {
        expect(React).toHaveProperty('content')
        expect(React).toHaveProperty('observedAttributes')

        customElements.define('test-react', React)
        const react:React = document.createElement('test-react') as React
        document.body.appendChild(react)

        expect(react).toHaveProperty('root', react)
    })
    // TODO
})
// endregion
// region index
describe('index', ():void => {
    test('wrapAsWebComponent', ():void => {
        const component:WebComponentAPI =
            wrapAsWebComponent(():ReactElement => createElement('div'))
        expect(component).toHaveProperty('component')
        expect(component).toHaveProperty('register')
    })
    // TODO
})
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
