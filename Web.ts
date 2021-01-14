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
    NullSymbol,
    number,
    object,
    objectOf,
    oneOf,
    oneOfType,
    exact,
    shape,
    string,
    symbol,
    UndefinedSymbol
} from 'clientnode/property-types'
import {EvaluationResult, Mapping, PlainObject, ValueOf} from 'clientnode/type'

import {
    AttributesReflectionConfiguration,
    CompiledDomNodeTemplate,
    CompiledDomNodeTemplateItem,
    EventToPropertyMapping,
    WebComponentAdapter
} from './type'
// endregion
/**
 * Generic web component to render a content against instance specific values.
 * @property static:content - Content to render when changes happened.
 * @property static:observedAttributes - Attribute names to observe for
 * changes.
 * @property static:propertyAliases - A mapping of property names to be treated
 * as equal.
 * @property static:propertyTypes - Configuration defining how to convert
 * attributes into properties and reflect property changes back to attributes.
 * @property static:propertiesToReflectAsAttributes - An item, list or mapping
 * of properties to reflect as attributes.
 * @property static:shadowDOM - Configures if a shadow dom should be used
 * during web-component instantiation. Can hold initialize configuration.
 * @property static:trimSlots - Ignore empty text nodes while applying slots.
 *
 * @property static:_propertyAliasIndex - Internal alias index to quickly match
 * properties in both directions.
 * @property static:_propertiesToReflectAsAttributes - A mapping of property
 * names to set as attributes when they are set/updated. Uses a map to hold
 * order and determine if a property exists in constant runtime.
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
 * @property content - Content template to render on property changes.
 * @property eventToPropertyMapping - Explicitly defined output events (a
 * mapping of event names to a potential parameter to properties transformer).
 * @property externalProperties - Holds currently evaluated or seen properties.
 * @property ignoreAttributeUpdates - Indicates whether attribute updates
 * should be considered (usually only needed internally).
 * @property internalProperties - Holds currently evaluated properties which
 * are owned by this instance and should always be delegated.
 * @property instance - Wrapped component instance.
 * @property outputEventNames - Set of determined output event names.
 * @property root - Hosting dom node.
 * @property runDomConnectionAndRendringInSameEventQueue - Indicates whether
 * we should render initial dom immediately after the component is connected to
 * dom. Deactivating this allows wrapped components to detect their parents
 * since their parent connected callback will be called before the children's
 * render method.
 * @property self - Back-reference to this class.
 * @property slots - Grabbed slots which where present in the connecting phase.
 */
export class Web<TElement = HTMLElement> extends HTMLElement {
    // region properties
    static content:any = '<slot></slot>'
    static readonly observedAttributes:Array<string> = []
    static propertyAliases:Mapping = {}
    static propertyTypes:Mapping<ValueOf<typeof PropertyTypes>|string> = {}
    static propertiesToReflectAsAttributes:AttributesReflectionConfiguration =
        []
    static shadowDOM:boolean|null|{
        delegateFocus?:boolean
        mode:'closed'|'open'
    } = null
    static trimSlots:boolean = true
    static _propertyAliasIndex:Mapping|undefined
    static _propertiesToReflectAsAttributes:Map<string, string|ValueOf<typeof PropertyTypes>>|undefined

