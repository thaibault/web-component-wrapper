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
import Tools, {globalContext} from 'clientnode'
import PropertyTypes, {
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
} from 'clientnode/property-types'
import {EvaluationResult, Mapping, ValueOf} from 'clientnode/type'
import {ComponentType} from 'react'

import {EventToPropertyMapping, WebComponentAdapter} from './type'
// endregion
/**
 * Generic web component to render a content against instance specific values.
 * @property static:aliases - A mapping of property names to be treated as
 * equal.
 * @property static:content - Content template to render on property changes.
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
 * @property eventToPropertyMapping - Explicitly defined output events (a
 * mapping of event names to a potential parameter to properties transformer).
 * @property ignoreAttributeUpdates - Indicates whether attribute updates
 * should be considered (usually only needed internally).
 * @property instance - Wrapped component instance.
 * @property outputEventNames - Set of determined output event names.
 * @property properties - Holds currently evaluated properties.
 * @property root - Hosting dom node.
 * @property runDomConnectionAndRendringInSameEventQueue - Indicates whether
 * we should render initial dom immediately after the component is connected to
 * dom. Deactivating this allows wrapped components to detect their parents
 * since their parent connected callback will be called before the children's
 * render method.
 * @property self - Back-reference to this class.
 * @property slots - Grabbed slots which where present in the connecting phase.
 *
 * @property _aliasIndex - Internal alias index to quickly match them in both
 * directions.
 * @property _propertiesToReflectAsAttributes - A mapping of property names to
 * set as attributes when they are set/updated.
 * @property _propertyTypes - Configuration defining how to convert attributes
 * into properties and reflect property changes back to attributes.
 */
export class Web<TElement = HTMLElement> extends HTMLElement {
    // region properties
    static aliases:Mapping = {}
    static content:string|ComponentType = ''
    static readonly observedAttributes:Array<string> = []
    static useShadowDOM:boolean = false

    batchAttributeUpdates:boolean = true
    batchedAttributeUpdateRunning:boolean = true
    batchedPropertyUpdateRunning:boolean = true
    batchedUpdateRunning:boolean = true
    batchPropertyUpdates:boolean = true
    batchUpdates:boolean = true
    ignoreAttributeUpdates:boolean = false
    instance:null|{current?:WebComponentAdapter} = null
    eventToPropertyMapping:EventToPropertyMapping = {}
    outputEventNames:Set<string> = new Set<string>()
    properties:Mapping<any> = {}
    root:ShadowRoot|Web<TElement>
    runDomConnectionAndRendringInSameEventQueue:boolean = false
    readonly self:typeof Web = Web
    slots:Mapping<Node> & {default?:Array<Node>} = {}

    _aliasIndex:Mapping|undefined
    _propertiesToReflectAsAttributes:Map<string, boolean> =
        new Map<string, boolean>()
    _propertyTypes:Mapping<ValueOf<typeof PropertyTypes>> = {}
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
                    (
                        window as unknown as
                            {ShadyDOM:{wrap:(domNode:HTMLElement) =>
                                HTMLElement
                            }}
                    ).ShadyDOM.wrap(this) :
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

        const slots:NodeList = this.querySelectorAll('[slot]')
        for (let slot of Array.from(slots))
            this.slots[
                (
                    (slot as HTMLElement).getAttribute &&
                    (slot as HTMLElement).getAttribute('slot') &&
                    ((slot as HTMLElement).getAttribute('slot') as string)
                        .trim()
                ) ?
                    (
                        (slot as HTMLElement).getAttribute('slot') as string
                    ).trim() :
                    slot.nodeName
            ] = slot.cloneNode(true)
        if (this.slots.default)
            this.slots.default = [this.slots.default as unknown as Node]
        else if (this.childNodes.length > 0)
            this.slots.default = Array.from(this.childNodes)
        else
            this.slots.default = []

