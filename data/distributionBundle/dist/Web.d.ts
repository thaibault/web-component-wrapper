import type { KnownEventName, KnownWindowEventMap, Mapping } from 'clientnode';
import type { AttributesReflectionConfiguration, CompiledDomNodeTemplateItem, CompilerOptions, ComponentAdapter, DomNodeToCompiledTemplateMap, EventCallbackMapping, EventToPropertyMapping, NormalizedAttributesReflectionConfiguration, PropertiesConfiguration, RenderState, ScopeDeclaration, WebComponentAPI } from './type';
import { Logger } from 'clientnode';
export declare const log: Logger;
/**
 * Derives a valid custom element tag name from given component name. Custom
 * element names have to contain a hyphen, so "web-" is prepended to names
 * without one.
 * @param name - Component name to derive tag name from.
 * @returns Determined tag name.
 */
export declare const determineTagName: (name: string) => string;
export declare const GenericHTMLElement: typeof HTMLElement;
/**
 * Generic web component to render a content against instance-specific values.
 * @property applyRootBinding - If determined itself as root declarative event
 * and property bindings will be applied to itself.
 * @property content - Content to render when changes happened.
 * @property determineRootBinding - If checked this component determines if it
 * is a root component (not wrapped by another web-component).
 * @property shadowDOM - Configures if a shadow dom should be used during
 * web-component instantiation. Can hold initialize configuration.
 * @property observedAttributes - Attribute names to observe for changes.
 * @property controllableProperties - A list of controllable property names.
 * @property eventToPropertyMapping - Explicitly defined output events (a
 * mapping of event names to a potential parameter to properties-transformer).
 * @property propertyAliases - A mapping of property names to be treated as
 * equal.
 * @property propertyTypes - Configuration defining how to convert attributes
 * into properties and reflect property changes back to attributes.
 * @property propertiesToReflectAsAttributes - An Item, List, or Mapping of
 * properties to reflect as attributes.
 * @property renderProperties - List of known render properties.
 * @property cloneSlots - Indicates whether to clone slot before to transclude
 * content into them. If a slot should be used multiple times (for example,
 * when it works as a template node.) they should be copied to avoid unexpected
 * mutations.
 * @property doRender - Configures whether this component instance should
 * evaluate its given body content.
 * @property evaluateSlots - Indicates whether to evaluate slot content when
 * before rendering them.
 * @property renderSlots - Indicates whether determined slots should be
 * rendered into root node.
 * @property trimSlots - Ignore empty text nodes while applying slots.
 * @property renderUnsafe - Defines default render behavior.
 * @property _name - Name to access instance-evaluated content or used
 * to derive default component name. This is also useful for logging.
 * @property _propertyAliasIndex - Internal alias index to quickly match
 * properties in both directions.
 * @property _propertiesToReflectAsAttributes - A mapping of property names to
 * set as attributes when they are set/updated. Uses a map to hold order and
 * determine if a property exists in constant runtime.
 * @property renderState - Holds data about currently running render state.
 * @property renderState.promise - Promise resolving when next rendering has
 * been finished.
 * @property renderState.pending - Indicates whether a rendering task is
 * performing.
 * @property renderState.resolve - Callback to trigger when rendering has been
 * finished.
 * @property childComponentInstances - List of direct child components (needed
 * to wait for them to finish dom manipulation).
 * @property batchAttributeUpdates - Indicates whether to directly update dom
 * after each attribute mutation or to wait and batch mutations after current
 * queue has been finished.
 * @property batchPropertyUpdates - Indicates whether to directly update dom
 * after each property mutation or to wait and batch mutations after current
 * queue has been finished.
 * @property batchUpdates - Indicates whether to directly perform a
 * re-rendering after changes on properties have been made.
 * @property batchedAttributeUpdateRunning - A boolean indicator to identify if
 * an attribute update is currently batched.
 * @property batchedPropertyUpdateRunning - A boolean indicator to identify if
 * a property update is currently batched.
 * @property batchedUpdateRunning - Indicates whether a batched render update
 * is currently running.
 * @param connectionRegistered - Indicates whether this component is connected
 * to DOM and could run its connectedCallback.
 * @param pendingAttributeUpdates - Holds pending attribute updates which
 * should be performed when the component is connected to DOM.
 * @property parentInstance - Parent component instance.
 * @property rootInstance - Root component instance.
 * @property scope - Render scope.
 * @property domNodeEventBindings - Holds a mapping from nodes with registered
 * event handlers mapped to their deregistration function.
 * @property domNodeTemplateCache - Caches template compilation results.
 * @property externalProperties - Holds currently evaluated or seen properties.
 * @property ignoreAttributeUpdateObservations - Indicates whether attribute
 * updates should be considered (usually only needed internally).
 * @property internalProperties - Holds currently evaluated properties which
 * are owned by this instance and should always be delegated.
 * @property outputEventNames - Set of determined output event names.
 * @property instance - Wrapped component instance.
 * @property isRoot - Indicates whether their exists another web-derived
 * component up the tree or not.
 * @property root - Hosting dom node.
 * @property runDomConnectionAndRenderingInSameEventQueue - Indicates whether
 * we should render initial dom immediately after the component is connected to
 * dom. Deactivating this allows wrapped components to detect their parents
 * since their parent-connected callback will be called before the children's
 * render method.
 * @property self - Back-reference to this class.
 * @property slots - Grabbed slots that where present in the connecting phase.
 */
