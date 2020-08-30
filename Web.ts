// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module web */
'use strict'
/* !
    region header
    [Project page](https://torben.website/react-material-input)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import Tools, {globalContext, PlainObject} from 'clientnode'
import {ValueOf} from 'clientnode/type'

import {
    any,
    array,
    arrayOf,
    boolean,
    element,
    elementType,
    instanceOf,
    func,
    node,
    number,
    object,
    objectOf,
    oneOf,
    oneOfType,
    exact,
    shape,
    string,
    symbol
} from '../property-types'
import {Output, PropertyTypes} from '../types'
// endregion
// region polyfills
// Polyfill for template strings in dynamic function constructs in simple cases
const Function:typeof Function = (
    Tools.maximalSupportedInternetExplorerVersion === 0
) ?
    globalContext.Function :
    function(...parameter:Array<any>):Function {
        let code:string = parameter[parameter.length - 1]
        if (code.startsWith('return `') && code.endsWith('`')) {
            // Handle avoidable template expression:
            // Use raw code.
            code = code.replace(/^(return )`\$\{(.+)\}`$/, '$1$2')
            // Use plain string with single quotes.
            code = code.replace(/^(return )`([^']+)`$/, "$1'$2'")
            // Use plain string with double quotes.
            code = code.replace(/^(return )`([^"]+)`$/, '$1"$2"')

            // TODO replace new lines in replaced content: ".replace(/\\n+/g, ' ')"
        }
        parameter[parameter.length - 1] = code
        return new globalContext.Function(...parameter)
    }
// endregion
/**
 * Generic web component to render a content against instance specific values.
 * @property static:observedAttributes - Attribute names to observe for
 * changes.
 * @property static:useShadowDOM - Configures if a shadow dom should be used
 * during web-component instantiation.
 *
 * @property batchAttributeUpdates - Indicates whether to directly update dom
 * after each attribute mutation or to wait and batch mutations after current
 * queue has been finished.
 * @property batchedAttributeUpdateRunning - A boolean indicator to identify
 * if an attribute update is currently batched.
 * @property batchedPropertyUpdateRunning - A boolean indicator to identify
 * if an property update is currently batched.
 * @property batchedUpdateRunning - Indicates whether a batched render update
 * is currently running.
 * @property batchPropertyUpdates - Indicates whether to directly update dom
 * after each property mutation or to wait and batch mutations after current
 * queue has been finished.
 * @property batchUpdates - Indicates whether to directly perform a
 * re-rendering after changes on properties have been made.
 * @property ignoreAttributeUpdates - Indicates whether attribute updates
 * should be considered (usually only needed internally).
 * @property instance - Wrapped component instance.
 * @property output - Explicitly defined output events (a mapping of event
 * names to a potential parameter to properties transformer).
 * @property outputEventNames - List of determined output event names.
 * @property properties - Holds currently evaluated properties.
 * @property root - Hosting dom node.
 * @property self - Back-reference to this class.
 *
 * @property _propertiesToReflectAsAttributes - A mapping of property names to
 * set as attributes when they are set/updated.
 * @property _propertyTypes - Configuration defining how to convert attributes
 * into properties and reflect property changes back to attributes.
 * @property _content - Content template to render on property changes.
 */
export class Web<TElement = HTMLElement> extends HTMLElement {
    // region properties
    static readonly observedAttributes:Array<string> = []
    static useShadowDOM:boolean = false

    batchAttributeUpdates:boolean = true
    batchedAttributeUpdateRunning:boolean = true
    batchedPropertyUpdateRunning:boolean = true
    batchedUpdateRunning:boolean = true
    batchPropertyUpdates:boolean = true
    batchUpdates:boolean = true
    ignoreAttributeUpdates:boolean = false
    instance:null|{current?:object} = null
    output:Output = {}
    outputEventNames:Array<string> = []
    properties:object = {}
    root:TElement
    readonly self:typeof Web = Web