        this.runDomConnectionAndRendringInSameEventQueue ?
            this.render() :
            Tools.timeout(this.render.bind(this))
    }
    // endregion
    // region getter/setter
    /**
     * Creats an index to match alias source and target against each other on
     * constant runtime.
     * @param name - Name to search an alternate name for.
     * @returns Found alias or "null".
     */
    getAlias(name:string):null|string {
        if (!this._aliasIndex) {
            this._aliasIndex = {...this.self.aliases}
            // Align alias mapping for better performance while mapping them.
            for (const [name, value] of Object.entries(this._aliasIndex))
                if (!Object.prototype.hasOwnProperty.call(this._aliasIndex, value))
                    this._aliasIndex[value] = name
        }
        if (Object.prototype.hasOwnProperty.call(this._aliasIndex, name))
            return this._aliasIndex[name]
        return null
    }
    /**
     * Forwards "_propertiesToReflectAsAttributes" property value.
     * @returns Property value.
     */
    get propertiesToReflectAsAttributes():Map<string, boolean> {
        return this._propertiesToReflectAsAttributes
    }
    /**
     * Sets "_propertiesToReflectAsAttributes" property value.
     * @param value - New value to set.
     * @returns Nothing.
     */
    set propertiesToReflectAsAttributes(value:Map<string, boolean>) {
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
     * Internal property setter. Respects configured aliases.
     * @param name - Property name to write.
     * @param value - New value to write.
     * @returns Nothing.
     */
    setInternalPropertyValue(name:string, value:any):void {
        this.properties[name] = value

        const alias:null|string = this.getAlias(name)
        if (alias)
            this.properties[alias] = value
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
        this.setInternalPropertyValue(name, value)

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
    get propertyTypes():Mapping<ValueOf<typeof PropertyTypes>> {
        return this._propertyTypes
    }
    /**
     * Set internal property types. Triggers a re-evaluation of all given
     * attributes and re-renders current content.
     * @param value - New property types configuration.
     * @returns Nothing.
     */
    set propertyTypes(value:Mapping<ValueOf<typeof PropertyTypes>>) {
        this._propertyTypes = value
        this.updateAllAttributeEvaluations()
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
        this.outputEventNames.clear()
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
        for (const name of Object.keys(this.eventToPropertyMapping))
            if (!Object.prototype.hasOwnProperty.call(this.properties, name)) {
                result = true
                this.outputEventNames.add(name)
                this.setInternalPropertyValue(
                    name,
                    (...parameter:Array<any>):void => {
                        this.reflectEventToProperties(name, parameter)
                        this.forwardEvent(name, parameter)
                    }
                )
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
                func === this._propertyTypes[name]
            ) {
                this.outputEventNames.add(name)
                this.setInternalPropertyValue(
                    name,
                    (...parameter:Array<any>):void => {
                        if (reflectProperties)
                            this.reflectEventToProperties(name, parameter)
                        this.forwardEvent(name, parameter)
                    }
                )
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
            this.setInternalPropertyValue(name, value)
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
                            const valueAsString:string = `${value}`
                            if (this.getAttribute(name) !== valueAsString)
                                this.setAttribute(name, valueAsString)
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
                    this.setInternalPropertyValue(name, undefined)
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
            Object.prototype.hasOwnProperty.call(
                this.eventToPropertyMapping, name
            ) &&
            Tools.isFunction(this.eventToPropertyMapping[name])
        )
            this.reflectProperties(
                (this.eventToPropertyMapping[name] as Function)(...parameter)
            )
        else if (
            parameter.length > 0 &&
            parameter[0] !== null &&
            typeof parameter[0] === 'object'
        ) {
            /*
                Identified as some how throw data back event (no synthetic
                event; derived from a user triggered one) when following
                condition does not hold.
            */
            let newProperties:Mapping<any> = parameter[0]
            if (
                'persist' in parameter[0] &&
                Tools.isFunction(parameter[0].persist)
            ) {
                newProperties = {}
                for (const propertyName of Object.keys(this._propertyTypes))
                    for (const name of [propertyName].concat(
                        this.getAlias(propertyName) ?? []
                    )) {
                        let currentValue:any
                        if (
                            parameter[0].currentTarget &&
                            Object.prototype.hasOwnProperty.call(
                                parameter[0].currentTarget, name
                            )
                        )
                            /*
                                Update all known properties from event target
                                instance.
                            */
                            currentValue = parameter[0].currentTarget[name]
                        else
                            /*
                                Update all known properties from adapter
                                instance.
                            */
                            currentValue = this.getPropertyValue(name)
                        if (currentValue !== this.properties[name])
                            newProperties[name] = currentValue
                    }
            }
            this.reflectProperties(newProperties)
        }
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
        const alias:null|string = this.getAlias(name)
        if (
            alias &&
            Object.prototype.hasOwnProperty.call(this._propertyTypes, alias)
        )
            name = alias
        if (Object.prototype.hasOwnProperty.call(this._propertyTypes, name)) {
            const type:ValueOf<typeof PropertyTypes> =
                this._propertyTypes[name]
            if (value === null && boolean === type) {
                delete this.properties[name]
                const alias:null|string = this.getAlias(name)
                if (alias)
                    delete this.properties[alias]
                return
            }
            switch (type) {
                case boolean:
                    this.setInternalPropertyValue(
                        name, ![null, 'false'].includes(value)
                    )
                    break
                case number:
                    /*
                        NOTE: You should not name this variable "number" since
                        babel gets confused caused by existing module wide
                        property type variable "number".
                    */
                    const numberValue:number = parseFloat(value)
                    this.setInternalPropertyValue(
                        name, isNaN(numberValue) ? undefined : numberValue
                    )
                    break
                case func:
                    const callback:Function|string =
                        Tools.stringCompile(value, 'parameter')[1]
                    if (typeof callback === 'string')
                        console.warn(
                            `'Failed to process event handler "${name}": ` +
                            `${callback}.`
                        )
                    this.setInternalPropertyValue(
                        name,
                        (...parameter:Array<any>):void => {
                            if (this.outputEventNames.has(name))
                                this.reflectEventToProperties(name, parameter)
                            if (typeof callback === 'function')
                                try {
                                    callback.call(this, parameter)
                                } catch (error) {
                                    console.warn(
                                        `'Failed to evaluate event handler "` +
                                        `${name}" with expression "${value}"` +
                                        ` and scope variable "parameter" set` +
                                        ` to "${Tools.represent(parameter)}"` +
                                        `: "${Tools.represent(error)}".`
                                    )
                                }
                            this.forwardEvent(name, parameter)
                        }
                    )
                    break
                case string:
                    this.setInternalPropertyValue(name, value)
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
                        const evaluated:EvaluationResult =
                            Tools.stringEvaluate(value, {}, false, this)
                        if (
                            (evaluated as {compileError:string}).compileError ||
                            (evaluated as {runtimeError:string}).runtimeError
                        ) {
                            console.warn(
                                'Error occurred during processing given ' +
                                `attribute configuration "${name}": ` +
                                (
                                    evaluated as {compileError:string}
                                ).compileError ||
                                (
                                    evaluated as {runtimeError:string}
                                ).runtimeError
                            )
                            break
                        }
                        this.setInternalPropertyValue(
                            name, (evaluated as {result:any}).result
                        )
                    } else
                        this.setInternalPropertyValue(name, null)
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
        const evaluated:EvaluationResult =
            Tools.stringEvaluate(`\`${this.self.content}\``, this)
        if (
            (evaluated as {compileError:string}).compileError ||
            (evaluated as {runtimeError:string}).runtimeError
        ) {
            console.warn(
                `Faild to process template: ` +
                (evaluated as {compileError:string}).compileError ||
                (evaluated as {runtimeError:string}).runtimeError
            )
            return
        }
        this.root.innerHTML = (evaluated as {result:string}).result
    }
    // endregion
}
export default Web
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