export declare class Web<TElement = HTMLElement, ExternalProperties extends Mapping<unknown> = Mapping<unknown>, InternalProperties extends Mapping<unknown> = Mapping<unknown>> extends GenericHTMLElement {
    static applyRootBinding: boolean;
    static pendingRenderPromises: Array<Promise<string>>;
    static content: unknown;
    static determineRootBinding: boolean;
    static shadowDOM: (boolean | null | {
        delegateFocus?: boolean;
        mode: 'closed' | 'open';
    });
    static observedAttributes: Array<string>;
    static controllableProperties: Array<string>;
    static eventToPropertyMapping: EventToPropertyMapping | null;
    static propertyAliases: Mapping;
    static propertyTypes: PropertiesConfiguration;
    static propertiesToReflectAsAttributes: AttributesReflectionConfiguration;
    static renderProperties: Array<string>;
    static doRender: boolean;
    static cloneSlots: boolean;
    static evaluateSlots: boolean;
    static renderSlots: boolean;
    static trimSlots: boolean;
    static renderUnsafe: boolean;
    static _name: string;
    static _propertyAliasIndex?: Mapping;
    static _propertiesToReflectAsAttributes?: NormalizedAttributesReflectionConfiguration;
    renderState: RenderState;
    childComponentInstances: Array<Web> | undefined;
    batchAttributeUpdates: boolean;
    batchPropertyUpdates: boolean;
    batchUpdates: boolean;
    batchedAttributeUpdateRunning: boolean;
    batchedPropertyUpdateRunning: boolean;
    batchedUpdateRunning: boolean;
    connectionRegistered: boolean;
    pendingAttributeUpdates: Array<() => void>;
    parentInstance: null | Web;
    rootInstance: Web;
    hostDomNode: ShadowRoot | Web<TElement, ExternalProperties, InternalProperties>;
    scope: Mapping<unknown>;
    domNodeEventBindings: Map<Node | Window, EventCallbackMapping>;
    domNodeTemplateCache: DomNodeToCompiledTemplateMap;
    externalProperties: ExternalProperties;
    ignoreAttributeUpdateObservations: boolean;
    internalProperties: InternalProperties;
    outputEventNames: Set<string>;
    instance: null | {
        current?: ComponentAdapter;
    };
    isRoot: boolean;
    runDomConnectionAndRenderingInSameEventQueue: boolean;
    readonly self: typeof Web;
    slots: Mapping<HTMLElement | undefined> & {
        default?: Array<Node>;
    };
    /**
     * Initializes host dom content and properties.
     * @returns Nothing.
     */
    constructor();
    /**
     * Triggered when ever a given attribute has changed and triggers to update
     * configured dom content.
     * @param name - Attribute name which was updates.
     * @param oldValue - Old attribute value.
     * @param newValue - New updated value.
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    /**
     * Updates given attribute representation.
     * @param name - Attribute name which was updates.
     * @param newValue - New updated value.
     * @returns Promise resolving when attribute has been updated.
     */
    onUpdateAttribute(name: string, newValue: string): Promise<void>;
    /**
     * Triggered when this component is mounted into the document.
     * Attaches event handler, grabs given slots, reflects external properties,
     * and enqueues first rendering.
     */
    connectedCallback(): void;
    /**
     * Triggered when this component is unmounted from the document. Event
     * handlers will be removed and state updated accordingly.
     */
    disconnectedCallback(): void;
    /**
     * Registers needed getter and setter to get notified about changes and
     * reflect them.
     */
    defineGetterAndSetterInterface(): void;
    /**
     * Creates an index to match alias source and target against each other on
     * constant runtime.
     * @param name - Name to search an alternate name for.
     * @returns Found alias or "null".
     */
    getPropertyAlias(name: string): null | string;
    /**
     * Generic property getter. Forwards properties from the "properties"
     * field.
     * @param name - Property name to retrieve.
     * @returns Retrieved property value.
     */
    getPropertyValue(name: string): unknown;
    /**
     * External property setter. Respects configured aliases.
     * @param name - Property name to write.
     * @param value - New value to write.
     */
    setExternalPropertyValue(name: string, value: unknown): void;
    /**
     * Internal property setter. Respects configured aliases.
     * @param name - Property name to write.
     * @param value - New value to write.
     */
    setInternalPropertyValue(name: string, value: unknown): void;
    /**
     * Generic property setter. Forwards field writes into internal and
     * external property representations.
     * @param name - Property name to write.
     * @param value - New value to write.
     */
    setPropertyValue(name: string, value: unknown): void;
    /**
     * Triggers a new rendering cycle and respects property-specific state
     * connection.
     * @param name - Property name to write.
     * @param value - New value to write.
     */
    triggerPropertySpecificRendering(name: string, value: unknown): void;
    unregisterConnectionState(): void;
    unregisterDomNodeEventBindings(): void;
    /**
     * Binds properties and event handler to the given dom node.
     * @param domNode - Node to start traversing from.
     * @param scope - Scope to render property value again.
     * @param eventBindings - Indicates whether to bind event handler.
     * @param valueBindings - Indicates whether to bind attribute and property
     * values.
     */
    applyBinding(domNode: Node, scope: Mapping<unknown>, eventBindings?: boolean, valueBindings?: boolean): void;
    /**
     * Binds properties and event handler to given, sibling, and nested nodes.
     * @param domNode - Node to start traversing from.
     * @param scope - Scope to render property value again.
     * @param renderSlots - Indicates whether to render nested elements of
     * slots (determined by an existing corresponding attribute).
     * @param eventBindings - Indicates whether to bind event handler.
     * @param valueBindings - Indicates whether to bind attribute and property
     * values.
     */
    applyBindings(domNode: Node | null, scope: Mapping<unknown>, renderSlots?: boolean, eventBindings?: boolean, valueBindings?: boolean): void;
    /**
     * Compiles given node content and their children. Provides a corresponding
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
     * @param options.unsafe - Indicates if full HTML generation should be
     * allowed.
     * @returns Map of compiled templates.
     */
    compileDomNodeTemplate<NodeType extends Node = Node>(domNode: NodeType, scope?: ScopeDeclaration, options?: CompilerOptions): CompiledDomNodeTemplateItem | null;
    /**
     * @param options - Evaluation options.
     * @param scope - Scope to evaluate against.
     * @returns Evaluated string result or null.
     */
    evaluateCompiledDomNodeTemplate(options: CompiledDomNodeTemplateItem, scope: Mapping<unknown>): null | string;
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
     * @param options.domNodeTemplateCache - Yet compiled dom nodes to just
     * reference instead of recompiling.
     * @param options.unsafe - Indicates if full HTML generation should be
     * allowed.
     */
    evaluateDomNodeTemplate<NodeType extends Node = Node>(domNode: NodeType, scope?: Mapping<unknown>, options?: {
        applyBindings?: boolean;
        domNodeTemplateCache?: DomNodeToCompiledTemplateMap;
        filter?: (domNode: Node) => boolean;
        ignoreComponents?: boolean;
        ignoreNestedComponents?: boolean;
        unsafe?: boolean;
    }): void;
    /**
     * Adds an event listener to the given dom node so that it will be
     * deregistered when the component instance is destroyed.
     * @param domNode - Node to assign event handler to.
     * @param name - Event name.
     * @param handler - Callback to trigger when given event occurs.
     * @param options - Add event listener options.
     * @param removeOptions - Remove event listener options.
     * @returns Deregister function.
     */
    addSecureEventListener<EventName extends KnownEventName>(domNode: Node | Window, name: EventName, handler: (this: Window, event: KnownWindowEventMap[EventName]) => void, options?: boolean | AddEventListenerOptions, removeOptions?: EventListenerOptions): () => void;
    /**
     * Determines initial root which initializes rendering digest.
     */
    determineRootBinding(): void;
    /**
     * Checks if given content hast code (to compile and render).
     * @param content - Potential string with code inside.
     * @returns A boolean indicating whether given content has code.
     */
    static hasCode(content: unknown): boolean;
    /**
     * Converts given the list, item, or map to a map (with ordering).
     * @param value - Attribute reflection configuration.
     * @returns Generated map.
     */
    static normalizePropertyTypeList(value: AttributesReflectionConfiguration): NormalizedAttributesReflectionConfiguration;
    /**
     * Attaches event handler to keep in sync with nested components properties
     * states.
     */
    attachEventHandler(): void;
    /**
     * Attach explicitly defined event handler to synchronize internal and
     * external property states.
     * @returns Returns "true" if there are some defined and "false" otherwise.
     */
    attachExplicitDefinedOutputEventHandler(): boolean;
    /**
     * Attach implicitly defined event handler to synchronize internal and
     * external property states.
     * @param reflectProperties - Indicates whether implicitly determined
     * properties should be reflected.
     */
    attachImplicitDefinedOutputEventHandler(reflectProperties?: boolean): void;
    /**
     * Triggers all identified events to communicate internal property / state
     * changes.
     */
    triggerOutputEvents(): void;
    /**
     * Forwards given event as the native web event.
     * @param name - Event name.
     * @param parameters - Event parameters.
     * @returns False if event is cancelable, and at least one of the event
     * handlers which received event called "Event.preventDefault()",
     * otherwise true will be returned.
     */
    forwardEvent(name: string, parameters: Array<unknown>): boolean;
    /**
     * Renders component given slot contents into the given dom node. If
     * expected slots are not given but a fallback is specified, they will be
     * loaded into internal slot mapping.
     * @param targetDomNode - Target dom node to render slots into.
     * @param scope - Environment to render slots again if specified.
     */
    applySlots(targetDomNode: HTMLElement, scope: Mapping<unknown>): void;
    /**
     * Determines slot content from the given node.
     * @param slot - Node to grab slot content from.
     * @returns Determined slot.
     */
    grabSlotContent(slot: Node): Node;
    /**
     * Saves given slots.
     */
    grabGivenSlots(): void;
    /**
     * Determines if a given property name exists in wrapped component state.
     * @param name - Property name to check if exists in state.
     * @returns Boolean result.
     */
    isStateProperty(name: string): boolean;
    /**
     * Generates an alias to name and the other way around mapping if not
     * exists.
     */
    generateAliasIndex(): void;
    /**
     * Reflects wrapped component state back to web-component's attributes.
     * @param properties - Properties to update in reflected attribute state.
     */
    reflectExternalProperties(properties: Partial<ExternalProperties>): void;
    /**
     * Reflects wrapped component state back to web-component's attributes and
     * properties.
     * @param properties - Properties to update in reflected property state.
     */
    reflectProperties(properties: Partial<ExternalProperties>): void;
    /**
     * Reflect the given event handler call with the given parameter back to
     * current properties state.
     * @param name - Event name.
     * @param parameters - List of parameter to given event handler call.
     * @returns Mapped properties or null if nothing could be mapped.
     */
    reflectEventToProperties(name: string, parameters: Array<unknown>): Promise<Partial<ExternalProperties> | null>;
    /**
     * Evaluates the given property value depending on its property definition
     * and registers in a property mapping object.
     * @param attributeName - Name of given value.
     * @param value - Value to evaluate.
     */
    evaluateStringOrNullAndSetAsProperty(attributeName: string, value: null | string): void;
    /**
     * Produces a promise resolving when all nested rendering promises have
     * been resolved. This only waits for registered nested components. That
     * means that nested components which where connected before the parent
     * component got initialized will not be waited for. That might happen
     * when nested component types got registered before the parent ones.
     */
    waitForNestedComponentRendering(): Promise<void>;
    /**
     * Resolves the rendering promise.
     * @param reason - Rendering reason description.
     * @param resolveRendering - Indicates whether to resolve the rendering or
     * just return a resolving promise directly.
     * @returns A promise resolving when all nested render promises have been
     * resolved.
     */
    resolveRenderingPromiseIfSet(reason: string, resolveRendering: boolean): Promise<void>;
    /**
     * Sets up a new rendering cycle representing promise.
     */
    prepareNewRenderingPromise(): void;
    /**
     * Triggers a new rendering cycle by respecting batch configuration.
     * @param reason - A description why rendering should be triggered.
     */
    triggerRender(reason: string): void;
    /**
     * Creates shadow root if not created yet and assigns to the current root
     * property.
     */
    applyShadowRootIfNotExisting(): void;
    /**
     * Determines a new scope object with a useful default set of environment
     * values.
     * @param scope - To apply to generated scope.
     */
    determineRenderScope(scope?: Mapping<unknown>): void;
    /**
     * Does the rendering job. Should be called when ever state changes should
     * be projected to the hosts dom content.
     * @param reason - Description why rendering is necessary.
     * @param resolveRendering - Indicates whether rendering should be resolved
     * finally. Should be set to "false" via super calls in inherited render
     * methods which do further dom manipulations afterward and resolve the
     * rendering process by their own.
     * @returns A promise resolving when rendering has been finished. A promise
     * may be needed for classes inheriting from this class.
     */
    render(reason?: string, resolveRendering?: boolean): Promise<void>;
    /**
     * Should free up memory listeners related to deprecated HTML.
     * @param _reason - Description why rendering is necessary.
     * @param _reRenderReason - Description why a re-rendering is necessary.
     */
    unRender(_reason?: string, _reRenderReason?: string): void;
}
export declare const api: WebComponentAPI<HTMLElement, Mapping<unknown>, Mapping<unknown>, typeof Web>;
export default Web;