    _propertiesToReflectAsAttributes:Mapping<boolean> = new Map()
    _propertyTypes:PropertyTypes = {}
    _content:string = ''
    // endregion
    // region live cycle hooks
    /**
     * Initializes host dom content by attaching a shadow dom to it.
     * @returns Nothing.
     */
    constructor() {
        super()
        this.root = this.self.useShadowDOM ?
            (
                (!('attachShadow' in this) && 'ShadyDOM' in window) ?
                    window.ShadyDOM.wrap(this) :
                    this
            ).attachShadow({mode: 'open'}) :
            this
    }
    /**
     * Triggered when ever a given attribute has changed and triggers to update
     * configured dom content.
     * @param name - Attribute name which was updates.
     * @param oldValue - Old attribute value.
     * @param newValue - New updated value.
     * @param forceReEvaluation - Indicates if a re-evaluation should be
     * performed if given old and new value are the same.
     * @returns Nothing.
     */
    attributeChangedCallback(
        name:string,
        oldValue:string,
        newValue:string,
        forceReEvaluation:boolean = false
    ):void {
        if (
            !forceReEvaluation &&
            (this.ignoreAttributeUpdates || oldValue === newValue)
        )
            return
        this.evaluateStringOrNullAndSetAsProperty(name, newValue)
        if (this.batchAttributeUpdates) {
            if (!(
                this.batchedAttributeUpdateRunning || this.batchedUpdateRunning
            )) {
                this.batchedAttributeUpdateRunning = true
                this.batchedUpdateRunning = true
                Tools.timeout(():void => {
                    this.batchedAttributeUpdateRunning = false
                    this.batchedUpdateRunning = false
                    this.render()
                })
            }
        } else
            this.render()
    }
    /**
     * Triggered when this component is mounted into the document. Event
     * handlers will be attached and final render proceed.
     * @returns Nothing.
     */
    connectedCallback():void {
        this.attachEventHandler()
        this.batchedAttributeUpdateRunning = false
        this.batchedPropertyUpdateRunning = false
        this.batchedUpdateRunning = false
        this.render()
    }
    // endregion
    // region getter/setter
    /**
     * Forwards "_propertiesToReflectAsAttributes" property value.
     * @returns Property value.
     */
    get propertiesToReflectAsAttributes():Mapping<boolean> {
        return this._propertiesToReflectAsAttributes
    }
    /**
     * Sets "_propertiesToReflectAsAttributes" property value.
     * @param value - New value to set.
     * @returns Nothing.
     */
    set propertiesToReflectAsAttributes(value:Mapping<boolean>):void {
        this._propertiesToReflectAsAttributes = value
        this.reflectProperties(this.properties)
    }
    /**
     * Generic property getter. Forwards properties from the "properties"
     * field.
     * @param name - Property name to retrieve.
     * @returns Retrieved property value.
     */
    getPropertyValue(name:string):any {
        if (this.instance?.current?.properties)
            return this.instance.current.properties[name]
        return this.properties[name]
    }
    /**
     * Generic property setter. Forwards field writes into "properties" field
     * and triggers re-rendering (optionally batched). After rendering all
     * known output events are triggered.
     * @param name - Property name to write.
     * @param value - New value to write.
     * @returns Nothing.
     */
    setPropertyValue(name:string, value:any):void {
        this.properties[name] = value
        if (this.batchPropertyUpdates) {
            if (!(
                this.batchedPropertyUpdateRunning || this.batchedUpdateRunning
            )) {
                this.batchedPropertyUpdateRunning = true
                this.batchedUpdateRunning = true
                Tools.timeout(():void => {
                    this.batchedPropertyUpdateRunning = false
                    this.batchedUpdateRunning = false
                    this.render()
                    this.triggerOuputEvents()
                })
            }
        } else {
            this.render()
            this.triggerOuputEvents()
        }
    }
    /**
     * Just forwards internal property types.
     * @returns Internal "propertyTypes" property value.
     */
    get propertyTypes():WebComponentAttributeEvaluationTypes {
        return this._propertyTypes
    }
    /**
     * Set internal property types. Triggers a re-evaluation of all given
     * attributes and re-renders current content.
     * @param value - New property types configuration.
     * @returns Nothing.
     */
    set propertyTypes(value:PropertyTypes):void {
        this._propertyTypes = value
        this.updateAllAttributeEvaluations()
        this.render()
    }
    /**
     * Just forwards internal content to render.
     * @returns Internal content property value.
     */
    get content():string {
        return this._content
    }
    /**
     * Sets new content to render into internal property and triggers a
     * re-rendering.
     * @param value - New content to render.
     * @returns Nothing.
     */
    set content(value:string):void {
        this._content = value
        this.render()
    }
    // endregion
    // region helper
    /**
     * Attaches event handler to keep in sync with nested components properties
     * states.
     * @returns Nothing.
     */
    attachEventHandler():void {
        /*
            NOTE: We only reflect properties by implicit determined events if
            their where no explicitly defined.
        */
        this.outputEventNames = []
        this.attachImplicitDefinedOutputEventHandler(
            !this.attachExplicitDefinedOutputEventHandler()
        )
    }
    /**
     * Attach explicitly defined event handler to synchronize internal and
     * external property states.
     * @returns Returns "true" if there are some defined and "false" otherwise.
     */
    attachExplicitDefinedOutputEventHandler():boolean {
        // Grab all existing output to property specifications
        let result:boolean = false
        for (const name of Object.keys(this.output))
            if (!Object.prototype.hasOwnProperty.call(this.properties, name)) {
                result = true
                this.outputEventNames.push(name)
                this.properties[name] = (...parameter:Array<any>):void => {
                    this.reflectEventToProperties(name, parameter)
                    this.forwardEvent(name, parameter)
                }
            }
        return result
    }
    /**
     * Attach implicitly defined event handler to synchronize internal and
     * external property states.
     * @param reflectProperties - Indicates whether implicitly determined
     * properties should be reflected.
     * @returns Nothing.
     */
    attachImplicitDefinedOutputEventHandler(
        reflectProperties:boolean = true
    ):void {
        // Determine all event handler to inject
        for (const [name, type] of Object.entries(this._propertyTypes))
            if (
                !Object.prototype.hasOwnProperty.call(this.properties, name) &&
                ['output', func].includes(this._propertyTypes[name])
            ) {
                this.outputEventNames.push(name)
                this.properties[name] = (...parameter:Array<any>):void => {
                    if (reflectProperties)
                        this.reflectEventToProperties(name, parameter)
                    this.forwardEvent(name, parameter)
                }
            }
    }
    /**
     * Triggers all identified events to communicate internal property / state
     * changes.
     * @returns Nothing.
     */
    triggerOuputEvents():void {
        for (const name of this.outputEventNames)
            this.forwardEvent(name, [this.properties])
    }
    /**
     * Forwards given event as native web event.
     * @param name - Event name.
     * @param parameter - Event parameter.
     * @returns Nothing.
     */
    forwardEvent(name:string, parameter:Array<any>):void {
        this.dispatchEvent(
            new CustomEvent(name, {detail: {target: this, parameter}})
        )
    }
    /**
     * Reflects wrapped component state back to web-component's attributes and
     * properties.
     * @param properties - Properties to update in reflected property state.
     * @param render - Indicates whether an additional re-render should be
     * triggered.
     * @returns Nothing.
     */
    reflectProperties(properties:Mapping<any>, render:boolean = true):void {
        /*
            NOTE: We can avoid an additional attribute parsing for this
            reflections.
        */
        this.ignoreAttributeUpdates = true
        for (const [name, value] of Object.entries(properties)) {
            this.properties[name] = value
            if (this._propertiesToReflectAsAttributes.has(name))
                switch (this._propertyTypes[name]) {
                    case any:
                    case array:
                    case arrayOf:
                    case element:
                    case elementType:
                    case instanceOf:
                    case node:
                    case object:
                    case objectOf:
                    case shape:
                    case exact:
                    case symbol:
                        if (value) {
                            const representation:string =
                                Tools.represent(value)
                            if (
                                representation &&
                                this.getAttribute(name) !== representation
                            ) {
                                this.setAttribute(name, representation)
                                break
                            }
                        }
                        if (this.hasAttribute(name))
                            this.removeAttribute(name)
                        break
                    case boolean:
                        if (value) {
                            if (this.getAttribute(name) !== '')
                                this.setAttribute(name, '')
                        } else if (this.hasAttribute(name))
                            this.removeAttribute(name)
                        break
                    case number:
                        if (typeof value === 'number' && !isNaN(value)) {
                            value = `${value}`
                            if (this.getAttribute(name) !== value)
                                this.setAttribute(name, value)
                        } else if (this.hasAttribute(name))
                            this.removeAttribute(name)
                        break
                    case func:
                        break
                    case string:
                        if (value) {
                            if (this.getAttribute(name) !== value)
                                this.setAttribute(name, value)
                        } else if (this.hasAttribute(name))
                            this.removeAttribute(name)
                        break
                }
        }
        /*
            NOTE: Do not reflect properties which are hold in state. These
            values are only set once when they are explicitly set (see
            "setPropertyValue").
        */
        if (
            this.instance?.current?.state &&
            typeof this.instance.current.state === 'object'
        )
            for (const name of Object.keys(this.instance.current.state))
                if (
                    Object.prototype.hasOwnProperty.call(this.properties, name)
                )
                    /*
                        We want to avoid to fully delete this property to know
                        which properties exists on the underlying instance.
                    */
                    this.properties[name] = undefined
        this.ignoreAttributeUpdates = false
        if (render)
            if (this.batchUpdates) {
                if (!this.batchedUpdateRunning) {
                    this.batchedUpdateRunning = true
                    Tools.timeout(():void => {
                        this.batchedUpdateRunning = false
                        this.render()
                    })
                }
            } else
                this.render()
    }
    /**
     * Triggers a re-evaluation of all attributes.
     * @returns Nothing.
     */
    updateAllAttributeEvaluations():void {
        for (const name of this.self.observedAttributes)
            if (this.hasAttribute(name)) {
                const value:any = this.getAttribute(name)
                this.attributeChangedCallback(name, value, value, true)
            }
    }
    /**
     * Reflect given event handler call with given parameter back to current
     * properties state.
     * @param name - Event handler name.
     * @param parameter - List of parameter to given event handler call.
     * @returns Nothing.
     */
    reflectEventToProperties(name:string, parameter:Array<any>):void {
        /*
            NOTE: We enforce to update components state imidiatly after an event
            occurs since batching usually does not make sense here. An event
            is ran an its own context.
            On the other hand it can be necessary to immediately reflect a
            property change to the components internal state to avoid
            contradicting internal render cycles.
        */
        const oldBatchUpdatesConfiguration:boolean = this.batchUpdates
        this.batchUpdates = false
        if (
            Object.prototype.hasOwnProperty.call(this.output, name) &&
            Tools.isFunction(this.output[name])
        )
            this.reflectProperties(this.output[name](...parameter))
        else if (
            parameter.length > 0 &&
            parameter[0] !== null &&
            typeof parameter[0] === 'object' &&
            !(
                'persist' in parameter[0] &&
                Tools.isFunction(parameter[0].persist)
            )
        )
            this.reflectProperties(parameter[0])
        this.batchUpdates = oldBatchUpdatesConfiguration
    }
    /**
     * Evaluates given property value depending on its type specification and
     * registers in properties mapping object.
     * @param name - Name of given value.
     * @param value - Value to evaluate.
     * @returns Nothing.
     */
    evaluateStringOrNullAndSetAsProperty(name:string, value:string):void {
        name = Tools.stringDelimitedToCamelCase(name)
        if (Object.prototype.hasOwnProperty.call(this._propertyTypes, name)) {
            const type:ValueOf<PropertyTypes> = this._propertyTypes[name]
            if (value === null && ![boolean, 'boolean'].includes(type)) {
                delete this.properties[name]
                return
            }
            switch (type) {
                case boolean:
                    this.properties[name] = ![null, 'false'].includes(value)
                    break
                case number:
                    /*
                        NOTE: You should not name this variable "number" since
                        babel gets confused caused by existing module wide
                        property type variable "number".
                    */
                    const numberValue:number = parseFloat(value)
                    if (isNaN(numberValue))
                        this.properties[name] = undefined
                    else
                        this.properties[name] = numberValue
                    break
                case func:
                    let callback:Function
                    try {
                        callback = new Function('parameter', `return ${value}`)
                    } catch (error) {
                        console.warn(
                            `'Failed to compile event handler "${name}" with` +
                            ` expression "${value}": "` +
                            `${Tools.represent(error)}".`
                        )
                    }
                    this.properties[name] = (...parameter:Array<any>):void => {
                        this.reflectEventToProperties(name, parameter)
                        if (callback)
                            try {
                                callback.call(this, parameter)
                            } catch (error) {
                                console.warn(
                                    `'Failed to evaluate event handler "` +
                                    `${name}" with expression "${value}" and` +
                                    ` scope variable "parameter" set to "` +
                                    `${Tools.represent(parameter)}": "` +
                                    `${Tools.represent(error)}".`
                                )
                            }
                    }
                    break
                case string:
                    this.properties[name] = value
                    break
                case any:
                case array:
                case arrayOf:
                case element:
                case elementType:
                case instanceOf:
                case node:
                case object:
                case objectOf:
                case oneOf:
                case oneOfType:
                case shape:
                case exact:
                case symbol:
                default:
                    if (value) {
                        let get:Function
                        try {
                            get = new Function(`return ${value}`)
                        } catch (error) {
                            console.warn(
                                `Error occured during compiling given "` +
                                `${name}" attribute configuration "${value}"` +
                                `: "${Tools.represent(error)}".`
                            )
                            break
                        }
                        if (get)
                            try {
                                value = get.call(this)
                            } catch (error) {
                                console.warn(
                                    `Error occured durring interpreting ` +
                                    `given "${name}" attribute value "` +
                                    `${value}": "${Tools.represent(error)}".`
                                )
                                break
                            }
                        this.properties[name] = value
                    } else
                        this.properties[name] = null
                    break
            }
        }
    }
    /**
     * Method which does the rendering job. Should be called when ever state
     * changes should be projected to the hosts dom content.
     * @returns Nothing.
     */
    render():void {
        let renderer:Function
        const scopeNames:Array<string> = Object.keys(this)
        try {
            renderer = new Function(
                ...scopeNames, `return \`${this._content}\``
            )
        } catch (error) {
            console.warn(
                `Faild to compile template "${this._content}" with scope ` +
                `variables "${scopeNames.join('", "')}": "` +
                `${Tools.represent(error)}".`
            )
        }
        if (renderer)
            try {
                this.root.innerHTML = renderer.call(
                    this, ...Object.values(this)
                )
            } catch (error) {
                console.warn(
                    'Faild to evaluate render function with template "' +
                    `${this._content}" with scope variables "` +
                    `${scopeNames.join('", "')}": "${Tools.represent(error)}".`
                )
            }
    }
    // endregion
}
export default Web
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
