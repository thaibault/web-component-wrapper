// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module web */
'use strict'
/* !
    region header
    [Project page](https://torben.website/web-component-wrapper)

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
} from 'clientnode/property-types'
import {
    CompilationResult,
    EvaluationResult,
    Mapping,
    PlainObject,
    TemplateFunction
} from 'clientnode/type'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import property from './decorator'
import {
    AttributesReflectionConfiguration,
    CompiledDomNodeTemplate,
    CompiledDomNodeTemplateItem,
    ComponentAdapter,
    EventCallbackMapping,
    EventMapper,
    EventMapping,
    EventToPropertyMapping,
    NormalizedAttributesReflectionConfiguration,
    PropertiesConfiguration,
    PropertyConfiguration,
    ScopeDeclaration,
    WebComponentAPI
} from './type'
// endregion
/**
 * Generic web component to render a content against instance specific values.
 * @property static:applyRootBinding - If determined itself as root declarative
 * event and property bindings will be applied to itself.
 * @property static:content - Content to render when changes happened.
 * @property static:determineRootBinding - If checked this component determines
 * if it is a root component (not wrapped by another web-component).
 *
 * @property static:shadowDOM - Configures if a shadow dom should be used
 * during web-component instantiation. Can hold initialize configuration.
 *
 * @property static:observedAttributes - Attribute names to observe for
 * changes.
 *
 * @property static:controllableProperties - A list of controllable property
 * names.
 * @property static:eventToPropertyMapping - Explicitly defined output events
 * (a mapping of event names to a potential parameter to properties
 * transformer).
 * @property static:propertyAliases - A mapping of property names to be treated
 * as equal.
 * @property static:propertyTypes - Configuration defining how to convert
 * attributes into properties and reflect property changes back to attributes.
 * @property static:propertiesToReflectAsAttributes - An item, list or mapping
 * of properties to reflect as attributes.
 * @property static:renderProperties - List of known render properties.
 *
 * @property static:cloneSlots - Indicates whether to clone slot nots before
 * transcluding them. If a slot should be used multiple times (for example when
 * it works as a template node) they should be copied to avoid unexpected
 * mutations.
 * @property static:evaluateSlots - Indicates whether to evaluate slot content
 * when before rendering them.
 * @property static:renderSlots - Indicates whether determined slots should be
 * rendered into root node.
 * @property static:trimSlots - Ignore empty text nodes while applying slots.
 *
 * @property static:renderUnsafe - Defines default render behavior.
 *
 * @property static:_name - Name to access instance evaluated content or used
 * to derive default component name. Also useful for logging.
 * @property static:_propertyAliasIndex - Internal alias index to quickly match
 * properties in both directions.
 * @property static:_propertiesToReflectAsAttributes - A mapping of property
 * names to set as attributes when they are set/updated. Uses a map to hold
 * order and determine if a property exists in constant runtime.
 *
 * @property batchAttributeUpdates - Indicates whether to directly update dom
 * after each attribute mutation or to wait and batch mutations after current
 * queue has been finished.
 * @property batchPropertyUpdates - Indicates whether to directly update dom
 * after each property mutation or to wait and batch mutations after current
 * queue has been finished.
 * @property batchUpdates - Indicates whether to directly perform a
 * re-rendering after changes on properties have been made.
 *
 * @property batchedAttributeUpdateRunning - A boolean indicator to identify if
 * an attribute update is currently batched.
 * @property batchedPropertyUpdateRunning - A boolean indicator to identify if
 * an property update is currently batched.
 * @property batchedUpdateRunning - Indicates whether a batched render update
 * is currently running.
 *
 * @property parent - Parent component instance.
 * @property rootInstance - Root component instance.
 * @property scope - Render scope.
 *
 * @property domNodeEventBindings - Holds a mapping from nodes with registered
 * event handlers mapped to their de-registration function.
 * @property domNodeTemplateCache - Caches template compilation results.
 *
 * @property externalProperties - Holds currently evaluated or seen properties.
 * @property ignoreAttributeUpdateObservations - Indicates whether attribute
 * updates should be considered (usually only needed internally).
 * @property internalProperties - Holds currently evaluated properties which
 * are owned by this instance and should always be delegated.
 *
 * @property outputEventNames - Set of determined output event names.
 *
 * @property instance - Wrapped component instance.
 * @property isRoot - Indicates whether their is exists another web derived
 * component up the tree or not.
 *
 * @property root - Hosting dom node.
 *
 * @property runDomConnectionAndRenderingInSameEventQueue - Indicates whether
 * we should render initial dom immediately after the component is connected to
 * dom. Deactivating this allows wrapped components to detect their parents
 * since their parent connected callback will be called before the children's
 * render method.
 *
 * @property self - Back-reference to this class.
 *
 * @property slots - Grabbed slots which where present in the connecting phase.
 */
