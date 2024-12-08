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
import {describe, expect, jest, test} from '@jest/globals'
import {Mapping, timeout, ValueOf} from 'clientnode'
import {func, string} from 'clientnode/property-types'
import {createElement, FunctionComponent, ReactElement} from 'react'

import wrapAsWebComponent from './index'
import ReactWeb from './ReactWeb'
import Web from './Web'
import {ComponentType, PropertiesConfiguration, WebComponentAPI} from './type'
// endregion
// region Web
describe('Web', (): void => {
    test('constructor', (): void => {
        /**
         * Mock Test class.
         */
        class WebTest extends Web {}

        expect(WebTest).toHaveProperty('content')
        expect(WebTest).toHaveProperty('observedAttributes')

        customElements.define('test-web', WebTest)
        const web: WebTest = document.createElement('test-web') as WebTest

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
// region ReactWeb
describe('ReactWeb', (): void => {
    test('constructor', async (): Promise<void> => {
        let triggerOnEvent: (() => void) | undefined
        let componentProperty = 'initial'

        const component: FunctionComponent<{
            property: string
            onEvent?: () => void
        }> = ({onEvent, property = componentProperty}): ReactElement => {
            triggerOnEvent = onEvent
            componentProperty = property

            return createElement('div', {className: property})
        }

        /**
         * Mock test class.
         */
        class TestReactWeb<
            TElement = HTMLElement,
            ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
            InternalProperties extends Mapping<unknown> = Mapping<unknown>
        > extends ReactWeb<TElement, ExternalProperties, InternalProperties> {
            static content = component as ComponentType

            static propertyTypes: PropertiesConfiguration = {
                ...Web.propertyTypes as Mapping<ValueOf<
                    PropertiesConfiguration
                >>,

                onEvent: func,

                property: string
            }

            static _name = 'Test'

            readonly self = TestReactWeb
        }

        expect(TestReactWeb).toHaveProperty('content')
        expect(TestReactWeb).toHaveProperty('observedAttributes')

        customElements.define('test-react', TestReactWeb)
        const react: (TestReactWeb & {property: string}) =
            document.createElement('test-react') as
                TestReactWeb & {property: string}

        expect(react).not.toHaveProperty('clicked')
        react.setAttribute('bind-on-click', 'this.clicked = true')
        expect(react).not.toHaveProperty('clicked')

        react.setAttribute('bind-on-event', 'this.eventHappened = true')

        expect(triggerOnEvent).not.toBeDefined()

        document.body.appendChild(react)

        expect(react).toHaveProperty('root', react)
        expect(react).toHaveProperty('reactRoot')

        expect(triggerOnEvent).not.toBeDefined()
        await timeout()
        expect(triggerOnEvent).toBeDefined()

        expect(react).not.toHaveProperty('eventHappened')
        if (triggerOnEvent)
            triggerOnEvent()
        expect(react).toHaveProperty('eventHappened', true)

        const eventCallback = jest.fn()
        react.addEventListener('event', eventCallback)
        expect(eventCallback).not.toHaveBeenCalled()
        if (triggerOnEvent)
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

        expect(componentProperty).toStrictEqual('initial')
        expect(document.querySelector('div')?.className)
            .toStrictEqual('initial')

        react.property = 'test'
        await timeout()
        expect(react).toHaveProperty('property', 'test')
        expect(document.querySelector('div')?.className).toStrictEqual('test')
    })
})
// endregion
// region index
describe('index', (): void => {
    test('wrapAsWebComponent', (): void => {
        const componentAPI: WebComponentAPI<typeof ReactWeb> =
            wrapAsWebComponent<FunctionComponent<unknown>>(
                (): ReactElement => createElement('div'),
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
