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
import {createElement, ReactElement} from 'react'

import wrapAsWebComponent from './index'
import React from './React'
import Web from './Web'
import {WebComponentAPI} from './type'
// endregion
// region Web
describe('Web', ():void => {
    test('constructor', ():void => {
        expect(Web).toHaveProperty('content')
        expect(Web).toHaveProperty('observedAttributes')

        customElements.define('test-web', Web)
        document.body.appendChild(document.createElement('test-web'))
        const web:Web = document.querySelector('test-web') as Web

        expect(web).toHaveProperty('root', web)
    })
})
// endregion
// region React
describe('React', ():void => {
    test('constructor', ():void => {
        expect(React).toHaveProperty('content')
        expect(React).toHaveProperty('observedAttributes')

        customElements.define('test-react', React)
        document.body.appendChild(document.createElement('test-react'))
        const react:React = document.querySelector('test-react') as React

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