export class Web<
    TElement = HTMLElement,
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends Mapping<unknown> = Mapping<unknown>
> extends HTMLElement {
    // region properties
    static applyRootBinding = true
    static content:unknown =
        '<slot>Please provide a template to transclude.</slot>'
    static determineRootBinding = true

    static shadowDOM:boolean|null|{
        delegateFocus?:boolean
        mode:'closed'|'open'
    } = null

    static observedAttributes:Array<string> = []

    static controllableProperties:Array<string> = []
    static eventToPropertyMapping:EventToPropertyMapping|null = {}
    static propertyAliases:Mapping = {}
    static propertyTypes:PropertiesConfiguration = {
        onClick: func
    }
    static propertiesToReflectAsAttributes:AttributesReflectionConfiguration =
        []
    static renderProperties:Array<string> = ['children']

    static cloneSlots = false
    static evaluateSlots = false
    static renderSlots = true
    static trimSlots = true

    static renderUnsafe = false

    static _name = 'BaseWeb'
    static _propertyAliasIndex:Mapping|undefined
    static _propertiesToReflectAsAttributes:(
        NormalizedAttributesReflectionConfiguration
    )

    batchAttributeUpdates = true
    batchPropertyUpdates = true
    batchUpdates = true

    batchedAttributeUpdateRunning = true
    batchedPropertyUpdateRunning = true
    batchedUpdateRunning = true

    parent:null|Web = null
    rootInstance:null|Web = null
    scope:Mapping<unknown> = {Tools}

    domNodeEventBindings:Map<Node, EventCallbackMapping> = new Map()
    domNodeTemplateCache:CompiledDomNodeTemplate = new Map()

    externalProperties:ExternalProperties = {} as ExternalProperties
    ignoreAttributeUpdateObservations = false
    internalProperties:InternalProperties = {} as InternalProperties

    outputEventNames:Set<string> = new Set<string>()

    instance:null|{current?:ComponentAdapter} = null
    @property({type: boolean, writeAttribute: true})
        isRoot = true

    root:ShadowRoot|Web<TElement, ExternalProperties, InternalProperties>

    runDomConnectionAndRenderingInSameEventQueue = false

    readonly self:typeof Web = Web

    slots:Mapping<HTMLElement> & {default?:Array<Node>} = {}
    // endregion
    // region live cycle hooks
    /**
     * Initializes host dom content and properties.
     * @returns Nothing.
     */
    constructor() {
        super()
        /*
            NOTE: We cannot not use something like "this.." e.g. "this.self".
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

        // NOTE: Shadow root will be applied when rendering the first time.
        this.root = this

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
     *
     * @returns Nothing.
     */
    attributeChangedCallback(
        name:string, oldValue:string, newValue:string
    ):void {
        if (this.ignoreAttributeUpdateObservations || oldValue === newValue)
            return

        this.updateAttribute(name, newValue)
    }
    /**
     * Updates given attribute representation.
     * NOTE: Does not update attribute, property or event bindings yet.
     * @param name - Attribute name which was updates.
     * @param newValue - New updated value.
     *
     * @returns Nothing.
     */
    updateAttribute(name:string, newValue:string):void {
        this.evaluateStringOrNullAndSetAsProperty(name, newValue)

        if (this.batchAttributeUpdates) {
            if (!(
                this.batchedAttributeUpdateRunning || this.batchedUpdateRunning
            )) {
                this.batchedAttributeUpdateRunning = true
                this.batchedUpdateRunning = true

                void Tools.timeout(():void => {
                    this.batchedAttributeUpdateRunning = false
                    this.batchedUpdateRunning = false

                    this.render('attributeChanged')
                })
            }
        } else
            this.render('attributeChanged')
    }
    /**
     * Triggered when this component is mounted into the document.
     * Attaches event handler, grabs given slots, reflects external properties
     * and enqueues first rendering.
     * @returns Nothing.
     */
    connectedCallback():void {
        // NOTE: Hack to support IE 11 here.
        try {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            ;(this as {isConnected:boolean}).isConnected = true
        } catch (error) {
            // Ignore error.
        }

        // NOTE: Can be overwritten during option root determining.
        this.parent = this
        this.rootInstance = this

        this.attachEventHandler()

        if (this.self.determineRootBinding)
            this.determineRootBinding()

        if (this.self.applyRootBinding && this.isRoot) {
            this.determineRenderScope()
            this.applyBinding(this, this.scope)
        }

        this.batchedAttributeUpdateRunning = false
        this.batchedPropertyUpdateRunning = false
        this.batchedUpdateRunning = false

        this.grabGivenSlots()

        this.reflectExternalProperties(this.externalProperties)

        this.runDomConnectionAndRenderingInSameEventQueue ?
            this.render('connected') :
            void Tools.timeout(():void => this.render('connected'))
    }
    /**
     * Frees some memory.
     */
    disconnectedCallback():void {
        // NOTE: Hack to support IE 11 here.
        try {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            ;(this as {isConnected:boolean}).isConnected = false
        } catch (error) {
            // Ignore error.
        }

        for (const map of this.domNodeEventBindings.values())
            for (const deregister of map.values())
                deregister()

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
        const allPropertyNames:Array<string> = Tools.arrayUnique<string>(
            Object.keys(this.self.propertyTypes)
                .concat(Object.keys(this.self._propertyAliasIndex!))
        )

        for (const propertyName of allPropertyNames) {
            // If there already exists a local value use them.
            if (Object.prototype.hasOwnProperty.call(this, propertyName))
                this.setPropertyValue(
                    propertyName, this[propertyName as keyof Web]
                )

            Object.defineProperty(
                this,
                propertyName,
                {
                    configurable: true,
                    get: ():unknown => this.getPropertyValue(propertyName),
                    set: (value:unknown):void => {
                        this.setPropertyValue(propertyName, value)

                        this.triggerPropertySpecificRendering(
                            propertyName, value
                        )
                    }
                }
            )
        }
    }
    /**
     * Creates an index to match alias source and target against each other on
     * constant runtime.
     * @param name - Name to search an alternate name for.
     *
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
     *
     * @returns Retrieved property value.
     */
    getPropertyValue(name:string):unknown {
        const result:unknown = (
            this.instance?.current?.properties &&
            (
                // NOTE: Base properties should not be shadowed.
                Object.prototype.hasOwnProperty.call(
                    !Web.propertyTypes, name
                ) ||
                Object.prototype.hasOwnProperty.call(
                    this.instance.current.properties, name
                )
            )
        ) ?
            this.instance.current.properties[name] :
            (this.externalProperties as Mapping<unknown>)[name]
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
     *
     * @returns Nothing.
     */
    setExternalPropertyValue(name:string, value:unknown):void {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(this.externalProperties as Mapping<unknown>)[name] = value

        const alias:null|string = this.getPropertyAlias(name)
        if (alias)
            (this.externalProperties as Mapping<unknown>)[alias] = value
    }
    /**
     * Internal property setter. Respects configured aliases.
     * @param name - Property name to write.
     * @param value - New value to write.
     *
     * @returns Nothing.
     */
    setInternalPropertyValue(name:string, value:unknown):void {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(this.internalProperties as Mapping<unknown>)[name] = value

        const alias:null|string = this.getPropertyAlias(name)
        if (alias)
            (this.internalProperties as Mapping<unknown>)[alias] = value
    }
    /**
     * Generic property setter. Forwards field writes into internal and
     * external property representations.
     * @param name - Property name to write.
     * @param value - New value to write.
     *
     * @returns Nothing.
     */
    setPropertyValue(name:string, value:unknown):void {
        this.reflectProperties({[name]: value} as ExternalProperties)
        this.setInternalPropertyValue(name, value)
    }
    /**
     * Triggers a new rendering cycle and respects property specific state
     * connection.
     * @param name - Property name to write.
     * @param value - New value to write.
     *
     * @returns Nothing.
     */
    triggerPropertySpecificRendering(name:string, value:unknown):void {
        if (this.batchPropertyUpdates) {
            if (!(
                this.batchedPropertyUpdateRunning || this.batchedUpdateRunning
            )) {
                this.batchedPropertyUpdateRunning = true
                this.batchedUpdateRunning = true

                void Tools.timeout(():void => {
                    if (value !== undefined && this.isStateProperty(name)) {
                        this.render('preStatePropertyChanged')

                        Tools.timeout(():void => {
                            this.setInternalPropertyValue(name, undefined)

                            this.batchedPropertyUpdateRunning = false
                            this.batchedUpdateRunning = false

                            this.render('postStatePropertyChanged')

                            this.triggerOutputEvents()
                        })
                            .then(Tools.noop, Tools.noop)
                    } else {
                        this.batchedPropertyUpdateRunning = false
                        this.batchedUpdateRunning = false

                        this.render('propertyChanged')

                        this.triggerOutputEvents()
                    }
                })
            }
        } else {
            const isStateProperty:boolean = this.isStateProperty(name)

            this.render(
                isStateProperty ? 'preStatePropertyChanged' : 'propertyChanged'
            )

            if (value !== undefined && isStateProperty) {
                this.setInternalPropertyValue(name, undefined)

                this.render('postStatePropertyChanged')
            }

            this.triggerOutputEvents()
        }
    }
    // endregion
    // region helper
    /// region utility
    //// region dom nodes
    /**
     * Binds properties and event handler to given dom node.
     * @param domNode - Node to start traversing from.
     * @param scope - Scope to render property value again.
     *
     * @returns Nothing.
     */
    applyBinding(domNode:Node, scope:Mapping<unknown>):void {
        if (!(domNode as HTMLElement).getAttributeNames)
            return

        for (const attributeName of (domNode as HTMLElement).getAttributeNames(
        )) {
            let name = ''
            if (attributeName.startsWith('data-bind-'))
                name = attributeName.substring('data-bind-'.length)
            else if (attributeName.startsWith('bind-'))
                name = attributeName.substring('bind-'.length)

            if (name) {
                const value:null|string = (domNode as HTMLElement)
                    .getAttribute(attributeName)

                if (value === null)
                    continue

                if (
                    name.startsWith('attribute-') ||
                    name.startsWith('property-')
                ) {
                    const evaluated:EvaluationResult =
                        Tools.stringEvaluate(value, scope, false, domNode)

                    if (evaluated.error) {
                        console.warn(
                            'Error occurred during processing given ' +
                            `attribute binding "${attributeName}" on node:`,
                            domNode,
                            evaluated.error
                        )
                        continue
                    }

                    if (name.startsWith('attribute-'))
                        (domNode as HTMLElement).setAttribute(
                            name.substring('attribute-'.length),
                            evaluated.result
                        )
                    else
                        /*
                            NOTE: Cast to "textContent" to have a writable
                            property here.
                        */
                        domNode[Tools.stringDelimitedToCamelCase(
                            name.substring('property-'.length)
                        ) as 'textContent'] = evaluated.result
                } else if (name.startsWith('on-')) {
                    if (!this.domNodeEventBindings.has(domNode))
                        this.domNodeEventBindings.set(
                            // eslint-disable-next-line func-call-spacing
                            domNode, new Map<string, () => void>()
                        )

                    const eventMap:EventCallbackMapping =
                        this.domNodeEventBindings.get(domNode)!

                    name = Tools.stringDelimitedToCamelCase(
                        name.substring('on-'.length)
                    )

                    if (eventMap.has(name))
                        eventMap.get(name)!()

                    scope = {event: undefined, parameters: undefined, ...scope}
                    /*
                        NOTE: We pre-compile event listener since they should
                        usually be called more than it would be re-rendered.
                    */
                    const compilation:CompilationResult =
                        Tools.stringCompile(value, scope, true)

                    if (compilation.error)
                        console.warn(
                            'Error occurred during compiling given event ' +
                            `binding "${attributeName}" on node:`,
                            domNode,
                            compilation.error
                        )
                    else {
                        const templateFunction:TemplateFunction =
                            compilation.templateFunction.bind(domNode)

                        const handler:EventListener = (
                            ...parameters:Array<unknown>
                        ):void => {
                            scope.event = parameters[0]
                            scope.parameters = parameters

                            try {
                                templateFunction(
                                    /*
                                        NOTE: We want to be ensure to have same
                                        ordering as we have for the scope names
                                        and to call internal registered getter
                                        by retrieving values. So simple using
                                        "...Object.values(scope)" is not
                                        appreciate here.
                                    */
                                    ...compilation.originalScopeNames.map(
                                        (name:string):unknown => scope[name]
                                    )
                                )
                            } catch (error) {
                                console.warn(
                                    'Error occurred during processing given ' +
                                    `event binding "${attributeName}" on ` +
                                    'node:',
                                    domNode,
                                    `Given expression "${value}" could not ` +
                                    'be evaluated with given scope names "' +
                                    `${compilation.scopeNames.join('", "')}"` +
                                    `: ${Tools.represent(error)}`
                                )
                            }
                        }

                        domNode.addEventListener(name, handler)
                        eventMap.set(name, ():void => {
                            domNode.removeEventListener(name, handler)

                            eventMap.delete(name)

                            if (eventMap.size === 0)
                                this.domNodeEventBindings.delete(domNode)
                        })
                    }
                }
            }
        }
    }
    /**
     * Binds properties and event handler to given, sibling and nested nodes.
     * @param domNode - Node to start traversing from.
     * @param scope - Scope to render property value again.
     * @param renderSlots - Indicates whether to render nested elements of
     * slots (determined by an existing corresponding attribute).
     *
     * @returns Nothing.
     */
    applyBindings(
        domNode:Node|null, scope:Mapping<unknown>, renderSlots = true
    ):void {
        while (domNode) {
            if (
                (domNode as HTMLElement).attributes?.length &&
                (renderSlots || !(domNode as HTMLElement).getAttribute('slot'))
            )
                this.applyBinding(domNode, scope)
            /*
                NOTE: Slots of nested custom components (recognized by their
                dash in name) should be rendered by themself.
            */
            if (!domNode.nodeName.toLowerCase().includes('-'))
                this.applyBindings(domNode.firstChild, scope)

            domNode = domNode.nextSibling
        }
    }
    /**
     * Compiles given node content and their children. Provides corresponding
     * map of compiled template functions connected to their (sub) nodes and
     * expected scope names.
     * @param domNode - Node to compile.
     * @param scope - Scope to extract names from.
     * @param options - Additional compile options.
     * @param options.filter - Callback to exclude some node from being
     * compiled.
     * @param options.ignoreComponents - Indicates if component properties
     * should be traversed or not.
     * @param options.ignoreNestedComponents - Indicates if nested components
     * should be traversed or not.
     * @param options.map - Yet compiled dom nodes to just reference instead of
     * recompiling.
     * @param options.unsafe - Indicates if full html generation should be
     * allowed.
     *
     * @returns Map of compiled templates.
     */
    compileDomNodeTemplate<NodeType extends Node = Node>(
        domNode:NodeType,
        scope:ScopeDeclaration = [],
        options:{
            filter?:(_domNode:NodeType) => boolean
            ignoreComponents?:boolean
            ignoreNestedComponents?:boolean
            map?:CompiledDomNodeTemplate
            unsafe?:boolean
        } = {}
    ):CompiledDomNodeTemplate<NodeType> {
        options = {
            ignoreComponents: true,
            ignoreNestedComponents: true,
            map: this.domNodeTemplateCache,
            unsafe: this.self.renderUnsafe,
            ...options
        }
        /*
            NOTE: Slots of nested custom components (recognized by their dash
            in name) should be rendered / controlled by themself.
        */
        if (
            options.ignoreComponents &&
            domNode.nodeName?.toLowerCase().includes('-')
        )
            return options.map as CompiledDomNodeTemplate<NodeType>

        if (options.unsafe) {
            let template:string = (domNode as unknown as HTMLElement).innerHTML
            if (
                !template && (domNode as NodeType & {template:string}).template
            )
                template = (domNode as NodeType & {template:string}).template

            if (this.self.hasCode(template)) {
                const result:CompilationResult =
                    Tools.stringCompile(`\`${template}\``, scope)

                options.map!.set(
                    domNode,
                    {
                        children: [],
                        error: result.error,
                        scopeNames: result.scopeNames,
                        template,
                        templateFunction: result.templateFunction
                    }
                )
            }
        } else {
            const nodeName:string = domNode.nodeName.toLowerCase()
            let template:string|undefined
            if (['a', '#text'].includes(nodeName)) {
                const content:null|string =
                    nodeName === 'a' ?
                        (domNode as unknown as HTMLLinkElement)
                            .getAttribute('href') :
                        domNode.textContent

                if (this.self.hasCode(content))
                    template = content!.replace(/&nbsp;/g, ' ').trim()
            }

            const children:Array<CompiledDomNodeTemplate> = []

            if (template) {
                const result:CompilationResult =
                    Tools.stringCompile(`\`${template}\``, scope)

                options.map!.set(
                    domNode,
                    {
                        children,
                        error: result.error,
                        scopeNames: result.scopeNames,
                        template,
                        templateFunction: result.templateFunction
                    }
                )
            }

            // Compile content of each nested node.
            let currentDomNode:ChildNode|null = domNode.firstChild
            while (currentDomNode) {
                if (
                    !options.filter ||
                    options.filter(currentDomNode as unknown as NodeType)
                )
                    children.push(this.compileDomNodeTemplate<NodeType>(
                        currentDomNode as unknown as NodeType,
                        scope,
                        {
                            ...options,
                            ignoreComponents: options.ignoreNestedComponents
                        }
                    ))

                currentDomNode = currentDomNode.nextSibling
            }
        }

        return options.map as CompiledDomNodeTemplate<NodeType>
    }
    /**
     * Compiles and evaluates given node content and their children. Replaces
     * each node content with their evaluated representation.
     * @param domNode - Node to evaluate.
     * @param scope - Scope to render against.
     * @param options - Compile options.
     * @param options.applyBindings - Indicates whether to apply bindings to
     * given dom nodes.
     * @param options.filter - Callback to exclude some node from being
     * compiled.
     * @param options.ignoreComponents - Indicates if component properties
     * should be traversed or not.
     * @param options.ignoreNestedComponents - Indicates if nested components
     * should be traversed or not.
     * @param options.map - Yet compiled dom nodes to just reference instead of
     * recompiling.
     * @param options.unsafe - Indicates if full html generation should be
     * allowed.
     *
     * @returns Map of compiled templates.
     */
    evaluateDomNodeTemplate<NodeType extends Node = Node>(
        domNode:NodeType,
        scope:Mapping<unknown> = {},
        options:{
            applyBindings?:boolean
            filter?:(_domNode:NodeType) => boolean
            ignoreComponents?:boolean
            ignoreNestedComponents?:boolean
            map?:CompiledDomNodeTemplate
            unsafe?:boolean
        } = {}
    ):CompiledDomNodeTemplate<NodeType> {
        options = {
            applyBindings: true,
            ignoreComponents: true,
            ignoreNestedComponents: true,
            map: this.domNodeTemplateCache,
            unsafe: this.self.renderUnsafe,
            ...options
        }

        if (!options.map!.has(domNode))
            this.compileDomNodeTemplate<NodeType>(domNode, scope, options)

        if (options.map!.has(domNode)) {
            const {error, scopeNames, templateFunction} =
                options.map!.get(domNode) as CompiledDomNodeTemplateItem

            if (error)
                console.warn(
                    `Error occurred during compiling node content: ${error}`
                )
            else {
                let output:null|string = null

                try {
                    output = templateFunction(
                        ...scopeNames.map((name:string):unknown => scope[name])
                    )
                } catch (error) {
                    console.warn(
                        `Error occurred when "${this.self._name}" is running` +
                        ` "${templateFunction as unknown as string}": with ` +
                        `bound names "${scopeNames.join('", "')}": "` +
                        `${error as string}". Rendering node:`,
                        domNode
                    )
                }

                if (output !== null)
                    if (options.unsafe)
                        (domNode as unknown as HTMLElement).innerHTML = output
                    else if (domNode.nodeName.toLowerCase() === 'a')
                        (domNode as unknown as HTMLElement)
                            .setAttribute('href', output)
                    else
                        domNode.textContent = output
            }
        }
        /*
            NOTE: Slots of nested custom components (recognized by their dash
            in name) should be rendered / controlled by themself.
        */
        if (!(
            options.unsafe ||
            options.ignoreComponents &&
            domNode.nodeName?.toLowerCase().includes('-')
        )) {
            // Render content of each nested node.
            let currentDomNode:NodeType|null =
                domNode.firstChild as unknown as NodeType

            while (currentDomNode) {
                if (!options.filter || options.filter(currentDomNode))
                    this.evaluateDomNodeTemplate<NodeType>(
                        currentDomNode,
                        scope,
                        {
                            ...options,
                            applyBindings: false,
                            ignoreComponents: options.ignoreNestedComponents
                        }
                    )

                currentDomNode = currentDomNode.nextSibling as
                    unknown as NodeType
            }
        }

        if (options.applyBindings)
            this.applyBindings(domNode, scope)

        return options.map as CompiledDomNodeTemplate<NodeType>
    }
    /**
     * Replaces given dom node with given nodes.
     * @param domNode - Node to replace its children.
     * @param children - Element or array of elements to set as children.
     *
     * @returns Nothing.
     */
    static replaceDomNodes(
        domNode:HTMLElement, children:Array<Node>|Node
    ):void {
        for (const child of ([] as Array<Node>).concat(children).reverse())
            if (!(
                Web.trimSlots &&
                (
                    child.nodeType === Node.TEXT_NODE &&
                    child.nodeValue?.trim() === ''
                )
            ))
                domNode.after(child)

        domNode.remove()
    }
    /**
     * Moves content of given dom node one level up and removes given node.
     * @param domNode - Node to unwrap.
     *
     * @returns List of unwrapped nodes.
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
    //// endregion
    /**
     * Determines initial root wich initializes rendering digest.
     * @returns Nothing.
     */
    determineRootBinding():void {
        /*
            If this component is the root component trigger event handler by
            its own in global context.
        */
        let currentElement:Node|null = this.parentNode
        while (currentElement) {
            if (
                currentElement instanceof Web ||
                currentElement.nodeName?.includes('-') ||
                /*
                    NOTE: Assume none root if determined a wrapped closed
                    shadow root.
                */
                currentElement.parentNode === null &&
                currentElement.toString() === '[object ShadowRoot]'
            )
                if (this.rootInstance === this) {
                    this.parent = currentElement as Web
                    this.rootInstance = currentElement as Web

                    this.setPropertyValue('isRoot', false)
                } else
                    this.rootInstance = currentElement as Web

            currentElement = currentElement.parentNode
        }
    }
    /**
     * Checks if given content hast code (to compile and render).
     * @param content - Potential string with code inside.
     *
     * @returns A boolean indicating whether given content has code.
     */
    static hasCode(content:unknown):boolean {
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
     * @param value - Attribute reflection configuration.
     *
     * @returns Generated map.
     */
    static normalizePropertyTypeList(
        value:AttributesReflectionConfiguration
    ):NormalizedAttributesReflectionConfiguration {
        if (typeof value === 'string')
            value = [value]

        if (Array.isArray(value)) {
            const givenValue:Array<string> = value
            const newValue:NormalizedAttributesReflectionConfiguration =
                new Map<string, PropertyConfiguration>()
            for (const name of givenValue)
                if (Object.prototype.hasOwnProperty.call(
                    Web.propertyTypes, name
                ))
                    newValue.set(name, Web.propertyTypes[name])

            return newValue
        }

        return Tools.convertPlainObjectToMap(value) as
            NormalizedAttributesReflectionConfiguration
    }
    /// endregion
    /// region events
    /**
     * Attaches event handler to keep in sync with nested components properties
     * states.
     * @returns Nothing.
     */
    attachEventHandler():void {
        if (this.self.eventToPropertyMapping === null)
            return

        /*
            NOTE: We only reflect properties by implicit determined events if
            their where no explicitly defined.
        */
        const somethingDefined:boolean =
            this.attachExplicitDefinedOutputEventHandler()

        this.attachImplicitDefinedOutputEventHandler(!somethingDefined)
    }
    /**
     * Attach explicitly defined event handler to synchronize internal and
     * external property states.
     * @returns Returns "true" if there are some defined and "false" otherwise.
     */
    attachExplicitDefinedOutputEventHandler():boolean {
        // Grab all existing output to property specifications
        let result = false
        for (const name of Object.keys(this.self.eventToPropertyMapping!))
            if (!Object.prototype.hasOwnProperty.call(
                this.internalProperties, name
            )) {
                result = true
                this.outputEventNames.add(name)
                this.setInternalPropertyValue(
                    name,
                    (...parameters:Array<unknown>):void => {
                        const result:Mapping<unknown>|null =
                            this.reflectEventToProperties(name, parameters)

                        if (result)
                            parameters[0] = result
                        this.forwardEvent(name, parameters)
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
     *
     * @returns Nothing.
     */
    attachImplicitDefinedOutputEventHandler(
        reflectProperties = true
    ):void {
        // Determine all event handler to inject
        for (const [name, type] of Object.entries(this.self.propertyTypes))
            if (
                !Object.prototype.hasOwnProperty.call(
                    this.internalProperties, name
                ) &&
                ([func, 'function'] as Array<PropertyConfiguration>)
                    .includes(type as PropertyConfiguration) &&
                !this.self.renderProperties.includes(name)
            ) {
                this.outputEventNames.add(name)

                this.setInternalPropertyValue(
                    name,
                    (...parameters:Array<unknown>):void => {
                        if (reflectProperties)
                            this.reflectEventToProperties(name, parameters)

                        this.forwardEvent(name, parameters)
                    }
                )
            }
    }
    /**
     * Triggers all identified events to communicate internal property / state
     * changes.
     * @returns Nothing.
     */
    triggerOutputEvents():void {
        for (const name of this.outputEventNames)
            this.forwardEvent(name, [this.externalProperties])
    }
    /**
     * Forwards given event as native web event.
     * @param name - Event name.
     * @param parameters - Event parameters.
     *
     * @returns Nothing.
     */
    forwardEvent(name:string, parameters:Array<unknown>):boolean {
        if (name.length > 'onX'.length && name.startsWith('on'))
            name = Tools.stringLowerCase(name.substring(2))

        return this.dispatchEvent(
            new CustomEvent(name, {detail: {parameters}})
        )
    }
    /// endregion
    /// region slots
    /**
     * Renders component given slot contents into given dom node. If expected
     * slots are not given but a fallback is specified they will be loaded into
     * internal slot mapping.
     * @param targetDomNode - Target dom node to render slots into.
     * @param scope - Environment to render slots again if specified.
     *
     * @returns Nothing.
     */
    applySlots(targetDomNode:HTMLElement, scope:Mapping<unknown>):void {
        for (const domNode of Array.from(
            targetDomNode.querySelectorAll<HTMLElement>('slot')
        )) {
            const name:null|string = domNode.getAttribute('name')
            if (name === null || name === 'default')
                if (this.slots.default) {
                    if (this.self.renderSlots) {
                        if (this.self.evaluateSlots)
                            for (const domNode of this.slots.default)
                                this.evaluateDomNodeTemplate(domNode, scope)

                        this.self.replaceDomNodes(domNode, this.slots.default)
                    }
                } else
                    this.slots.default = this.self.unwrapDomNode(domNode)
                        .map((domNode:Node):Node =>
                            this.grabSlotContent(domNode)
                        )
            else if (Object.prototype.hasOwnProperty.call(this.slots, name)) {
                if (this.self.renderSlots) {
                    if (this.self.evaluateSlots)
                        this.evaluateDomNodeTemplate(this.slots[name], scope)

                    this.self.replaceDomNodes(domNode, this.slots[name])
                }
            } else
                this.slots[name] = this.grabSlotContent(
                    this.self.unwrapDomNode(domNode)
                        .filter((domNode:Node):boolean =>
                            domNode.nodeName.toLowerCase() !== '#text'
                        )[0]
                ) as HTMLElement
        }
    }
    /**
     * Determines slot content from given node.
     * @param slot - Node to grab slot content from.
     *
     * @returns Determined slot.
     */
    grabSlotContent(slot:Node):Node {
        /*
            If real (template) code is wrapped in a "textarea" tag unwrap it
            now. This extra wrapping can be used to avoid first dom rendering
            before actual template code has been evaluated.
        */
        if (
            (slot as HTMLElement).firstElementChild?.nodeName.toLowerCase() ===
                'textarea' &&
            (
                !(slot as HTMLElement).firstElementChild!.hasAttribute(
                    'data-no-template'
                ) ||
                (slot as HTMLElement).firstElementChild!.getAttribute(
                    'data-no-template'
                ) === 'false'
            )
        ) {
            const content:string =
                ((slot as HTMLElement).firstElementChild as HTMLInputElement)
                    .value
            /*
                NOTE: These kind of slots is always used as a template and
                should therefor be copied in every case.
                NOTE: A flat copy should suffice since we will replace nested
                content either.
                NOTE: Remove template content in copied node to avoid to render
                them before being evaluated. We cannot remove template code
                from source node since this would make it impossible to
                re-instantiate this slot during whole component
                re-instantiation.
            */
            ;(slot as HTMLElement).classList?.remove('web-component-template')
            const newSlot:Node = slot.cloneNode()
            ;(slot as HTMLElement).classList?.add('web-component-template')
            ;(newSlot as HTMLElement).innerHTML = ''
            ;(newSlot as Node & {template:string}).template = content
            return newSlot
        }
        return this.self.cloneSlots ? slot.cloneNode(true) : slot
    }
    /**
     * Saves given slots.
     * @returns Nothing.
     */
    grabGivenSlots():void {
        this.slots = {}

        for (const slot of Array.from(this.querySelectorAll('[slot]'))) {
            // NOTE: This is how we avoid to grab slots from nested components.
            let currentElement:Node|null = slot.parentNode
            let skip = true
            while (currentElement) {
                if (currentElement.nodeName.includes('-')) {
                    if (currentElement === this)
                        skip = false

                    break
                }

                currentElement = currentElement.parentNode
            }
            if (skip)
                continue

            this.slots[
                (
                    slot.getAttribute &&
                    slot.getAttribute('slot') &&
                    slot.getAttribute('slot')!.trim()
                ) ?
                    slot.getAttribute('slot')!.trim() :
                    slot.nodeName.toLowerCase()
            ] = this.grabSlotContent(slot) as HTMLElement
        }
        if (this.slots.default)
            this.slots.default = [this.slots.default as unknown as Node]
        else if (this.childNodes.length > 0)
            this.slots.default = Array.from(this.childNodes)
                .map((domNode:Node):Node => this.grabSlotContent(domNode))
        else
            this.slots.default = []
    }
    /// endregion
    /// region properties
    /**
     * Determines if given property name exists in wrapped component state.
     * @param name - Property name to check if exists in state.
     *
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
     * Reflects wrapped component state back to web-component's attributes.
     * @param properties - Properties to update in reflected attribute state.
     *
     * @returns Nothing.
     */
    reflectExternalProperties(properties:Partial<ExternalProperties>):void {
        /*
            NOTE: We can avoid an additional attribute parsing for this
            reflections.
        */
        this.ignoreAttributeUpdateObservations = true
        for (const [name, value] of Object.entries(properties)) {
            this.setExternalPropertyValue(name, value)

            if (!this.isConnected)
                continue

            const attributeName:string = Tools.stringCamelCaseToDelimited(name)
            if (this.self._propertiesToReflectAsAttributes.has(name))
                switch (
                    this.self._propertiesToReflectAsAttributes.get(name)
                ) {
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
                            this.getAttribute(attributeName) !== representation
                        ) {
                            this.setAttribute(attributeName, representation)

                            break
                        }
                    }
                    if (this.hasAttribute(attributeName))
                        this.removeAttribute(attributeName)

                    break
                case number:
                case 'number':
                    if (typeof value === 'number' && !isNaN(value)) {
                        const valueAsString = `${value}`
                        if (this.getAttribute(attributeName) !== valueAsString)
                            this.setAttribute(attributeName, valueAsString)
                    } else if (this.hasAttribute(attributeName))
                        this.removeAttribute(attributeName)

                    break
                case string:
                case 'string':
                    if (value) {
                        if (this.getAttribute(attributeName) !== value)
                            this.setAttribute(attributeName, value as string)
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
                        const representation:string = Tools.represent(value)
                        if (
                            representation &&
                            this.getAttribute(attributeName) !== representation
                        ) {
                            this.setAttribute(attributeName, representation)

                            break
                        }
                    }
                    if (this.hasAttribute(attributeName))
                        this.removeAttribute(attributeName)

                    break
                }
        }

        this.ignoreAttributeUpdateObservations = false
    }
    /**
     * Reflects wrapped component state back to web-component's attributes and
     * properties.
     * @param properties - Properties to update in reflected property state.
     *
     * @returns Nothing.
     */
    reflectProperties(properties:Partial<ExternalProperties>):void {
        this.reflectExternalProperties(properties)

        /*
            NOTE: Do not reflect properties which are hold in state. These
            values are only set once when they are explicitly set (see
            "setPropertyValue").
        */
        if (
            this.instance?.current?.state &&
            typeof this.instance.current.state === 'object'
        )
            for (const name of Object.keys(this.instance.current.state)
                .concat(
                    this.instance.current.state.modelState ?
                        Object.keys(
                            this.instance.current.state.modelState as
                                Mapping<unknown>
                        ) :
                        []
                )
            )
                if (Object.prototype.hasOwnProperty.call(
                    this.internalProperties, name
                ))
                    /*
                        We want to avoid to fully delete this property to know
                        which properties exists on the underlying instance.
                    */
                    this.setInternalPropertyValue(name, undefined)

        if ((this.internalProperties.model as {state:unknown})?.state) {
            delete (this.internalProperties.model as {state:unknown})?.state

            this.setInternalPropertyValue(
                'model', this.internalProperties.model
            )
        }

        for (const name of this.self.controllableProperties)
            if (Object.prototype.hasOwnProperty.call(properties, name))
                this.setInternalPropertyValue(name, properties[name])
    }
    /**
     * Triggers a new rendering cycle by respecting batch configuration.
     * @param reason - A description why rendering should be triggered.
     *
     * @returns Nothing.
     */
    triggerRender(reason:string):void {
        if (this.batchUpdates) {
            if (!this.batchedUpdateRunning) {
                this.batchedUpdateRunning = true
                void Tools.timeout(():void => {
                    this.batchedUpdateRunning = false

                    this.render(reason)
                })
            }
        } else
            this.render(reason)
    }
    /**
     * Reflect given event handler call with given parameter back to current
     * properties state.
     * @param name - Event name.
     * @param parameters - List of parameter to given event handler call.
     *
     * @returns Mapped properties or null if nothing could be mapped.
     */
    reflectEventToProperties(
        name:string, parameters:Array<unknown>
    ):Partial<ExternalProperties>|null {
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

        let result:Partial<ExternalProperties>|null = null

        if (
            this.self.eventToPropertyMapping &&
            Object.prototype.hasOwnProperty.call(
                this.self.eventToPropertyMapping, name
            ) &&
            Tools.isFunction(this.self.eventToPropertyMapping[name])
        ) {
            const mapping:EventMapping<
                ExternalProperties, InternalProperties
            > = (
                this.self.eventToPropertyMapping[name] as
                    EventMapper<ExternalProperties, InternalProperties>
            )(...parameters, this)
            if (Array.isArray(mapping)) {
                result = mapping[0]
                this.reflectProperties(result)
                Tools.extend(true, this.internalProperties, mapping[1])
            } else if (mapping !== null && typeof mapping === 'object') {
                result = mapping
                this.reflectProperties(mapping)
            }
        } else if (
            parameters.length > 0 &&
            parameters[0] !== null &&
            typeof parameters[0] === 'object'
        ) {
            /*
                Identified as some how throw data back event (no synthetic
                event; derived from a user triggered one) when following
                condition does not hold.
            */
            let newProperties:ExternalProperties =
                parameters[0] as ExternalProperties
            if (
                'persist' in parameters[0]! &&
                Tools.isFunction(
                    (parameters[0] as {persist:() => void}).persist
                )
            ) {
                newProperties = {} as ExternalProperties
                for (const propertyName of Object.keys(this.self.propertyTypes))
                    for (const name of [propertyName].concat(
                        this.getPropertyAlias(propertyName) ?? []
                    )) {
                        const currentValue:unknown =
                            (
                                (parameters[0] as Event).currentTarget &&
                                Object.prototype.hasOwnProperty.call(
                                    (parameters[0] as
                                        {currentTarget:Mapping<unknown>}
                                    ).currentTarget,
                                    name
                                )
                            ) ?
                                /*
                                    Update all known properties from event
                                    target instance.
                                */
                                (parameters[0] as
                                    {currentTarget:Mapping<unknown>}
                                ).currentTarget[name] :
                                /*
                                    Update all known properties from adapter
                                    instance.
                                */
                                this.getPropertyValue(name)

                        if (currentValue !== this.externalProperties[name])
                            (newProperties as Mapping<unknown>)[name] =
                                currentValue
                    }
            } else if (![null, undefined].includes(
                (newProperties.detail as {value:null})?.value
            ))
                newProperties = {...newProperties.detail as ExternalProperties}

            result = newProperties
            this.reflectProperties(newProperties)
        }

        this.triggerRender('propertyReflected')

        this.batchUpdates = oldBatchUpdatesConfiguration

        return result
    }
    /**
     * Evaluates given property value depending on its type specification and
     * registers in properties mapping object.
     * @param attributeName - Name of given value.
     * @param value - Value to evaluate.
     *
     * @returns Nothing.
     */
    evaluateStringOrNullAndSetAsProperty(
        attributeName:string, value:null|string
    ):void {
        const preEvaluate:boolean = attributeName.startsWith('-')
        const effectiveAttributeName:string = preEvaluate ?
            attributeName.substring(1) :
            attributeName

        let name:string =
            Tools.stringDelimitedToCamelCase(effectiveAttributeName)
        const alias:null|string = this.getPropertyAlias(name)
        if (
            alias &&
            Object.prototype.hasOwnProperty.call(
                this.self.propertyTypes, alias
            )
        )
            name = alias

        if (Object.prototype.hasOwnProperty.call(
            this.self.propertyTypes, name
        )) {
            const type:PropertyConfiguration = this.self.propertyTypes[name]

            if (preEvaluate) {
                if (value) {
                    const result:EvaluationResult =
                        Tools.stringEvaluate(value, {Tools}, false, this)

                    if (result.error) {
                        console.warn(
                            `Faild to process pre-evaluation attribute "` +
                            `${attributeName}": ${result.error}. Will be set` +
                            ' to "undefined".'
                        )

                        this.setInternalPropertyValue(name, undefined)
                    } else {
                        this.setInternalPropertyValue(name, result.result)
                        this.setExternalPropertyValue(name, result.result)
                    }
                }
            } else
                switch (type) {
                case boolean:
                case 'boolean': {
                    const booleanValue = ![null, 'false'].includes(value)
                    this.setInternalPropertyValue(name, booleanValue)
                    this.setExternalPropertyValue(name, booleanValue)

                    break
                }
                case func:
                case 'function': {
                    let error:null|string = null
                    let templateFunction:TemplateFunction

                    const scopeNames:Array<string> = [
                        'data',
                        'event',
                        'firstArgument',
                        'firstParameter',
                        'options',
                        'scope',
                        'parameters',
                        'Tools'
                    ]

                    if (value) {
                        const result:CompilationResult =
                            Tools.stringCompile(value, scopeNames)
                        error = result.error
                        templateFunction = result.templateFunction

                        if (error)
                            console.warn(
                                'Failed to compile given handler "' +
                                `${attributeName}": ${error}.`
                            )
                    }

                    this.setInternalPropertyValue(
                        name,
                        (...parameters:Array<unknown>):unknown => {
                            if (this.outputEventNames.has(name))
                                this.reflectEventToProperties(
                                    name, parameters
                                )

                            let result:unknown = undefined
                            if (!error)
                                try {
                                    result = templateFunction.call(
                                        this,
                                        parameters[0],
                                        parameters[0],
                                        parameters[0],
                                        parameters[0],
                                        parameters[0],
                                        parameters[0],
                                        parameters,
                                        Tools
                                    )
                                } catch (error) {
                                    console.warn(
                                        'Failed to evaluate function "' +
                                        `${attributeName}" with expression "` +
                                        `${value!}" and scope variables "` +
                                        `${scopeNames.join('", "')}" set to ` +
                                        `"${Tools.represent(parameters)}": ` +
                                        `${error as string}. Set property ` +
                                        `to "undedefined".`
                                    )
                                }

                            if (!this.self.renderProperties.includes(name))
                                this.forwardEvent(name, parameters)

                            return result
                        }
                    )

                    if (!error)
                        this.setExternalPropertyValue(name, templateFunction!)

                    break
                }
                case 'json': {
                    if (value) {
                        let evaluated:PlainObject
                        try {
                            evaluated = JSON.parse(value) as PlainObject
                        } catch (error) {
                            console.warn(
                                'Error occurred during parsing given json ' +
                                `attribute "${attributeName}": ` +
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
                            name, Tools.copy(evaluated, 1)
                        )
                    } else {
                        this.setInternalPropertyValue(name, null)
                        this.setExternalPropertyValue(name, null)
                    }

                    break
                }
                case number:
                case 'number': {
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
                }
                case string:
                case 'string': {
                    this.setInternalPropertyValue(name, value)
                    this.setExternalPropertyValue(name, value)

                    break
                }
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
                default: {
                    if (value) {
                        const evaluated:EvaluationResult =
                            Tools.stringEvaluate(value, {}, false, this)
                        if (evaluated.error) {
                            console.warn(
                                'Error occurred during processing given ' +
                                `attribute configuration "${attributeName}":` +
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
                            name, Tools.copy(evaluated.result, 1)
                        )
                    } else if (this.hasAttribute(attributeName)) {
                        this.setInternalPropertyValue(name, true)
                        this.setExternalPropertyValue(name, true)
                    } else {
                        this.setInternalPropertyValue(name, null)
                        this.setExternalPropertyValue(name, null)
                    }

                    break
                }
                }
        }
    }
    /// endregion
    /// region render
    /**
     * Determines new scope object with useful default set of environment
     * values.
     * @param scope - To apply to generated scope.
     *
     * @returns Generated scope.
     */
    determineRenderScope(scope:Mapping<unknown> = {}):void {
        this.scope = {
            ...(this.parent?.scope || {}),
            ...this.scope,
            ...this.internalProperties,
            parent: this.parent,
            root: this.rootInstance,
            self: this,
            [Tools.stringLowerCase(this.self._name) || 'instance']: this,
            ...scope
        }
        this.scope.scope = this.scope
    }
    /**
     * Creates shadow root if not created yet and assigns to current root
     * property.
     * @returns Nothing.
     */
    applyShadowRootIfNotExisting():void {
        if (this.self.shadowDOM && this.root === this)
            this.root = (
                (!('attachShadow' in this) && 'ShadyDOM' in window) ?
                    (
                        window as unknown as
                            {ShadyDOM:{wrap:(_domNode:HTMLElement) =>
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
            )
    }
    /**
     * Method which does the rendering job. Should be called when ever state
     * changes should be projected to the hosts dom content.
     * @param reason - Description why rendering is necessary.
     *
     * @returns Nothing.
     */
    render(reason = 'unknown'):void {
        this.determineRenderScope()

        if (!this.dispatchEvent(new CustomEvent(
            'render', {detail: {reason, scope: this.scope}}
        )))
            return

        const evaluated:EvaluationResult = Tools.stringEvaluate(
            `\`${this.self.content as string}\``, this.scope
        )
        if (evaluated.error) {
            console.warn(`Faild to process template: ${evaluated.error}`)

            return
        }

        this.applyShadowRootIfNotExisting()

        /*
            NOTE: We first render into an intermediate render target and apply
            slot content until we finally publish everything to document. This
            avoid painting twice and internet explorer bugs with empty node
            after first overwriting content of "this.root".
        */
        const renderTargetDomNode:HTMLDivElement =
            document.createElement('div')
        renderTargetDomNode.innerHTML = evaluated.result

        this.applySlots(renderTargetDomNode, {...this.scope, parent: this})

        this.root.innerHTML = renderTargetDomNode.innerHTML

        this.applyBindings(
            this.root.firstChild, this.scope, this.self.renderSlots
        )
    }
    /// endregion
    // endregion
}
export const api:WebComponentAPI<
    HTMLElement, Mapping<unknown>, Mapping<unknown>, typeof Web
> = {
    component: Web,
    register: (
        tagName:string = Tools.stringCamelCaseToDelimited(Web._name)
    ):void => customElements.define(tagName, Web)
}
export default Web
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