    batchAttributeUpdates:boolean = true
    batchedAttributeUpdateRunning:boolean = true
    batchedPropertyUpdateRunning:boolean = true
    batchedUpdateRunning:boolean = true
    batchPropertyUpdates:boolean = true
    batchUpdates:boolean = true
    externalProperties:Mapping<any> = {}
    ignoreAttributeUpdates:boolean = false
    instance:null|{current?:WebComponentAdapter} = null
    internalProperties:Mapping<any> = {}
    eventToPropertyMapping:EventToPropertyMapping = {}
    outputEventNames:Set<string> = new Set<string>()
    root:ShadowRoot|Web<TElement>
    runDomConnectionAndRendringInSameEventQueue:boolean = false
    readonly self:typeof Web = Web
    slots:Mapping<Node> & {default?:Array<Node>} = {}
    // endregion
    // region live cycle hooks
    /**
     * Initializes host dom content by attaching a shadow dom to it.
     * @returns Nothing.
     */
    constructor() {
        super()
        /*
            NOTE: We cannot not use someting like "this.." e.g. "this.self".
            to determine class properties since instance properties like "self"
            may not set properly yet because this method is called during
            constructing this instance itself.
        */
        this.self = this.constructor as unknown as typeof Web

        if (!this.self._propertiesToReflectAsAttributes)
            this.self._propertiesToReflectAsAttributes =
                this.self.normalizePropertyTypeList(
                    this.self.propertiesToReflectAsAttributes
                )

        this.generateAliasIndex()

        this.root = this.self.shadowDOM ?
            (
                (!('attachShadow' in this) && 'ShadyDOM' in window) ?
                    (
                        window as unknown as
                            {ShadyDOM:{wrap:(domNode:HTMLElement) =>
                                HTMLElement
                            }}
                    ).ShadyDOM.wrap(this) :
                    this
            ).attachShadow(
                (
                    this.self.shadowDOM !== null &&
                    typeof this.self.shadowDOM === 'object'
                ) ?
                    this.self.shadowDOM :
                    {mode: 'open'}
            ) :
            this

        /*
            NOTE: We define getter and setter at the end to avoid shadowing
            existing property names.
        */
        this.defineGetterAndSetterInterface()
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

        this.slots = {}
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
            ] = slot
            // NOTE: Append ".cloneNode(true)" if desired.
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
    /**
     * Frees some memory.
     */
    disconnectedCallback():void {
        this.slots = {}
    }
    // endregion
    // region getter/setter
    /**
     * Registers needed getter and setter to get notified about changes and
     * reflect them.
     * @returns Nothing.
     */
    defineGetterAndSetterInterface():void {
        const allPropertyNames:Array<string> = Tools.arrayUnique(
            Object.keys(this.self.propertyTypes)
                .concat(Object.keys(this.self.propertyAliases))
                .concat(Object.values(this.self.propertyAliases))
        )
        for (const propertyName of allPropertyNames)
            Object.defineProperty(
                this,
                propertyName,
                {
                    configurable: true,
                    get: function():any {
                        return this.getPropertyValue(propertyName)
                    },
                    set: function(value:any):void {
                        this.setPropertyValue(propertyName, value)
                    }
                }
            )
    }
    /**
     * Creats an index to match alias source and target against each other on
     * constant runtime.
     * @param name - Name to search an alternate name for.
     * @returns Found alias or "null".
     */
    getPropertyAlias(name:string):null|string {
        if (Object.prototype.hasOwnProperty.call(
            this.self._propertyAliasIndex, name
        ))
            return this.self._propertyAliasIndex![name]
        return null
    }
    /**
     * Generic property getter. Forwards properties from the "properties"
     * field.
     * @param name - Property name to retrieve.
     * @returns Retrieved property value.
     */
    getPropertyValue(name:string):any {
        const result:any = this.instance?.current?.properties ?
            this.instance.current.properties[name] :
            this.externalProperties[name]
        if (
            this.instance?.current?.state &&
            Object.prototype.hasOwnProperty.call(
                this.instance.current.state, name
            )
        )
            return this.instance.current.state[name]
        return result
    }
    /**
     * External property setter. Respects configured aliases.
     * @param name - Property name to write.
     * @param value - New value to write.
     * @returns Nothing.
     */
    setExternalPropertyValue(name:string, value:any):void {
        this.externalProperties[name] = value

        const alias:null|string = this.getPropertyAlias(name)
        if (alias)
            this.externalProperties[alias] = value
    }
    /**
     * Internal property setter. Respects configured aliases.
     * @param name - Property name to write.
     * @param value - New value to write.
     * @returns Nothing.
     */
    setInternalPropertyValue(name:string, value:any):void {
        if (value === null)
            value = NullSymbol
        else if (value === undefined)
            value = UndefinedSymbol

        this.internalProperties[name] = value

        const alias:null|string = this.getPropertyAlias(name)
        if (alias)
            this.internalProperties[alias] = value
    }
    /**
     * Generic property setter. Forwards field writes into "properties" field
     * and triggers re-rendering (optionally batched). After rendering all
     * known output events are triggered.
     *
     * In general it is a bad idea to write properties which shadow state
     * properties (move to a controlled component instance) and re-set the
     * property to "undefined" later to lose control.
     *
     * The reason causes in avoiding this scenario:
     *
     * 1. Property overwrites state.
     * 2. State changes but is shadowed by recent changes in property.
     *
     * Ensure:
     *
     * 1. Property overwrites state.
     * 2. Property is overwritten to "undefined" to lose control over state.
     * 3. State can change post property adaption didn't take effect anymore:
     *    Communicate change back by triggering output events.
     *
     * @param name - Property name to write.
     * @param value - New value to write.
     * @returns Nothing.
     */
    setPropertyValue(name:string, value:any):void {
        this.reflectProperties({[name]: Tools.copy(value)}, false)
        this.setInternalPropertyValue(name, Tools.copy(value))

        if (this.batchPropertyUpdates) {
            if (!(
                this.batchedPropertyUpdateRunning || this.batchedUpdateRunning
            )) {
                this.batchedPropertyUpdateRunning = true
                this.batchedUpdateRunning = true
                Tools.timeout(():void => {
                    if (value !== undefined && this.isStateProperty(name)) {
                        this.render()

                        Tools.timeout(():void => {
                            this.setInternalPropertyValue(name, undefined)

                            this.batchedPropertyUpdateRunning = false
                            this.batchedUpdateRunning = false

                            this.render()

                            this.triggerOuputEvents()
                        })
                    } else {
                        this.batchedPropertyUpdateRunning = false
                        this.batchedUpdateRunning = false

                        this.render()

                        this.triggerOuputEvents()
                    }
                })
            }
        } else {
            this.render()

            if (value !== undefined && this.isStateProperty(name)) {
                this.setInternalPropertyValue(name, undefined)

                this.render()
            }

            this.triggerOuputEvents()
        }
    }
    // endregion
    // region helper
    // / region utility
    // // region dom nodes
    /**
     * Compiles given node content and their children. Provides corresponding
     * map of compiled template functions connected to their (sub) nodes and
     * expected scope names.
     *
     * @param domNode - Node to compile.
     * @param scope - Scope to extract names from.
     * @param options - Additional compile options.
     * @returns Map of compiled templates.
     */
    static compileDomNodeTemplate<NodeType extends HTMLElement = HTMLElement>(
        domNode:NodeType,
        scope:any = [],
        options:{
            filter?:(domNode:NodeType) => boolean
            map?:CompiledDomNodeTemplate
            unsafe?:boolean
        } = {}
    ):CompiledDomNodeTemplate {
        options = {
            map: new Map(),
            unsafe: false,
            ...options
        }
        if (options.unsafe)
            if (Web.hasCode(domNode.innerHTML)) {
                const result:ReturnType<typeof Tools.stringCompile> =
                    Tools.stringCompile(`\`${domNode.innerHTML}\``, scope)
                options.map!.set(
                    domNode,
                    {
                        children: [],
                        scopeNames: result[0],
                        template: domNode.innerHTML,
                        templateFunction: result[1]
                    }
                )
            }
        else {
            const nodeName:string = domNode.nodeName.toLowerCase()
            let template:string|undefined
            if (['a', '#text'].includes(nodeName)) {
                const content:null|string = nodeName === 'a' ?
                    domNode.getAttribute('href') :
                    domNode.textContent
                if (Web.hasCode(content))
                    template = content!.replace(/&nbsp;/g, ' ').trim()
            }
            const children:Array<CompiledDomNodeTemplate> = []
            if (template) {
                const result:ReturnType<typeof Tools.stringCompile> =
                    Tools.stringCompile(`\`${template}\``, scope)
                options.map!.set(
                    domNode,
                    {
                        children,
                        scopeNames: result[0],
                        template,
                        templateFunction: result[1]
                    }
                )
            }
            // Render content of each nested node.
            let currentDomNode:ChildNode|null = domNode.firstChild
            while (currentDomNode) {
                if (
                    !options.filter ||
                    options.filter(currentDomNode as NodeType)
                )
                    children.push(Web.compileDomNodeTemplate<NodeType>(
                        currentDomNode as NodeType, scope, options
                    ))
                currentDomNode = currentDomNode.nextSibling
            }
        }
        return options.map!
    }
    /**
     * Compiles and evaluates given node content and their children. Replaces
     * each node content with their evaluated representation.
     *
     * @param domNode - Node to evaluate.
     * @param scope - Scope to render against.
     * @param filter - Filter function to avoid evaluation specific nodes.
     * @param map - Cache map to save compiled nodes in.
     * @returns Map of compiled templates.
     */
    static evaluateDomNodeTemplate<NodeType extends HTMLElement = HTMLElement>(
        domNode:NodeType,
        scope:any = {},
        options:{
            filter?:(domNode:NodeType) => boolean
            map?:CompiledDomNodeTemplate
            unsafe?:boolean
        } = {}
    ):CompiledDomNodeTemplate {
        options = {
            map: new Map(),
            unsafe: false,
            ...options
        }
        if (!options.map!.has(domNode))
            Web.compileDomNodeTemplate<NodeType>(domNode, scope, options)
        if (options.map!.has(domNode)) {
            const {scopeNames, templateFunction} = options.map!.get(domNode) as
                CompiledDomNodeTemplateItem
            if (typeof templateFunction === 'string')
                console.warn(
                    `Error occurred during compiling node content: ` +
                    templateFunction
                )
            else {
                let output:null|string = null
                try {
                    output = templateFunction(
                        ...scopeNames.map((name:string):any => scope[name])
                    )
                } catch (error) {
                    console.warn(
                        `Error occurred when running "${templateFunction}": ` +
                        `with bound names "${scopeNames.join('", "')}": "` +
                        `${Tools.represent(error)}".`
                    )
                }
                if (output !== null)
                    if (options.unsafe)
                        domNode.innerHTML = output
                    else if (domNode.nodeName.toLowerCase() === 'a')
                        domNode.setAttribute('href', output)
                    else
                        domNode.textContent = output
            }
        }
        if (!options.unsafe) {
            // Render content of each nested node.
            let currentDomNode:ChildNode|null = domNode.firstChild
            while (currentDomNode) {
                if (
                    !options.filter ||
                    options.filter(currentDomNode as NodeType)
                )
                    Web.evaluateDomNodeTemplate<NodeType>(
                        currentDomNode as NodeType, scope, options
                    )
                currentDomNode = currentDomNode.nextSibling
            }
        }
        return options.map!
    }
    /**
     * Replaces given dom node with given nodes.
     * @param domNode - Node to replace its children.
     * @param children - Element or array of elements to set as children.
     * @returns Nothing.
     */
    static replaceDomNodes(
        domNode:HTMLElement, children:Array<Node>|Node
    ):void {
        for (const child of ([] as Array<Node>).concat(children).reverse()) {
            if (!(
                Web.trimSlots &&
                (
                    child.nodeType === Node.TEXT_NODE &&
                    child.nodeValue?.trim() === ''
                )
            ))
                domNode.after(child)
        }
        domNode.remove()
    }
    /**
     * Moves content of given dom node one level up and removes given node.
     * @param domNode - Node to unwrap.
     * @returns Nothing.
     */
    static unwrapDomNode(domNode:HTMLElement):Array<ChildNode> {
        // Move all children out of the element to unwrap fallback content.
        const parent:HTMLElement = domNode.parentNode as HTMLElement
        const result:Array<ChildNode> = []
        while (domNode.firstChild) {
            result.push(domNode.firstChild)
            parent.insertBefore(domNode.firstChild, domNode)
        }
        parent.removeChild(domNode)
        return result
    }
    // // endregion
    /**
     * Checks if given content hast code (to compile and render).
     * @param content - Potential string with code inside.
     * @returns A boolean indicating whether given content has code.
     */
    static hasCode(content:any):boolean {
        return (
            // NOTE: First three conditions are only for performance.
            typeof content === 'string' &&
            content.includes('${') &&
            content.includes('}') &&
            /\${[\s\S]+}/.test(content)
        )
    }
    /**
     * Converts given list, item or map to a map (with ordering).
     * @param list - List to convert.
     * @returns Generated map.
     */
    static normalizePropertyTypeList(
        value:AttributesReflectionConfiguration
    ):Map<string, string|ValueOf<typeof PropertyTypes>> {
        if (typeof value === 'string')
            value = [value]
        if (Array.isArray(value)) {
            const givenValue:Array<string> = value
            value = new Map<string, string|ValueOf<typeof PropertyTypes>>()
            for (const name of givenValue)
                if (Web.propertyTypes.hasOwnProperty(name))
                    value.set(name, Web.propertyTypes[name])
        } else
            value = Tools.convertPlainObjectToMap(value)
        return value as Map<string, string|ValueOf<typeof PropertyTypes>>
    }
    // / endregion
    // / region events
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
            if (!Object.prototype.hasOwnProperty.call(
                this.internalProperties, name
            )) {
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
        for (const [name, type] of Object.entries(this.self.propertyTypes))
            if (
                !Object.prototype.hasOwnProperty.call(
                    this.internalProperties, name
                ) &&
                [func, 'function'].includes(
                    this.self.propertyTypes![name] as string
                )
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
            this.forwardEvent(name, [this.externalProperties])
    }
    /**
     * Forwards given event as native web event.
     * @param name - Event name.
     * @param parameter - Event parameter.
     * @returns Nothing.
     */
    forwardEvent(name:string, parameter:Array<any>):boolean {
        return this.dispatchEvent(
            new CustomEvent(name, {detail: {target: this, parameter}})
        )
    }
    // / endregion
    // / region slots
    /**
     * Renders component given slot contents into given dom node.
     * @param targetDomNode - Target dom node to render slots into.
     * @returns Nothing.
     */
    applySlots(targetDomNode:HTMLElement):void {
        // TODO unwrap domNode may return a text node only!
        for (const domNode of Array.from(targetDomNode.querySelectorAll(
            'slot'
        ))) {
            const name:null|string = domNode.getAttribute('name')
            if (name === null || name === 'default')
                if (this.slots.default)
                    this.self.replaceDomNodes(domNode, this.slots.default)
                else
                    this.slots.default = this.self.unwrapDomNode(domNode)
            else if (Object.prototype.hasOwnProperty.call(this.slots, name))
                this.self.replaceDomNodes(domNode, this.slots[name])
            else
                this.slots[name] = this.self.unwrapDomNode(domNode)
                    .filter((domNode:Node):boolean =>
                        domNode.nodeName.toLowerCase() !== '#text'
                    )[0]
        }
    }
    // / endregion
    // / region properties
    /**
     * Determines if given property name exists in wrapped component state.
     * @param name - Property name to check if exists in state.
     * @returns Boolean result.
     */
    isStateProperty(name:string):boolean {
        return Boolean(
            this.instance?.current?.state &&
            (
                Object.prototype.hasOwnProperty.call(
                    this.instance?.current?.state, name
                ) ||
                this.instance.current.state.modelState &&
                Object.prototype.hasOwnProperty.call(
                    this.instance.current.state.modelState, name
                )
            )
        )
    }
    /**
     * Generates an alias to name and the other way around mapping if not
     * exists.
     */
    generateAliasIndex():void {
        if (!this.self._propertyAliasIndex) {
            this.self._propertyAliasIndex = {...this.self.propertyAliases}
            // Align alias mapping for better performance while mapping them.
            for (const [name, value] of Object.entries(
                this.self._propertyAliasIndex
            ))
                if (!Object.prototype.hasOwnProperty.call(
                    this.self._propertyAliasIndex, value
                ))
                    this.self._propertyAliasIndex[value] = name
        }
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
            this.setExternalPropertyValue(name, value)
            const attributeName:string = Tools.stringCamelCaseToDelimited(name)
            if (this.self._propertiesToReflectAsAttributes!.has(name))
                switch (this.self._propertiesToReflectAsAttributes!.get(name)) {
                    case boolean:
                    case 'boolean':
                        if (value) {
                            if (this.getAttribute(attributeName) !== '')
                                this.setAttribute(attributeName, '')
                        } else if (this.hasAttribute(attributeName))
                            this.removeAttribute(attributeName)
                        break
                    case func:
                    case 'function':
                        break
                    case 'json':
                        if (value) {
                            const representation:string = JSON.stringify(value)
                            if (
                                representation &&
                                this.getAttribute(attributeName) !==
                                    representation
                            ) {
                                this.setAttribute(
                                    attributeName, representation
                                )
                                break
                            }
                        }
                        if (this.hasAttribute(attributeName))
                            this.removeAttribute(attributeName)
                        break
                    case number:
                    case 'number':
                        if (typeof value === 'number' && !isNaN(value)) {
                            const valueAsString:string = `${value}`
                            if (
                                this.getAttribute(attributeName) !==
                                    valueAsString
                            )
                                this.setAttribute(attributeName, valueAsString)
                        } else if (this.hasAttribute(attributeName))
                            this.removeAttribute(attributeName)
                        break
                    case string:
                    case 'string':
                        if (value) {
                            if (this.getAttribute(attributeName) !== value)
                                this.setAttribute(attributeName, value)
                        } else if (this.hasAttribute(attributeName))
                            this.removeAttribute(attributeName)
                        break
                    case any:
                    case array:
                    case arrayOf:
                    case element:
                    case elementType:
                    case instanceOf:
                    case node:
                    case object:
                    case 'object':
                    case objectOf:
                    case shape:
                    case exact:
                    case symbol:
                    default:
                        if (value) {
                            const representation:string =
                                Tools.represent(value)
                            if (
                                representation &&
                                this.getAttribute(attributeName) !==
                                    representation
                            ) {
                                this.setAttribute(
                                    attributeName, representation
                                )
                                break
                            }
                        }
                        if (this.hasAttribute(attributeName))
                            this.removeAttribute(attributeName)
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
            for (const name of Object.keys(this.instance.current.state).concat(
                this.instance.current.state.modelState ?
                    Object.keys(this.instance.current.state.modelState) :
                    []
            ))
                if (Object.prototype.hasOwnProperty.call(
                    this.internalProperties, name
                ))
                    /*
                        We want to avoid to fully delete this property to know
                        which properties exists on the underlying instance.
                    */
                    this.setInternalPropertyValue(name, undefined)
        if (this.internalProperties.model?.state) {
            delete this.internalProperties.model.state
            this.setInternalPropertyValue(
                'model', this.internalProperties.model
            )
        }

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
     * @param name - Event name.
     * @param parameter - List of parameter to given event handler call.
     * @returns Nothing.
     */
    reflectEventToProperties(name:string, parameter:Array<any>):void {
        /*
            NOTE: We enforce to update components state immediately after an
            event occurs since batching usually does not make sense here. An
            event is ran an its own context.
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
                for (const propertyName of Object.keys(this.self.propertyTypes))
                    for (const name of [propertyName].concat(
                        this.getPropertyAlias(propertyName) ?? []
                    )) {
                        const currentValue:any =
                            (
                                parameter[0].currentTarget &&
                                Object.prototype.hasOwnProperty.call(
                                    parameter[0].currentTarget, name
                                )
                            ) ?
                                /*
                                    Update all known properties from event
                                    target instance.
                                */
                                parameter[0].currentTarget[name] :
                                /*
                                    Update all known properties from adapter
                                    instance.
                                */
                                this.getPropertyValue(name)
                        if (currentValue !== this.externalProperties[name])
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
    evaluateStringOrNullAndSetAsProperty(name:string, value:null|string):void {
        name = Tools.stringDelimitedToCamelCase(name)
        const alias:null|string = this.getPropertyAlias(name)
        if (
            alias &&
            Object.prototype.hasOwnProperty.call(this.self.propertyTypes, alias)
        )
            name = alias
        if (Object.prototype.hasOwnProperty.call(
            this.self.propertyTypes, name
        )) {
            const type:ValueOf<typeof PropertyTypes>|string =
                this.self.propertyTypes[name]
            if (
                value === null && [boolean, 'boolean'].includes(type as string)
            ) {
                delete this.externalProperties[name]
                delete this.internalProperties[name]
                const alias:null|string = this.getPropertyAlias(name)
                if (alias) {
                    delete this.externalProperties[alias]
                    delete this.internalProperties[alias]
                }
                return
            }
            switch (type) {
                case boolean:
                case 'boolean':
                    const booleanValue:boolean = ![null, 'false'].includes(value)
                    this.setInternalPropertyValue(name, booleanValue)
                    this.setExternalPropertyValue(name, booleanValue)
                    break
                case func:
                case 'function':
                    let callback:Function|string|undefined
                    if (value) {
                        callback = Tools.stringCompile(value, 'parameter')[1]
                        if (typeof callback === 'string')
                            console.warn(
                                `'Failed to process event handler "${name}":` +
                                ` ${callback}.`
                            )
                    }
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
                    if (typeof callback === 'function')
                        this.setExternalPropertyValue(name, callback)
                    break
                case 'json':
                    if (value) {
                        let evaluated:PlainObject
                        try {
                            evaluated = JSON.parse(value)
                        } catch (error) {
                            console.warn(
                                'Error occurred during parsing given json ' +
                                `attribute "${name}": ` +
                                Tools.represent(error)
                            )
                            break
                        }
                        /*
                            NOTE: We have to avoid that both values changes
                            each other.
                        */
                        this.setInternalPropertyValue(name, evaluated)
                        this.setExternalPropertyValue(
                            name, Tools.copy(evaluated)
                        )
                    } else {
                        this.setInternalPropertyValue(name, null)
                        this.setExternalPropertyValue(name, null)
                    }
                    break
                case number:
                case 'number':
                    if (value === null) {
                        this.setInternalPropertyValue(name, value)
                        this.setExternalPropertyValue(name, value)
                        break
                    }
                    /*
                        NOTE: You should not name this variable "number" since
                        babel gets confused caused by existing module wide
                        property type variable "number".
                    */
                    let numberValue:number|undefined = parseFloat(value)
                    if (isNaN(numberValue))
                        numberValue = undefined
                    this.setInternalPropertyValue(name, numberValue)
                    this.setExternalPropertyValue(name, numberValue)
                    break
                case string:
                case 'string':
                    this.setInternalPropertyValue(name, value)
                    this.setExternalPropertyValue(name, value)
                    break
                case any:
                case array:
                case arrayOf:
                case element:
                case elementType:
                case instanceOf:
                case node:
                case object:
                case 'object':
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
                        if (evaluated.error) {
                            console.warn(
                                'Error occurred during processing given ' +
                                `attribute configuration "${name}": ` +
                                evaluated.error
                            )
                            break
                        }
                        /*
                            NOTE: We have to avoid that both values changes
                            each other.
                        */
                        this.setInternalPropertyValue(name, evaluated.result)
                        this.setExternalPropertyValue(
                            name, Tools.copy(evaluated.result)
                        )
                    } else {
                        this.setInternalPropertyValue(name, null)
                        this.setExternalPropertyValue(name, null)
                    }
                    break
            }
        }
    }
    // / endregion
    // / region render
    /**
     * Method which does the rendering job. Should be called when ever state
     * changes should be projected to the hosts dom content.
     * @returns Nothing.
     */
    render():void {
        const evaluated:EvaluationResult =
            Tools.stringEvaluate(
                `\`${this.self.content}\``,
                // Copy properties to avoid manipulations in nested structures.
                {self: this, Tools, ...Tools.copy(this.internalProperties)}
            )
        if (evaluated.error) {
            console.warn(`Faild to process template: ${evaluated.error}`)
            return
        }

        /*
            NOTE: We first render into an intermediate render target and apply
            slot content until we finally publish everything to document. This
            avoid painting twice and internet explorer bugs with empty node
            after first overwriting content of "this.root".
        */
        const renderTargetDomNode:HTMLDivElement =
            document.createElement('div')
        renderTargetDomNode.innerHTML = evaluated.result
        this.applySlots(renderTargetDomNode)

        this.root.innerHTML = renderTargetDomNode.innerHTML
    }
    // / endregion
    // endregion
}
export default Web
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
