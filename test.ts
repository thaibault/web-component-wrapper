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
import {Mapping} from 'clientnode/type'
import {createElement, ReactElement} from 'react'

import wrapAsWebComponent from './index'
import React from './React'
import Web from './Web'
import {WebComponentAPI} from './type'
// endregion
// region Web
describe('Web', ():void => {
    test('constructor', async ():Promise<void> => {
        class WebTest extends Web {}

        expect(WebTest).toHaveProperty('content')
        expect(WebTest).toHaveProperty('observedAttributes')

        customElements.define('test-web', WebTest)
        const web:WebTest = document.createElement('test-web') as WebTest

        expect(web).not.toHaveProperty('clicked')
        web.setAttribute('bind-on-click', 'this.clicked = true')
        expect(web).not.toHaveProperty('clicked')

        document.body.appendChild(web)

        expect(web).toHaveProperty('root', web)

        expect(web).not.toHaveProperty('clicked')
        web.click()
        expect(web).toHaveProperty('clicked', true)

        const clickCallback = jest.fn()
        web.addEventListener('click', clickCallback)
        expect(clickCallback).not.toHaveBeenCalled()
        web.click()
        expect(clickCallback).toHaveBeenCalled()
    })
})
// endregion
// region React
describe('React', ():void => {
    test('constructor', async ():Promise<void> => {
        let numberOfComponentClicks:number = 0

        class TestReact<
            TElement = HTMLElement,
            ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
            InternalProperties extends Mapping<unknown> = Mapping<unknown>
        > extends React<TElement, ExternalProperties, InternalProperties> {
            static content = () => createElement('div', {onClick: () => {
                numberOfComponentClicks += 1
            }})

            static _name:string = 'Test'

            readonly self:typeof TestReact = TestReact
        }

        expect(TestReact).toHaveProperty('content')
        expect(TestReact).toHaveProperty('observedAttributes')

        customElements.define('test-react', TestReact)
        const react:TestReact =
            document.createElement('test-react') as TestReact

        expect(numberOfComponentClicks).toStrictEqual(0)
        expect(react).not.toHaveProperty('clicked')
        react.setAttribute('bind-on-click', 'this.clicked = true')
        expect(react).not.toHaveProperty('clicked')

        document.body.appendChild(react)

        expect(react).toHaveProperty('root', react)

        expect(numberOfComponentClicks).toStrictEqual(0)
        expect(react).not.toHaveProperty('clicked')
        react.click()
        expect(react).toHaveProperty('clicked', true)
        /*
        TODO
        await Tools.timeout()
        expect(numberOfComponentClicks).toStrictEqual(1)
        */

        const clickCallback = jest.fn()
        react.addEventListener('click', clickCallback)
        expect(clickCallback).not.toHaveBeenCalled()
        react.click()
        expect(clickCallback).toHaveBeenCalled()
    })
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
//  endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
