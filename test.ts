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
import {func} from 'clientnode/property-types'
import {Mapping} from 'clientnode/type'
import {createElement, ReactElement, WeakValidationMap} from 'react'

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
        let numberOfComponentCustomEvents:number = 0
        let triggerOnEvent:() => void = Tools.noop

        class TestReact<
            TElement = HTMLElement,
            ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
            InternalProperties extends Mapping<unknown> = Mapping<unknown>
        > extends React<TElement, ExternalProperties, InternalProperties> {
            static content = ({onEvent}) => {
                triggerOnEvent = onEvent

                return createElement('div')
            }
            static propertyTypes:(
                Mapping|WeakValidationMap<Mapping<unknown>>
            ) = {
                ...Web.propertyTypes,
                onEvent: func
            }

            static _name:string = 'Test'

            readonly self:typeof TestReact = TestReact
        }

        expect(TestReact).toHaveProperty('content')
        expect(TestReact).toHaveProperty('observedAttributes')

        customElements.define('test-react', TestReact)
        const react:TestReact =
            document.createElement('test-react') as TestReact

        expect(react).not.toHaveProperty('clicked')
        react.setAttribute('bind-on-click', 'this.clicked = true')
        expect(react).not.toHaveProperty('clicked')

        react.setAttribute('bind-on-event', 'this.eventHappened = true')

        expect(triggerOnEvent).not.toBeDefined()

        document.body.appendChild(react)

        expect(react).toHaveProperty('root', react)

        expect(triggerOnEvent).not.toBeDefined()
        await Tools.timeout()
        expect(triggerOnEvent).toBeDefined()

        expect(react).not.toHaveProperty('eventHappened')
        triggerOnEvent()
        expect(react).toHaveProperty('eventHappened', true)

        const eventCallback = jest.fn()
        react.addEventListener('event', eventCallback)
        expect(eventCallback).not.toHaveBeenCalled()
        triggerOnEvent()
        expect(eventCallback).toHaveBeenCalled()

        expect(react).not.toHaveProperty('clicked')
        react.click()
        expect(react).toHaveProperty('clicked', true)

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
        const componentAPI:WebComponentAPI =
            wrapAsWebComponent(
                ():ReactElement => createElement('div'),
                'TestComponent',
                {
                    eventToPropertyMapping: {},
                    propertyAliases: {alternateName: 'name'},
                    propertiesToReflectAsAttributes: [],
                    propTypes: {name: 'string'}
                }
            )

        expect(componentAPI).toHaveProperty('component')
        expect(componentAPI).toHaveProperty('register')


        expect(componentAPI.component).toHaveProperty('_name', 'TestComponent')
        expect(componentAPI.component)
            .toHaveProperty('propertyTypes.name', 'string')
        expect(componentAPI.component)
            .toHaveProperty('propertiesToReflectAsAttributes', ['isRoot'])
        expect(componentAPI.component)
            .toHaveProperty('eventToPropertyMapping', {})
    })
})
//  endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
