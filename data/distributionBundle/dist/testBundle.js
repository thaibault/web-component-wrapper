#!/usr/bin/env node
// -*- coding: utf-8 -*-
import "core-js/modules/es.map.get-or-insert.js";
import "core-js/modules/es.map.get-or-insert-computed.js";
import { Logger as __WEBPACK_EXTERNAL_MODULE_clientnode_Logger__, NOOP as __WEBPACK_EXTERNAL_MODULE_clientnode_NOOP__, UTILITY_SCOPE as __WEBPACK_EXTERNAL_MODULE_clientnode_UTILITY_SCOPE__, UTILITY_SCOPE_NAMES as __WEBPACK_EXTERNAL_MODULE_clientnode_UTILITY_SCOPE_NAMES__, camelCaseToDelimited as __WEBPACK_EXTERNAL_MODULE_clientnode_camelCaseToDelimited__, compile as __WEBPACK_EXTERNAL_MODULE_clientnode_compile__, convertPlainObjectToMap as __WEBPACK_EXTERNAL_MODULE_clientnode_convertPlainObjectToMap__, copy as __WEBPACK_EXTERNAL_MODULE_clientnode_copy__, delimitedToCamelCase as __WEBPACK_EXTERNAL_MODULE_clientnode_delimitedToCamelCase__, evaluate as __WEBPACK_EXTERNAL_MODULE_clientnode_evaluate__, extend as __WEBPACK_EXTERNAL_MODULE_clientnode_extend__, isFunction as __WEBPACK_EXTERNAL_MODULE_clientnode_isFunction__, isObject as __WEBPACK_EXTERNAL_MODULE_clientnode_isObject__, lowerCase as __WEBPACK_EXTERNAL_MODULE_clientnode_lowerCase__, replace as __WEBPACK_EXTERNAL_MODULE_clientnode_replace__, represent as __WEBPACK_EXTERNAL_MODULE_clientnode_represent__, timeout as __WEBPACK_EXTERNAL_MODULE_clientnode_timeout__, unique as __WEBPACK_EXTERNAL_MODULE_clientnode_unique__, unwrap as __WEBPACK_EXTERNAL_MODULE_clientnode_unwrap__ } from "clientnode";
import { NullSymbol as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_NullSymbol__, UndefinedSymbol as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_UndefinedSymbol__, any as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_any__, array as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_array__, arrayOf as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_arrayOf__, boolean as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__, element as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_element__, elementType as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_elementType__, exact as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_exact__, func as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_func__, instanceOf as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_instanceOf__, node as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_node__, number as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__, object as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_object__, objectOf as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_objectOf__, oneOf as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_oneOf__, oneOfType as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_oneOfType__, shape as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_shape__, string as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__, symbol as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_symbol__ } from "clientnode/property-types";
import { Fragment as __WEBPACK_EXTERNAL_MODULE_react_Fragment__, createElement as __WEBPACK_EXTERNAL_MODULE_react_createElement__, createRef as __WEBPACK_EXTERNAL_MODULE_react_createRef__, default as __WEBPACK_EXTERNAL_MODULE_react_default__, forwardRef as __WEBPACK_EXTERNAL_MODULE_react_forwardRef__, memo as __WEBPACK_EXTERNAL_MODULE_react_memo__, useImperativeHandle as __WEBPACK_EXTERNAL_MODULE_react_useImperativeHandle__ } from "react";
import { afterEach as __WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_afterEach__, describe as __WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_describe__, expect as __WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__, jest as __WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_jest__, test as __WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__ } from "@jest/globals";
import "core-js/modules/es.array.push.js";
import "core-js/modules/es.iterator.constructor.js";
import "core-js/modules/es.iterator.map.js";
import "core-js/modules/es.iterator.filter.js";
import { flushSync as __WEBPACK_EXTERNAL_MODULE_react_dom_c0b5c364_flushSync__ } from "react-dom";
import { createRoot as __WEBPACK_EXTERNAL_MODULE_react_dom_client_82ef521c_createRoot__ } from "react-dom/client";
import "core-js/modules/es.iterator.for-each.js";
import "core-js/modules/es.iterator.reduce.js";
import "core-js/modules/es.json.parse.js";
import "core-js/modules/es.json.stringify.js";
import "core-js/modules/es.set.difference.v2.js";
import "core-js/modules/es.set.intersection.v2.js";
import "core-js/modules/es.set.is-disjoint-from.v2.js";
import "core-js/modules/es.set.is-subset-of.v2.js";
import "core-js/modules/es.set.is-superset-of.v2.js";
import "core-js/modules/es.set.symmetric-difference.v2.js";
import "core-js/modules/es.set.union.v2.js";

;// external "core-js/modules/es.map.get-or-insert.js"

;// external "core-js/modules/es.map.get-or-insert-computed.js"

;// external "clientnode"

;// external "clientnode/property-types"

;// external "react"

;// external "@jest/globals"

;// external "core-js/modules/es.array.push.js"

;// ./src/decorator.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module decorator *//* !
    region header
    [Project page](https://tsickert.com/web-component-wrapper)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
    endregion
*/// region imports
// endregion
/*
    NOTE: Every class owns these members, so they do not indicate an existing
    static configuration.
*/const INTRINSIC_CLASS_MEMBER_NAMES=["length","name","prototype"];/**
 * Checks if given class defines an own static member with given name.
 * @param self - Class to check.
 * @param name - Member name to check.
 * @returns A boolean indicating whether given member exists.
 */const hasOwnStaticMember=(self,name)=>Object.prototype.hasOwnProperty.call(self,name)&&!INTRINSIC_CLASS_MEMBER_NAMES.includes(name);/**
 * Generates a decorator based on given configuration.
 * @param options - Property configuration to define how to transfer attributes
 * and properties into each other.
 * @param options.alias - Alternate property name.
 * @param options.readAttribute - Indicates whether to read from existing
 * attribute also.
 * @param options.type - Value type to parse value.
 * @param options.update - Indicates whether to overwrite already existing
 * property configurations.
 * @param options.writeAttribute - Indicates whether to sync attribute
 * representation back into dom.
 * @returns Generated decorator.
 */function property(options={}){options={readAttribute:true,type:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__,...options};/**
     * Registers given property to different property / attribute conversion
     * data structures.
     * NOTE: It is important to set static configuration properties on its
     * "own" properties instead of some inherited one. So we have to check via
     * "hasOwnProperty" for existence in this decorator.
     * @param target - Instance to apply given property to.
     * @param name - Field name to apply.
     */return function(target,name){if(typeof name!=="string")return;const self=target.self||target.constructor;if(options.readAttribute){if(!Object.prototype.hasOwnProperty.call(self,"observedAttributes"))self.observedAttributes=self.observedAttributes?[...self.observedAttributes]:[];const attributeName=__WEBPACK_EXTERNAL_MODULE_clientnode_camelCaseToDelimited__(name);if(self.observedAttributes&&!self.observedAttributes.includes(attributeName))self.observedAttributes.push(attributeName)}if(options.type){if(!Object.prototype.hasOwnProperty.call(self,"propertyTypes"))self.propertyTypes=self.propertyTypes?{...self.propertyTypes}:{};if(self.propertyTypes&&(options.update||!hasOwnStaticMember(self,name)))self.propertyTypes[name]=options.type}if(options.writeAttribute){if(!Object.prototype.hasOwnProperty.call(self,"propertiesToReflectAsAttributes"))self.propertiesToReflectAsAttributes=self.propertiesToReflectAsAttributes?__WEBPACK_EXTERNAL_MODULE_clientnode_copy__(self.propertiesToReflectAsAttributes):[];const reflectionConfiguration=self.propertiesToReflectAsAttributes;if(options.update||(reflectionConfiguration instanceof Map?!reflectionConfiguration.has(name):Array.isArray(reflectionConfiguration)?!reflectionConfiguration.includes(name):typeof reflectionConfiguration==="object"&&!Object.prototype.hasOwnProperty.call(reflectionConfiguration,name))){let result;if(typeof options.writeAttribute==="boolean"){if(options.writeAttribute&&self.propertyTypes&&Object.prototype.hasOwnProperty.call(self.propertyTypes,name))result=self.propertyTypes[name]}else result=options.writeAttribute;if(result!==undefined){if(Array.isArray(self.propertiesToReflectAsAttributes))if(options.writeAttribute===true){if(!self.propertiesToReflectAsAttributes.includes(name))self.propertiesToReflectAsAttributes.push(name)}else if(self.normalizePropertyTypeList)self.propertiesToReflectAsAttributes=self.normalizePropertyTypeList(self.propertiesToReflectAsAttributes);if(self.propertiesToReflectAsAttributes instanceof Map)self.propertiesToReflectAsAttributes.set(name,result);else if(!Array.isArray(self.propertiesToReflectAsAttributes)&&typeof self.propertiesToReflectAsAttributes==="object")self.propertiesToReflectAsAttributes[name]=result}}}if(options.alias){if(!Object.prototype.hasOwnProperty.call(self,"propertyAliases"))self.propertyAliases=self.propertyAliases?{...self.propertyAliases}:{};if(self.propertyAliases&&(options.update||!hasOwnStaticMember(self,name)))self.propertyAliases[name]=options.alias}}}/* harmony default export */ const decorator = (property);
;// external "core-js/modules/es.iterator.constructor.js"

;// external "core-js/modules/es.iterator.map.js"

;// external "core-js/modules/es.iterator.filter.js"

;// external "react-dom"

;// external "react-dom/client"

;// external "core-js/modules/es.iterator.for-each.js"

;// external "core-js/modules/es.iterator.reduce.js"

;// external "core-js/modules/es.json.parse.js"

;// external "core-js/modules/es.json.stringify.js"

;// external "core-js/modules/es.set.difference.v2.js"

;// external "core-js/modules/es.set.intersection.v2.js"

;// external "core-js/modules/es.set.is-disjoint-from.v2.js"

;// external "core-js/modules/es.set.is-subset-of.v2.js"

;// external "core-js/modules/es.set.is-superset-of.v2.js"

;// external "core-js/modules/es.set.symmetric-difference.v2.js"

;// external "core-js/modules/es.set.union.v2.js"

;// ./src/Web.ts
/* unused harmony import specifier */ var camelCaseToDelimited;
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module web *//* !
    region header
    [Project page](https://tsickert.com/web-component-wrapper)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
    endregion
*/// region imports
var _dec,_class,_descriptor,_Web;function _initializerDefineProperty(e,i,r,l){r&&Object.defineProperty(e,i,{enumerable:r.enumerable,configurable:r.configurable,writable:r.writable,value:r.initializer?r.initializer.call(l):void 0})};function _defineProperty(r,t,o){return(t=_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function _toPropertyKey(r){var o=_toPrimitive(r,"string");return"symbol"==typeof o?o:o+""}function _toPrimitive(t,e){if("object"!=typeof t||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}function _applyDecoratedDescriptor(i,e,r,n,l){var a={};return Object.keys(n).forEach(function(i){a[i]=n[i]}),a.enumerable=!!a.enumerable,a.configurable=!!a.configurable,("value"in a||a.initializer)&&(a.writable=!0),a=r.slice().reverse().reduce(function(r,n){return n(i,e,r)||r},a),l&&void 0!==a.initializer&&(a.value=a.initializer?a.initializer.call(l):void 0,a.initializer=void 0),void 0===a.initializer?(Object.defineProperty(i,e,a),null):a}function _initializerWarningHelper(r,e){throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform.")};// endregion
const log=new __WEBPACK_EXTERNAL_MODULE_clientnode_Logger__({name:"web-component-wrapper.web"});/*
    NOTE: We mock HTMLElement to be able to load this class and derived one
    into node environments.
*/const GenericHTMLElement=typeof HTMLElement==="undefined"?// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class HTMLElement{}:HTMLElement;/**
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
 */let Web=(_dec=decorator({type:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__,writeAttribute:true}),_class=(_Web=class Web extends GenericHTMLElement{// endregion
// region live cycle hooks
/**
     * Initializes host dom content and properties.
     * @returns Nothing.
     */constructor(){super();_defineProperty(this,"renderState",{promise:Promise.resolve(""),pending:false,resolve:__WEBPACK_EXTERNAL_MODULE_clientnode_NOOP__});// Constructor might be executed when accessed via child components.
_defineProperty(this,"childComponentInstances",[]);_defineProperty(this,"batchAttributeUpdates",true);_defineProperty(this,"batchPropertyUpdates",true);_defineProperty(this,"batchUpdates",true);/*
        NOTE: We set these properties to true initially since we want to
        prevent any updates until the component is connected to dom.
    */_defineProperty(this,"batchedAttributeUpdateRunning",true);_defineProperty(this,"batchedPropertyUpdateRunning",true);_defineProperty(this,"batchedUpdateRunning",true);_defineProperty(this,"connectionRegistered",false);_defineProperty(this,"pendingAttributeUpdates",[]);_defineProperty(this,"parentInstance",null);_defineProperty(this,"rootInstance",void 0);_defineProperty(this,"hostDomNode",void 0);_defineProperty(this,"scope",{...__WEBPACK_EXTERNAL_MODULE_clientnode_UTILITY_SCOPE__});_defineProperty(this,"domNodeEventBindings",new Map);_defineProperty(this,"domNodeTemplateCache",new Map);_defineProperty(this,"externalProperties",{});_defineProperty(this,"ignoreAttributeUpdateObservations",false);_defineProperty(this,"internalProperties",{});_defineProperty(this,"outputEventNames",new Set);_defineProperty(this,"instance",null);_initializerDefineProperty(this,"isRoot",_descriptor,this);_defineProperty(this,"runDomConnectionAndRenderingInSameEventQueue",false);_defineProperty(this,"self",Web);_defineProperty(this,"slots",{});this.prepareNewRenderingPromise();/*
            NOTE: We cannot use something like "this." e.g. "this.self" to
            determine class properties since instance properties like "self"
            may not set properly yet because this method is called during
            constructing this instance itself.
        */this.self=this.constructor;if(!this.self._propertiesToReflectAsAttributes)this.self._propertiesToReflectAsAttributes=this.self.normalizePropertyTypeList(this.self.propertiesToReflectAsAttributes);this.generateAliasIndex();// NOTE: Shadow root will be applied when rendering the first time.
this.hostDomNode=this;this.rootInstance=this;/*
            NOTE: We define getter and setter at the end to avoid shadowing
            existing property names.
        */this.defineGetterAndSetterInterface()}/**
     * Triggered when ever a given attribute has changed and triggers to update
     * configured dom content.
     * @param name - Attribute name which was updates.
     * @param oldValue - Old attribute value.
     * @param newValue - New updated value.
     */attributeChangedCallback(name,oldValue,newValue){if(this.ignoreAttributeUpdateObservations||oldValue===newValue)return;void this.onUpdateAttribute(name,newValue)}/**
     * Updates given attribute representation.
     * @param name - Attribute name which was updates.
     * @param newValue - New updated value.
     * @returns Promise resolving when attribute has been updated.
     */onUpdateAttribute(name,newValue){const promise=new Promise(resolve=>this.pendingAttributeUpdates.push(()=>{this.evaluateStringOrNullAndSetAsProperty(name,newValue);if(this.batchAttributeUpdates){if(!(this.batchedAttributeUpdateRunning||this.batchedUpdateRunning)){this.batchedAttributeUpdateRunning=true;this.batchedUpdateRunning=true;void __WEBPACK_EXTERNAL_MODULE_clientnode_timeout__(()=>{this.batchedAttributeUpdateRunning=false;this.batchedUpdateRunning=false;void this.render("attributeChanged")})}}else void this.render("attributeChanged");resolve()}));if(this.connectionRegistered)while(this.pendingAttributeUpdates.length)this.pendingAttributeUpdates.shift()();return promise}/**
     * Triggered when this component is mounted into the document.
     * Attaches event handler, grabs given slots, reflects external properties,
     * and enqueues first rendering.
     */connectedCallback(){// NOTE: Hack to support IE 11 here.
try{this.isConnected=true}catch{// Ignore error.
}this.connectionRegistered=true;// NOTE: Can be overwritten during optional root determining.
this.parentInstance=this;this.rootInstance=this;this.attachEventHandler();if(this.self.determineRootBinding){this.determineRootBinding();if(this.parentInstance!==this&&this.parentInstance.childComponentInstances)this.parentInstance.childComponentInstances.push(this)}if(this.self.applyRootBinding&&this.isRoot){this.determineRenderScope();this.applyBinding(this,this.scope)}while(this.pendingAttributeUpdates.length)this.pendingAttributeUpdates.shift()();this.batchedAttributeUpdateRunning=false;this.batchedPropertyUpdateRunning=false;this.batchedUpdateRunning=false;this.grabGivenSlots();this.reflectExternalProperties(this.externalProperties);if(this.runDomConnectionAndRenderingInSameEventQueue)void this.render("connected");else void __WEBPACK_EXTERNAL_MODULE_clientnode_timeout__(()=>{void this.render("connected")})}/**
     * Triggered when this component is unmounted from the document. Event
     * handlers will be removed and state updated accordingly.
     */disconnectedCallback(){this.unRender("disconnected");this.unregisterConnectionState()}// endregion
// region getter/setter
/**
     * Registers needed getter and setter to get notified about changes and
     * reflect them.
     */defineGetterAndSetterInterface(){const allPropertyNames=__WEBPACK_EXTERNAL_MODULE_clientnode_unique__(Object.keys(this.self.propertyTypes).concat(this.self._propertyAliasIndex?Object.keys(this.self._propertyAliasIndex):[]));for(const propertyName of allPropertyNames){// If there already exists a local value, use them.
if(Object.prototype.hasOwnProperty.call(this,propertyName))this.setPropertyValue(/* eslint-disable @typescript-eslint/unbound-method */propertyName,this[propertyName]/* eslint-enable @typescript-eslint/unbound-method */);Object.defineProperty(this,propertyName,{configurable:true,get:()=>this.getPropertyValue(propertyName),set:value=>{this.setPropertyValue(propertyName,value);this.triggerPropertySpecificRendering(propertyName,value)}})}}/**
     * Creates an index to match alias source and target against each other on
     * constant runtime.
     * @param name - Name to search an alternate name for.
     * @returns Found alias or "null".
     */getPropertyAlias(name){if(this.self._propertyAliasIndex&&Object.prototype.hasOwnProperty.call(this.self._propertyAliasIndex,name))return this.self._propertyAliasIndex[name];return null}/**
     * Generic property getter. Forwards properties from the "properties"
     * field.
     * @param name - Property name to retrieve.
     * @returns Retrieved property value.
     */getPropertyValue(name){const result=this.instance?.current?.properties&&(// NOTE: Base properties should not be shadowed.
!Object.prototype.hasOwnProperty.call(Web.propertyTypes,name)||Object.prototype.hasOwnProperty.call(this.instance.current.properties,name))?this.instance.current.properties[name]:this.internalProperties[name]??this.externalProperties[name];if(this.instance?.current?.state&&Object.prototype.hasOwnProperty.call(this.instance.current.state,name))return this.instance.current.state[name];return result}/**
     * External property setter. Respects configured aliases.
     * @param name - Property name to write.
     * @param value - New value to write.
     */setExternalPropertyValue(name,value){this.externalProperties[name]=value;const alias=this.getPropertyAlias(name);if(alias)this.externalProperties[alias]=value}/**
     * Internal property setter. Respects configured aliases.
     * @param name - Property name to write.
     * @param value - New value to write.
     */setInternalPropertyValue(name,value){this.internalProperties[name]=value;const alias=this.getPropertyAlias(name);if(alias)this.internalProperties[alias]=value}/**
     * Generic property setter. Forwards field writes into internal and
     * external property representations.
     * @param name - Property name to write.
     * @param value - New value to write.
     */setPropertyValue(name,value){this.reflectProperties({[name]:value});this.setInternalPropertyValue(name,value)}/**
     * Triggers a new rendering cycle and respects property-specific state
     * connection.
     * @param name - Property name to write.
     * @param value - New value to write.
     */triggerPropertySpecificRendering(name,value){if(this.batchPropertyUpdates){if(!(this.batchedPropertyUpdateRunning||this.batchedUpdateRunning)){this.batchedPropertyUpdateRunning=true;this.batchedUpdateRunning=true;void __WEBPACK_EXTERNAL_MODULE_clientnode_timeout__(()=>{if(value!==undefined&&this.isStateProperty(name)){void this.render("preStatePropertyChanged");void __WEBPACK_EXTERNAL_MODULE_clientnode_timeout__(()=>{this.setInternalPropertyValue(name,undefined);this.batchedPropertyUpdateRunning=false;this.batchedUpdateRunning=false;void this.render("postStatePropertyChanged");this.triggerOutputEvents()})}else{this.batchedPropertyUpdateRunning=false;this.batchedUpdateRunning=false;void this.render("propertyChanged");this.triggerOutputEvents()}})}}else{const isStateProperty=this.isStateProperty(name);void this.render(isStateProperty?"preStatePropertyChanged":"propertyChanged");if(value!==undefined&&isStateProperty){this.setInternalPropertyValue(name,undefined);void this.render("postStatePropertyChanged")}this.triggerOutputEvents()}}// endregion
// region helper
/// region utility
unregisterConnectionState(){// NOTE: Hack to support IE 11 here.
try{this.isConnected=false}catch{// Ignore error.
}this.connectionRegistered=false;this.slots={}}unregisterDomNodeEventBindings(){for(const map of this.domNodeEventBindings.values())for(const deregister of map.values())deregister()}//// region dom nodes
/**
     * Binds properties and event handler to the given dom node.
     * @param domNode - Node to start traversing from.
     * @param scope - Scope to render property value again.
     * @param eventBindings - Indicates whether to bind event handler.
     * @param valueBindings - Indicates whether to bind attribute and property
     * values.
     */applyBinding(domNode,scope,eventBindings=true,valueBindings=true){if(!domNode.getAttributeNames)return;for(const attributeName of domNode.getAttributeNames()){let name;if(attributeName.startsWith("data-bind-"))name=attributeName.substring("data-bind-".length);else if(attributeName.startsWith("bind-"))name=attributeName.substring("bind-".length);if(name){const value=domNode.getAttribute(attributeName);if(value===null)continue;if(valueBindings&&(name.startsWith("attribute-")||name.startsWith("property-"))){const evaluated=__WEBPACK_EXTERNAL_MODULE_clientnode_evaluate__(value,{scope,binding:domNode});if(evaluated.error){void log.warn("Error occurred during processing given",`attribute binding "${attributeName}" on node:`,domNode,evaluated.error);continue}if(name.startsWith("attribute-"))domNode.setAttribute(name.substring("attribute-".length),evaluated.result);else/*
                            NOTE: Cast to "textContent" to have a writable
                            property here.
                        */domNode[__WEBPACK_EXTERNAL_MODULE_clientnode_delimitedToCamelCase__(name.substring("property-".length))]=evaluated.result}else if(eventBindings&&name.startsWith("on-")){name=__WEBPACK_EXTERNAL_MODULE_clientnode_delimitedToCamelCase__(name.substring("on-".length));scope={log,event:undefined,parameters:undefined,...scope};/*
                        NOTE: We pre-compile event listener since they should
                        usually be called more often than binded.
                    */const compilation=__WEBPACK_EXTERNAL_MODULE_clientnode_compile__(value,{scope,execute:true,binding:domNode});if(compilation.error)void log.warn("Error occurred during compiling given event",`binding "${attributeName}" on node:`,domNode,compilation.error);else this.addSecureEventListener(domNode,name,(...parameters)=>{scope.event=parameters[0];scope.parameters=parameters;try{compilation.templateFunction(/*
                                            NOTE: We want to be sure to have
                                            the same ordering as we have for
                                            the scope names and to call
                                            internal registered getter by
                                            retrieving values. So simple using
                                            "...Object.values(scope)" is not
                                            appreciate here.
                                        */...compilation.originalScopeNames.map(name=>scope[name]))}catch(error){void log.warn("Error occurred during processing","given event binding",`"${attributeName}" on node:`,domNode,`Given expression "${value}" could`,"not be evaluated with given scope","names \""+compilation.scopeNames.join("\", \"")+`": ${__WEBPACK_EXTERNAL_MODULE_clientnode_represent__(error)}`)}})}}}}/**
     * Binds properties and event handler to given, sibling, and nested nodes.
     * @param domNode - Node to start traversing from.
     * @param scope - Scope to render property value again.
     * @param renderSlots - Indicates whether to render nested elements of
     * slots (determined by an existing corresponding attribute).
     * @param eventBindings - Indicates whether to bind event handler.
     * @param valueBindings - Indicates whether to bind attribute and property
     * values.
     */applyBindings(domNode,scope,renderSlots=true,eventBindings=true,valueBindings=true){while(domNode){if(domNode.attributes?.length&&(renderSlots||!domNode.getAttribute("slot")))this.applyBinding(domNode,scope,eventBindings,valueBindings);/*
                NOTE: Slots of nested custom components (recognized by their
                dash in name) should be rendered by their own.
            */if(!domNode.nodeName.toLowerCase().includes("-"))this.applyBindings(domNode.firstChild,scope,true,eventBindings,valueBindings);domNode=domNode.nextSibling}}/**
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
     */compileDomNodeTemplate(domNode,scope=[],options={}){options={ignoreComponents:true,ignoreNestedComponents:true,unsafe:this.self.renderUnsafe,...options};const nodeName=domNode.nodeName.toLowerCase();/*
            NOTE: Slots of nested custom components (recognized by their dash
            in name) should be rendered / controlled by them on their own.
        */if(options.ignoreComponents&&nodeName.includes("-"))return null;if(options.unsafe){let template=domNode.innerHTML;if(!template&&domNode.template)template=domNode.template;if(this.self.hasCode(template)){const result=__WEBPACK_EXTERNAL_MODULE_clientnode_compile__(`\`${template}\``,{scope});return{domNode,children:[],error:result.error,scopeNames:result.scopeNames,template,templateFunction:result.templateFunction}}return null}let template=null;if(nodeName==="#text"){const content=domNode.textContent;if(content&&this.self.hasCode(content))template=content.replace(/&nbsp;/g," ").trim()}const children=[];const result={children,domNode};if(template){const compilationResult=__WEBPACK_EXTERNAL_MODULE_clientnode_compile__(`\`${template}\``,{scope});result.error=compilationResult.error;result.scopeNames=compilationResult.scopeNames;result.template=template;result.templateFunction=compilationResult.templateFunction}// Compile content of each nested node.
let currentDomNode=domNode.firstChild;while(currentDomNode){if(!options.filter||options.filter(currentDomNode)){const result=this.compileDomNodeTemplate(currentDomNode,scope,{...options,ignoreComponents:options.ignoreNestedComponents});if(result)children.push(result)}currentDomNode=currentDomNode.nextSibling}return result}/**
     * @param options - Evaluation options.
     * @param scope - Scope to evaluate against.
     * @returns Evaluated string result or null.
     */evaluateCompiledDomNodeTemplate(options,scope){const{domNode,error,templateFunction,scopeNames}=options;if(!(templateFunction&&scopeNames))return null;if(error){void log.warn("Error occurred during compiling node content:",error);return null}let output=null;try{output=templateFunction(...scopeNames.map(name=>scope[name]))}catch(error){void log.warn(`Error occurred when "${this.self._name}" is  running`,`"${String(templateFunction)}": with bound`,`names "${scopeNames.join("\", \"")}":`,`"${error}". Rendering node:`,domNode)}return output}/**
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
     */evaluateDomNodeTemplate(domNode,scope={},options={}){options={domNodeTemplateCache:this.domNodeTemplateCache,ignoreComponents:true,ignoreNestedComponents:true,unsafe:this.self.renderUnsafe,...options};const domNodeTemplateCache=options.domNodeTemplateCache;if(!domNodeTemplateCache.has(domNode)){const compilerOptions={filter:options.filter,ignoreComponents:options.ignoreComponents,ignoreNestedComponents:options.ignoreNestedComponents,unsafe:options.unsafe};const compiledDomNode=this.compileDomNodeTemplate(domNode,scope,compilerOptions);if(compiledDomNode)domNodeTemplateCache.set(domNode,compiledDomNode)}if(domNodeTemplateCache.has(domNode)){const compiledDomNode=domNodeTemplateCache.get(domNode);const output=this.evaluateCompiledDomNodeTemplate(compiledDomNode,scope);if(output!==null)if(options.unsafe&&domNode.innerHTML)domNode.innerHTML=output;else domNode.textContent=output;if(compiledDomNode.children.length){const evaluateChildDomNode=children=>{for(const childCompiledDomNode of children){const output=this.evaluateCompiledDomNodeTemplate(childCompiledDomNode,scope);if(output!==null)childCompiledDomNode.domNode.textContent=output;if(childCompiledDomNode.children.length)evaluateChildDomNode(childCompiledDomNode.children)}};evaluateChildDomNode(compiledDomNode.children)}}if(options.applyBindings)this.applyBindings(domNode,scope)}/**
     * Adds an event listener to the given dom node so that it will be
     * deregistered when the component instance is destroyed.
     * @param domNode - Node to assign event handler to.
     * @param name - Event name.
     * @param handler - Callback to trigger when given event occurs.
     * @param options - Add event listener options.
     * @param removeOptions - Remove event listener options.
     * @returns Deregister function.
     */addSecureEventListener(domNode,name,handler,options,removeOptions){/*
            NOTE: Has to be done before retrieving the event map since it may
            be removed when the old handler was the last one registered.
        */this.domNodeEventBindings.get(domNode)?.get(name)?.();if(!this.domNodeEventBindings.has(domNode))this.domNodeEventBindings.set(// eslint-disable-next-line func-call-spacing
domNode,new Map);const eventMap=this.domNodeEventBindings.get(domNode);const deregister=()=>{domNode.removeEventListener(name,handler,removeOptions);// NOTE: An outdated deregister should not remove its successor.
if(eventMap.get(name)===deregister)eventMap.delete(name);if(eventMap.size===0&&this.domNodeEventBindings.get(domNode)===eventMap)this.domNodeEventBindings.delete(domNode)};eventMap.set(name,deregister);domNode.addEventListener(name,handler,options);return deregister}//// endregion
/**
     * Determines initial root which initializes rendering digest.
     */determineRootBinding(){/*
            If this component is the root component, we have to trigger
            nested event handler by our own in global context since there is no
            parent doing that for us.
        */let currentElement=this.parentNode;while(currentElement){const isComponent=currentElement instanceof Web||currentElement.nodeName.includes("-")&&currentElement.nodeName!=="#document-fragment";const isInShadowDOM=currentElement.parentNode===null&&/* eslint-disable @typescript-eslint/no-base-to-string */currentElement.toString()==="[object ShadowRoot]";/* eslint-enable @typescript-eslint/no-base-to-string */if(isComponent){// Check whether we found the first parent component.
if(this.rootInstance===this){this.parentInstance=currentElement;/*
                        NOTE: There is at least one parent, so we can set
                        "isRoot" to "false".
                    */this.setPropertyValue("isRoot",false)}this.rootInstance=currentElement}else if(isInShadowDOM)/*
                    NOTE: Assume none root if determined a wrapped closed
                    shadow DOM.
                */this.setPropertyValue("isRoot",false);/*
                NOTE: Continue with the shadow root's host to find components
                which rendered us into their (even closed) shadow DOM.
            */currentElement=isInShadowDOM?currentElement.host:currentElement.parentNode}}/**
     * Checks if given content hast code (to compile and render).
     * @param content - Potential string with code inside.
     * @returns A boolean indicating whether given content has code.
     */static hasCode(content){return(// NOTE: First three conditions are only for performance.
typeof content==="string"&&content.includes("${")&&content.includes("}")&&/\${[\s\S]+}/.test(content))}/**
     * Converts given the list, item, or map to a map (with ordering).
     * @param value - Attribute reflection configuration.
     * @returns Generated map.
     */static normalizePropertyTypeList(value){if(typeof value==="string")value=[value];if(Array.isArray(value)){const givenValue=value;const newValue=new Map;for(const name of givenValue)if(Object.prototype.hasOwnProperty.call(Web.propertyTypes,name))newValue.set(name,Web.propertyTypes[name]);return newValue}return __WEBPACK_EXTERNAL_MODULE_clientnode_convertPlainObjectToMap__(value)}/// endregion
/// region events
/**
     * Attaches event handler to keep in sync with nested components properties
     * states.
     */attachEventHandler(){if(this.self.eventToPropertyMapping===null)return;/*
            NOTE: We only reflect properties by implicit determined events if
            their where no explicitly defined.
        */const somethingDefined=this.attachExplicitDefinedOutputEventHandler();this.attachImplicitDefinedOutputEventHandler(!somethingDefined)}/**
     * Attach explicitly defined event handler to synchronize internal and
     * external property states.
     * @returns Returns "true" if there are some defined and "false" otherwise.
     */attachExplicitDefinedOutputEventHandler(){if(!this.self.eventToPropertyMapping)return false;// Grab all existing output to property definitions
let result=false;for(const name of Object.keys(this.self.eventToPropertyMapping))if(!Object.prototype.hasOwnProperty.call(this.internalProperties,name)){result=true;this.outputEventNames.add(name);this.setInternalPropertyValue(name,async(...parameters)=>{const result=await this.reflectEventToProperties(name,parameters);if(result)parameters[0]=result;this.forwardEvent(name,parameters)})}return result}/**
     * Attach implicitly defined event handler to synchronize internal and
     * external property states.
     * @param reflectProperties - Indicates whether implicitly determined
     * properties should be reflected.
     */attachImplicitDefinedOutputEventHandler(reflectProperties=true){// Determine all event handlers to inject
for(const[name,type]of Object.entries(this.self.propertyTypes))if(!Object.prototype.hasOwnProperty.call(this.internalProperties,name)&&[__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_func__,"function"].includes(type)&&!this.self.renderProperties.includes(name)){this.outputEventNames.add(name);this.setInternalPropertyValue(name,(...parameters)=>{if(reflectProperties)void this.reflectEventToProperties(name,parameters);this.forwardEvent(name,parameters)})}}/**
     * Triggers all identified events to communicate internal property / state
     * changes.
     */triggerOutputEvents(){for(const name of this.outputEventNames)this.forwardEvent(name,[this.externalProperties])}/**
     * Forwards given event as the native web event.
     * @param name - Event name.
     * @param parameters - Event parameters.
     * @returns False if event is cancelable, and at least one of the event
     * handlers which received event called "Event.preventDefault()",
     * otherwise true will be returned.
     */forwardEvent(name,parameters){if(name.length>"onX".length&&name.startsWith("on"))name=__WEBPACK_EXTERNAL_MODULE_clientnode_lowerCase__(name.substring(2));return this.dispatchEvent(new CustomEvent(name,{detail:{parameters}}))}/// endregion
/// region slots
/**
     * Renders component given slot contents into the given dom node. If
     * expected slots are not given but a fallback is specified, they will be
     * loaded into internal slot mapping.
     * @param targetDomNode - Target dom node to render slots into.
     * @param scope - Environment to render slots again if specified.
     */applySlots(targetDomNode,scope){for(const domNode of Array.from(targetDomNode.querySelectorAll("slot"))){const name=domNode.getAttribute("name");if(name===null||name==="default"){if(this.slots.default){if(this.self.renderSlots){if(this.self.evaluateSlots)for(const domNode of this.slots.default)this.evaluateDomNodeTemplate(domNode,scope);__WEBPACK_EXTERNAL_MODULE_clientnode_replace__(domNode,this.slots.default,Web.trimSlots)}}else this.slots.default=__WEBPACK_EXTERNAL_MODULE_clientnode_unwrap__(domNode).map(domNode=>this.grabSlotContent(domNode));}else if(this.slots[name]){if(this.self.renderSlots){if(this.self.evaluateSlots)this.evaluateDomNodeTemplate(this.slots[name],scope);__WEBPACK_EXTERNAL_MODULE_clientnode_replace__(domNode,this.slots[name],Web.trimSlots)}}else this.slots[name]=this.grabSlotContent(__WEBPACK_EXTERNAL_MODULE_clientnode_unwrap__(domNode).filter(domNode=>domNode.nodeName.toLowerCase()!=="#text")[0])}}/**
     * Determines slot content from the given node.
     * @param slot - Node to grab slot content from.
     * @returns Determined slot.
     */grabSlotContent(slot){/*
            If real (template) code is wrapped in a "textarea" tag, unwrap it
            now. This extra wrapping can be used to avoid first dom rendering
            before template code has been evaluated.
        */const element=slot.firstElementChild?slot:null;if(element&&element.firstElementChild?.nodeName.toLowerCase()==="textarea"&&(!element.firstElementChild.hasAttribute("data-no-template")||element.firstElementChild.getAttribute("data-no-template")==="false")){const content=element.firstElementChild.value;/*
                NOTE: These kinds of slots are always used as a template and
                should therefore be copied in every case.
                NOTE: A flat copy should suffice since we will replace nested
                content.
                NOTE: Remove template content in copied node to avoid rendering
                them before being evaluated. We cannot remove template code
                from the source node since this would make it impossible to
                re-instantiate this slot during whole component
                re-instantiation.
            */element.classList.remove("web-component-template");const newSlot=element.cloneNode();element.classList.add("web-component-template");newSlot.innerHTML="";newSlot.template=content;return newSlot}return this.self.cloneSlots?slot.cloneNode(true):slot}/**
     * Saves given slots.
     */grabGivenSlots(){this.slots={};for(const slot of Array.from(this.querySelectorAll("[slot]"))){// NOTE: This is how we avoid grabbing slots from nested components.
let currentElement=slot.parentNode;let skip=true;while(currentElement){if(currentElement.nodeName.includes("-")){if(currentElement===this)skip=false;break}currentElement=currentElement.parentNode}if(skip)continue;const slotValue=slot.getAttribute("slot")?.trim();this.slots[slotValue??slot.nodeName.toLowerCase()]=this.grabSlotContent(slot)}if(this.slots.default)this.slots.default=[].concat(this.slots.default);else if(this.childNodes.length>0)this.slots.default=Array.from(this.childNodes).map(domNode=>this.grabSlotContent(domNode));else this.slots.default=[]}/// endregion
/// region properties
/**
     * Determines if a given property name exists in wrapped component state.
     * @param name - Property name to check if exists in state.
     * @returns Boolean result.
     */isStateProperty(name){return Boolean(this.instance?.current?.state&&(Object.prototype.hasOwnProperty.call(this.instance.current.state,name)||this.instance.current.state.modelState&&Object.prototype.hasOwnProperty.call(this.instance.current.state.modelState,name)))}/**
     * Generates an alias to name and the other way around mapping if not
     * exists.
     */generateAliasIndex(){if(!this.self._propertyAliasIndex){this.self._propertyAliasIndex={...this.self.propertyAliases};// Align alias mapping for better performance while mapping them.
for(const[name,value]of Object.entries(this.self._propertyAliasIndex))if(!Object.prototype.hasOwnProperty.call(this.self._propertyAliasIndex,value))this.self._propertyAliasIndex[value]=name}}/**
     * Reflects wrapped component state back to web-component's attributes.
     * @param properties - Properties to update in reflected attribute state.
     */reflectExternalProperties(properties){/*
            NOTE: We can avoid an additional attribute parsing for
            reflections.
        */this.ignoreAttributeUpdateObservations=true;for(const[name,value]of Object.entries(properties)){this.setExternalPropertyValue(name,value);if(!this.isConnected)continue;const attributeName=__WEBPACK_EXTERNAL_MODULE_clientnode_camelCaseToDelimited__(name);if(this.self._propertiesToReflectAsAttributes?.has(name))switch(this.self._propertiesToReflectAsAttributes.get(name)){case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__:case"boolean":if(value){if(this.getAttribute(attributeName)!=="")this.setAttribute(attributeName,"")}else if(this.hasAttribute(attributeName))this.removeAttribute(attributeName);break;case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_func__:case"function":break;case"json":if(value){const representation=JSON.stringify(value);if(representation&&this.getAttribute(attributeName)!==representation){this.setAttribute(attributeName,representation);break}}if(this.hasAttribute(attributeName))this.removeAttribute(attributeName);break;case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__:case"number":if(typeof value==="number"&&!isNaN(value)){const valueAsString=String(value);if(this.getAttribute(attributeName)!==valueAsString)this.setAttribute(attributeName,valueAsString)}else if(this.hasAttribute(attributeName))this.removeAttribute(attributeName);break;case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__:case"string":if(value){if(this.getAttribute(attributeName)!==value)this.setAttribute(attributeName,value)}else if(this.hasAttribute(attributeName))this.removeAttribute(attributeName);break;case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_any__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_array__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_arrayOf__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_element__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_elementType__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_instanceOf__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_node__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_object__:case"object":case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_objectOf__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_shape__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_exact__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_symbol__:default:if(value){const representation=__WEBPACK_EXTERNAL_MODULE_clientnode_represent__(value);if(representation&&this.getAttribute(attributeName)!==representation){this.setAttribute(attributeName,representation);break}}if(this.hasAttribute(attributeName))this.removeAttribute(attributeName);break}}this.ignoreAttributeUpdateObservations=false}/**
     * Reflects wrapped component state back to web-component's attributes and
     * properties.
     * @param properties - Properties to update in reflected property state.
     */reflectProperties(properties){this.reflectExternalProperties(properties);/*
            NOTE: Do not reflect properties which are hold in state. These
            values are only set once when they are explicitly set
            (see "setPropertyValue").
        */if(this.instance?.current?.state&&typeof this.instance.current.state==="object")for(const name of Object.keys(this.instance.current.state).concat(this.instance.current.state.modelState?Object.keys(this.instance.current.state.modelState):[]))if(Object.prototype.hasOwnProperty.call(this.internalProperties,name))/*
                        We want to avoid fully deleting this property to know
                        which properties exist in the underlying instance.
                    */this.setInternalPropertyValue(name,undefined);if(this.internalProperties.model?.state){delete this.internalProperties.model.state;this.setInternalPropertyValue("model",this.internalProperties.model)}for(const name of this.self.controllableProperties)if(Object.prototype.hasOwnProperty.call(properties,name))this.setInternalPropertyValue(name,properties[name])}/**
     * Reflect the given event handler call with the given parameter back to
     * current properties state.
     * @param name - Event name.
     * @param parameters - List of parameter to given event handler call.
     * @returns Mapped properties or null if nothing could be mapped.
     */async reflectEventToProperties(name,parameters){/*
            NOTE: We enforce to update component state immediately after an
            event occurs since batching usually does not make sense here. An
            event runs within its own context.
            On the other hand, it can be necessary to immediately reflect a
            property change to the component internal state to avoid
            contradicting internal render cycles.
        */const oldBatchUpdatesConfiguration=this.batchUpdates;this.batchUpdates=false;let result=null;let handled=false;// region check if there exists an explicit mapper
if(this.self.eventToPropertyMapping&&Object.prototype.hasOwnProperty.call(this.self.eventToPropertyMapping,name)&&__WEBPACK_EXTERNAL_MODULE_clientnode_isFunction__(this.self.eventToPropertyMapping[name])){const wrappedMapping=this.self.eventToPropertyMapping[name](...parameters,this);const mapping=wrappedMapping&&"then"in wrappedMapping&&__WEBPACK_EXTERNAL_MODULE_clientnode_isFunction__(wrappedMapping.then)?await wrappedMapping:wrappedMapping;handled=true;if(Array.isArray(mapping)){result=mapping[0];this.reflectProperties(result);__WEBPACK_EXTERNAL_MODULE_clientnode_extend__(true,this.internalProperties,mapping[1])}else if(mapping===null)handled=false;else if(typeof mapping==="object"){result=mapping;this.reflectProperties(mapping)}}// endregion
if(!handled&&parameters.length>0&&__WEBPACK_EXTERNAL_MODULE_clientnode_isObject__(parameters[0])){/*
                Identified as somehow throw data back event (no synthetic
                event; derived from a user-triggered one) when following
                condition does not hold.
            */let newProperties=parameters[0];if("persist"in parameters[0]&&__WEBPACK_EXTERNAL_MODULE_clientnode_isFunction__(parameters[0].persist)){newProperties={};for(const propertyName of Object.keys(this.self.propertyTypes))for(const name of[propertyName].concat(this.getPropertyAlias(propertyName)??[])){const currentValue=parameters[0].currentTarget&&Object.prototype.hasOwnProperty.call(parameters[0].currentTarget,name)?/*
                                    Update all known properties from event
                                    target instance.
                                */parameters[0].currentTarget[name]:/*
                                    Update all known properties from adapter
                                    instance.
                                */this.getPropertyValue(name);if(currentValue!==this.externalProperties[name])newProperties[name]=currentValue}}else if(![null,undefined].includes(newProperties.detail?.value))newProperties={...newProperties.detail};result=newProperties;this.reflectProperties(newProperties)}this.triggerRender("propertyReflected");this.batchUpdates=oldBatchUpdatesConfiguration;return result}/**
     * Evaluates the given property value depending on its property definition
     * and registers in a property mapping object.
     * @param attributeName - Name of given value.
     * @param value - Value to evaluate.
     */evaluateStringOrNullAndSetAsProperty(attributeName,value){const preEvaluate=attributeName.startsWith("-");const effectiveAttributeName=preEvaluate?attributeName.substring(1):attributeName;let name=__WEBPACK_EXTERNAL_MODULE_clientnode_delimitedToCamelCase__(effectiveAttributeName);const alias=this.getPropertyAlias(name);if(alias&&Object.prototype.hasOwnProperty.call(this.self.propertyTypes,alias))name=alias;if(Object.prototype.hasOwnProperty.call(this.self.propertyTypes,name)){const type=this.self.propertyTypes[name];if(preEvaluate){if(value){const result=__WEBPACK_EXTERNAL_MODULE_clientnode_evaluate__(value,{scope:{...__WEBPACK_EXTERNAL_MODULE_clientnode_UTILITY_SCOPE__},binding:this});if(result.error){void log.warn(`Failed to process pre-evaluation attribute`,`"${attributeName}": ${result.error}. Will be`,"set to \"undefined\".");this.setInternalPropertyValue(name,undefined)}else{this.setInternalPropertyValue(name,result.result);this.setExternalPropertyValue(name,result.result)}}}else switch(type){case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__:case"boolean":{const booleanValue=![null,"false"].includes(value);this.setInternalPropertyValue(name,booleanValue);this.setExternalPropertyValue(name,booleanValue);break}case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_func__:case"function":{let error=null;let templateFunction;const scopeNames=["data","event","firstArgument","firstParameter","options"];if(value){const result=__WEBPACK_EXTERNAL_MODULE_clientnode_compile__(value,{scope:scopeNames.concat("parameters","scope",__WEBPACK_EXTERNAL_MODULE_clientnode_UTILITY_SCOPE_NAMES__),execute:true,binding:this});error=result.error;templateFunction=result.templateFunction;if(error)void log.warn("Failed to compile given handler",`"${attributeName}": ${error}.`)}this.setInternalPropertyValue(name,(...parameters)=>{if(this.outputEventNames.has(name))void this.reflectEventToProperties(name,parameters);let result=undefined;if(!error){const scope={parameters,...__WEBPACK_EXTERNAL_MODULE_clientnode_UTILITY_SCOPE__};for(const name of scopeNames)scope[name]=parameters[0];try{result=templateFunction?.(...scopeNames.map(name=>scope[name]),parameters,scope,...__WEBPACK_EXTERNAL_MODULE_clientnode_UTILITY_SCOPE_NAMES__.map(name=>__WEBPACK_EXTERNAL_MODULE_clientnode_UTILITY_SCOPE__[name]))}catch(error){void log.warn("Failed to evaluate function",`"${attributeName}" with expression`,`"${value}" and scope`,"variables",`"${scopeNames.join("\", \"")}" set to`,`"${__WEBPACK_EXTERNAL_MODULE_clientnode_represent__(parameters)}":`,`${error}. Set property`,`to "undefined".`)}}if(!this.self.renderProperties.includes(name))this.forwardEvent(name,parameters);return result});if(!error)this.setExternalPropertyValue(name,templateFunction);break}case"json":{if(value){let evaluated;try{evaluated=JSON.parse(value)}catch(error){void log.warn("Error occurred during parsing given json",`attribute "${attributeName}":`,__WEBPACK_EXTERNAL_MODULE_clientnode_represent__(error));break}// NOTE: That both values do have to be avoided.
this.setInternalPropertyValue(name,evaluated);this.setExternalPropertyValue(name,__WEBPACK_EXTERNAL_MODULE_clientnode_copy__(evaluated,false,1))}else{this.setInternalPropertyValue(name,null);this.setExternalPropertyValue(name,null)}break}case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__:case"number":{if(value===null){this.setInternalPropertyValue(name,value);this.setExternalPropertyValue(name,value);break}/*
                        NOTE: You should not name this variable "number" since
                        babel gets confused caused by existing module wide
                        property type variable "number".
                    */let numberValue=parseFloat(value);if(isNaN(numberValue))numberValue=undefined;this.setInternalPropertyValue(name,numberValue);this.setExternalPropertyValue(name,numberValue);break}case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__:case"string":{this.setInternalPropertyValue(name,value);this.setExternalPropertyValue(name,value);break}case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_any__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_array__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_arrayOf__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_element__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_elementType__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_instanceOf__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_node__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_object__:case"object":case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_objectOf__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_oneOf__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_oneOfType__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_shape__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_exact__:case __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_symbol__:default:{if(value){const evaluated=__WEBPACK_EXTERNAL_MODULE_clientnode_evaluate__(value,{binding:this});if(evaluated.error){void log.warn("Error occurred during processing given",`attribute configuration "${attributeName}":`,evaluated.error);break}// NOTE: That both values do have to be avoided.
this.setInternalPropertyValue(name,evaluated.result);this.setExternalPropertyValue(name,__WEBPACK_EXTERNAL_MODULE_clientnode_copy__(evaluated.result,false,1))}else if(this.hasAttribute(attributeName)){this.setInternalPropertyValue(name,true);this.setExternalPropertyValue(name,true)}else{this.setInternalPropertyValue(name,null);this.setExternalPropertyValue(name,null)}break}}}}/// endregion
/// region render
/**
     * Produces a promise resolving when all nested rendering promises have
     * been resolved. This only waits for registered nested components. That
     * means that nested components which where connected before the parent
     * component got initialized will not be waited for. That might happen
     * when nested component types got registered before the parent ones.
     */async waitForNestedComponentRendering(){if(!this.childComponentInstances)return;await Promise.all(this.childComponentInstances.map(component=>component.renderState.pending?component.renderState.promise:Promise.resolve()))}/**
     * Resolves the rendering promise.
     * @param reason - Rendering reason description.
     * @param resolveRendering - Indicates whether to resolve the rendering or
     * just return a resolving promise directly.
     * @returns A promise resolving when all nested render promises have been
     * resolved.
     */async resolveRenderingPromiseIfSet(reason,resolveRendering){if(resolveRendering){await this.waitForNestedComponentRendering();this.renderState.pending=false;this.renderState.resolve(reason);this.prepareNewRenderingPromise()}}/**
     * Sets up a new rendering cycle representing promise.
     */prepareNewRenderingPromise(){if(!this.renderState.pending)this.renderState.promise=new Promise(resolve=>{this.renderState.resolve=reason=>{this.renderState.pending=false;resolve(reason)}})}/**
     * Triggers a new rendering cycle by respecting batch configuration.
     * @param reason - A description why rendering should be triggered.
     */triggerRender(reason){if(this.batchUpdates){if(!this.batchedUpdateRunning){this.batchedUpdateRunning=true;void __WEBPACK_EXTERNAL_MODULE_clientnode_timeout__(()=>{this.batchedUpdateRunning=false;void this.render(reason)})}}else void this.render(reason)}/**
     * Creates shadow root if not created yet and assigns to the current root
     * property.
     */applyShadowRootIfNotExisting(){if(this.self.shadowDOM&&this.hostDomNode===this)this.hostDomNode=(!("attachShadow"in this)&&"ShadyDOM"in window?window.ShadyDOM.wrap(this):this).attachShadow(__WEBPACK_EXTERNAL_MODULE_clientnode_isObject__(this.self.shadowDOM)?this.self.shadowDOM:{mode:"open"})}/**
     * Determines a new scope object with a useful default set of environment
     * values.
     * @param scope - To apply to generated scope.
     */determineRenderScope(scope={}){this.scope={...(this.parentInstance?.scope||{}),...this.scope,...this.internalProperties,parentInstance:this.parentInstance,rootInstance:this.rootInstance,self:this,[__WEBPACK_EXTERNAL_MODULE_clientnode_lowerCase__(this.self._name)||"instance"]:this,...scope};this.scope.scope=this.scope}/**
     * Does the rendering job. Should be called when ever state changes should
     * be projected to the hosts dom content.
     * @param reason - Description why rendering is necessary.
     * @param resolveRendering - Indicates whether rendering should be resolved
     * finally. Should be set to "false" via super calls in inherited render
     * methods which do further dom manipulations afterward and resolve the
     * rendering process by their own.
     * @returns A promise resolving when rendering has been finished. A promise
     * may be needed for classes inheriting from this class.
     */async render(reason="unknown",resolveRendering=true){this.unRender("reRender",reason);this.childComponentInstances=[];this.renderState.pending=true;if(this.isRoot){await this.resolveRenderingPromiseIfSet(reason,resolveRendering);if(resolveRendering){await Promise.all(this.self.pendingRenderPromises);this.self.pendingRenderPromises=[]}}this.self.pendingRenderPromises.push(this.renderState.promise);this.determineRenderScope();/*
            NOTE: "unRender" has removed all registered event listeners
            including root ones so we have to bind them again (with the newly
            determined scope) before dispatching the "render" event.
        */if(this.self.applyRootBinding&&this.isRoot)this.applyBinding(this,this.scope);if(!(this.self.doRender&&this.dispatchEvent(new CustomEvent("render",{detail:{reason,scope:this.scope}})))){await this.resolveRenderingPromiseIfSet(reason,resolveRendering);return}const evaluated=__WEBPACK_EXTERNAL_MODULE_clientnode_evaluate__(`\`${this.self.content}\``,{scope:this.scope});if(evaluated.error){void log.warn(`Failed to process template: ${evaluated.error}`);this.renderState.resolve(reason);await Promise.all(this.self.pendingRenderPromises);return}this.applyShadowRootIfNotExisting();/*
            NOTE: We first render into an intermediate render target and apply
            slot content until we finally publish everything to the document.
            This avoids painting twice and internetexplorer bugs with an empty
            node after first overwriting the content of "this.rootInstance".
        */const renderTargetDomNode=document.createElement("div");renderTargetDomNode.innerHTML=evaluated.result;this.applySlots(renderTargetDomNode,{...this.scope,parentInstance:this});this.hostDomNode.innerHTML=renderTargetDomNode.innerHTML;/*
            NOTE: Event handler have to be bound before nested components
            dispatch their first events (like "render"). Nested components
            render in a later event queue so binding them synchronously here
            is early enough.
        */this.applyBindings(this.hostDomNode.firstChild,this.scope,this.self.renderSlots,true,false);/*
            NOTE: Wait until nested components have registered themselves to be
            able to wait for their rendering.
        */await __WEBPACK_EXTERNAL_MODULE_clientnode_timeout__();void this.waitForNestedComponentRendering().then(()=>{this.applyBindings(this.hostDomNode.firstChild,this.scope,this.self.renderSlots,false,true)});await this.resolveRenderingPromiseIfSet(reason,resolveRendering)}/**
     * Should free up memory listeners related to deprecated HTML.
     * @param _reason - Description why rendering is necessary.
     * @param _reRenderReason - Description why a re-rendering is necessary.
     */unRender(_reason="unknown",_reRenderReason){this.unregisterDomNodeEventBindings()}/// endregion
// endregion
},_defineProperty(_Web,"applyRootBinding",true),_defineProperty(_Web,"pendingRenderPromises",[]),_defineProperty(_Web,"content","<slot>Please provide a template to transclude.</slot>"),_defineProperty(_Web,"determineRootBinding",true),_defineProperty(_Web,"shadowDOM",null),_defineProperty(_Web,"observedAttributes",[]),_defineProperty(_Web,"controllableProperties",[]),_defineProperty(_Web,"eventToPropertyMapping",{}),_defineProperty(_Web,"propertyAliases",{}),_defineProperty(_Web,"propertyTypes",{onClick:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_func__}),_defineProperty(_Web,"propertiesToReflectAsAttributes",[]),_defineProperty(_Web,"renderProperties",["children"]),_defineProperty(_Web,"doRender",false),_defineProperty(_Web,"cloneSlots",false),_defineProperty(_Web,"evaluateSlots",false),_defineProperty(_Web,"renderSlots",true),_defineProperty(_Web,"trimSlots",true),_defineProperty(_Web,"renderUnsafe",false),_defineProperty(_Web,"_name","BaseWeb"),_defineProperty(_Web,"_propertyAliasIndex",void 0),_defineProperty(_Web,"_propertiesToReflectAsAttributes",void 0),_Web),_descriptor=_applyDecoratedDescriptor(_class.prototype,"isRoot",[_dec],{configurable:true,enumerable:true,writable:true,initializer:function(){return true}}),_class);const api=(/* unused pure expression or super */ null && ({component:Web,register:(tagName=camelCaseToDelimited(Web._name))=>{customElements.define(tagName,Web)}}));/* harmony default export */ const src_Web = (Web);
;// ./src/ReactWeb.ts
/* unused harmony import specifier */ var ReactWeb_camelCaseToDelimited;
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module react *//* !
    region header
    [Project page](https://tsickert.com/web-component-wrapper)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
    endregion
*/// region imports
function ReactWeb_defineProperty(r,t,o){return(t=ReactWeb_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function ReactWeb_toPropertyKey(r){var o=ReactWeb_toPrimitive(r,"string");return"symbol"==typeof o?o:o+""}function ReactWeb_toPrimitive(t,e){if("object"!=typeof t||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)};// endregion
const ReactWeb_log=new __WEBPACK_EXTERNAL_MODULE_clientnode_Logger__({name:"web-component-wrapper.react-web"});/*
    Live cycle:

    1. Render the React component with properties (defined in a web-component)
       and start listing to "onChange" events.
    2. Reflect component properties to web-component properties and
       attributes (with prevented re-rendering caused by new properties).
    3. Component triggers an "onChange" event (caused by some react event)
       which delivers updated properties to the web-component.
       -> Starting with the first step.
*//**
 * Adapter for exposing a React component as a web-component.
 * @property attachWebComponentAdapterIfNotExists - Indicates whether to wrap
 * with a reference wrapper to get updated about internal state changes.
 * @property content - React component to wrap.
 * @property react - React namespace.
 * @property compiledSlots - Cache of yet pre-compiled slot elements.
 * @property preparedSlots - Cache of yet evaluated slot react elements.
 * @property rootReactInstance - Saves determined root react instance.
 * @property self - Back-reference to this class.
 * @property wrapMemorizingWrapper - Determines whether to wrap component with
 * React's memorizing wrapper to cache component render results.
 * @property isWrapped - Indicates whether a React component is wrapped
 * already.
 */class ReactWeb extends src_Web{constructor(...args){super(...args);ReactWeb_defineProperty(this,"unmountOnDisconnect",true);ReactWeb_defineProperty(this,"compiledSlots",{});ReactWeb_defineProperty(this,"preparedSlots",{});ReactWeb_defineProperty(this,"reactRoot",null);ReactWeb_defineProperty(this,"rootReactInstance",null);ReactWeb_defineProperty(this,"self",ReactWeb);ReactWeb_defineProperty(this,"wrapMemorizingWrapper",null);ReactWeb_defineProperty(this,"isWrapped",false);/**
     * Updates the current component instance and reflects newly determined
     * properties.
     */ReactWeb_defineProperty(this,"reflectInstanceProperties",()=>{if(this.instance?.current&&this.instance.current.properties)this.reflectProperties(this.instance.current.properties)})}// region live-cycle
/**
     * Triggered when this component is mounted into the document. Event
     * handlers will be attached and the final render proceeds.
     */connectedCallback(){this.applyComponentWrapper();// NOTE: Can be overwritten during optional root determining.
this.rootReactInstance=this;/*
            Attaches event handler, grabs given slots, reflects external
            properties and enqueues first rendering.
        */super.connectedCallback()}/**
     * Triggered when this component is unmounted from the document. Event
     * handlers will be removed and state updated accordingly.
     */disconnectedCallback(){this.unRender("disconnected");if(this.unmountOnDisconnect)this.reactRoot?.unmount();this.unregisterConnectionState()}/**
     * Reflects wrapped component state back to web-component's attributes.
     * @param properties - Properties to update in reflected attribute state.
     */reflectExternalProperties(properties){if(this.isRoot)super.reflectExternalProperties(properties)}/**
     * Method that does the rendering job. Should be called when ever state
     * changes should be projected to the hosts dom content.
     * @param reason - Description why rendering is necessary.
     * @param resolveRendering - Indicates whether rendering should be resolved
     * finally. Should be set to "false" via super calls in inherited render
     * methods which do further dom manipulations afterward and resolve the
     * rendering process by their own.
     * @returns A promise resolving when rendering has finished. A promise may
     * be needed for classes inheriting from this class.
     */async render(reason="unknown",resolveRendering=true){super.unRender("reRender",reason);/*
            NOTE: "unRender" has removed all registered event listeners
            including root ones so we have to bind them again (with the newly
            determined scope) before dispatching the "render" event.
        */if(this.self.applyRootBinding&&this.isRoot){this.determineRenderScope();this.applyBinding(this,this.scope)}this.childComponentInstances=[];this.renderState.pending=true;if(this.isRoot)this.self.pendingRenderPromises=[];this.self.pendingRenderPromises.push(this.renderState.promise);/*
            NOTE: We prevent a nested React component from self-rendering since
            they will be rendered by highest react parent.
        */if(this.rootReactInstance!==this||!this.dispatchEvent(new CustomEvent("render",{detail:{reason,scope:this.scope}})))return this.resolveRenderingPromiseIfSet(reason,resolveRendering);this.determineRenderScope();if(Object.keys(this.compiledSlots).length===0)this.preCompileSlots();this.evaluateSlots({...this.scope,parentInstance:this});this.prepareProperties(this.internalProperties);this.applyShadowRootIfNotExisting();if(this.rootInstance!==this&&!this.reactRoot){/*
                Remove template nodes since they will be replaced by reacts
                render result (only necessary when having a dedicated rendering
                target like shadow root and only on first render before React
                takes over DOM management).
            */let domNode=this.firstChild;while(domNode){const nextDomNode=domNode.nextSibling;this.removeChild(domNode);domNode=nextDomNode}}if(!this.reactRoot){const identifierPrefixCandidate=this.id||this.internalProperties.id||this.externalProperties.id||this.name||this.internalProperties.name||this.externalProperties.name;let identifierPrefix="";if(typeof identifierPrefixCandidate==="string")identifierPrefix=identifierPrefixCandidate;this.reactRoot=__WEBPACK_EXTERNAL_MODULE_react_dom_client_82ef521c_createRoot__(this.hostDomNode,{identifierPrefix})}__WEBPACK_EXTERNAL_MODULE_react_dom_c0b5c364_flushSync__(()=>{this.reactRoot?.render(__WEBPACK_EXTERNAL_MODULE_react_createElement__(this.self.content,this.internalProperties));void this.resolveRenderingPromiseIfSet(reason,resolveRendering)});if(resolveRendering)await this.renderState.promise}// endregion
// region property handling
/**
     * Generic property setter. Forwards field writes into internal and
     * external property representations.
     *
     * In general, it is a bad idea to write properties which shadow state
     * properties (move to a controlled component instance) and re-set the
     * property to "undefined" later to lose control.
     *
     * The reason causes in avoiding this scenario:
     *
     * 1. Property overwrites the state.
     * 2. State changes but is shadowed by recent changes in property.
     *
     * So the following will be ensured:
     *
     * 1. Property overwrites the state.
     * 2. Property is overwritten to "undefined" to lose control over the
     *    state.
     * 3. Now a state change can be represented back after property adaptions.
     *    (Converts reacts declarative nature into an imperative web-component
     *    style).
     * 4. Further state changes should be communicated back via output events.
     * @param name - Property name to write.
     * @param value - New value to write.
     */setPropertyValue(name,value){this.reflectProperties({[name]:__WEBPACK_EXTERNAL_MODULE_clientnode_copy__(value,false,1)});this.setInternalPropertyValue(name,__WEBPACK_EXTERNAL_MODULE_clientnode_copy__(value,false,1))}/**
     * Internal property setter. Respects configured aliases.
     * @param name - Property name to write.
     * @param value - New value to write.
     */setInternalPropertyValue(name,value){if(value===null)value=__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_NullSymbol__;else if(value===undefined)value=__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_UndefinedSymbol__;super.setInternalPropertyValue(name,value)}// endregion
// region handle slots
/**
     * Converts given html dom nodes into a compiled function to generate a
     * react-element or a react-element list.
     * @param domNodes - Nodes to convert.
     * @param scope - Additional scope to render subcomponents against.
     * Necessary to bound necessary environment variables into compiled context.
     * @param isFunction - Indicates whether a given render result should be
     * provided as function (render property) with bound parameters environment
     * variable name.
     * @returns Transformed react elements.
     */preCompileDomNodes(domNodes,scope={},isFunction=false){// NOTE: We ignore empty text nodes (like React's jsx does).
domNodes=domNodes.filter(domNode=>domNode.nodeType!==Node.TEXT_NODE||typeof domNode.nodeValue==="string"&&domNode.nodeValue.trim()!=="");if(domNodes.length===1)return this.preCompileDomNode(domNodes[0],scope,isFunction);let index=1;const result=[];for(const node of domNodes){const element=this.preCompileDomNode(node,scope,isFunction,index.toString());result.push(element);index+=1}if(isFunction)return scope=>(...parameters)=>{const renderResult=[];for(const factory of result){const renderItem=factory(scope);if(typeof renderItem==="function")renderResult.push(renderItem(...parameters))}return __WEBPACK_EXTERNAL_MODULE_react_createElement__(__WEBPACK_EXTERNAL_MODULE_react_Fragment__,{children:renderResult})};return result}/**
     * Converts a given html dom node into a react-element.
     * @param domNode - Node to convert.
     * @param scope - Additional scope to render subcomponents against.
     * @param isFunction - Indicates whether given nodes should be provided as
     * function (render property).
     * @param key - Optional key to add to component properties.
     * @returns Transformed react element.
     */preCompileDomNode(domNode,scope={},isFunction=false,key){// region render property
if(isFunction){const node=this.preCompileDomNode(domNode,{...scope,data:undefined,firstArgument:undefined,firstParameter:undefined,options:undefined,scope:undefined,parameters:undefined},false,key);return scope=>(...parameters)=>{const firstArgument=parameters.length>0?parameters[0]:null;return node({...scope,data:firstArgument,firstArgument,firstParameter:firstArgument,options:firstArgument,scope:firstArgument,parameters})}}// endregion
// region text node
if(domNode.nodeType===Node.TEXT_NODE){const value=typeof domNode.nodeValue==="string"?domNode.nodeValue.trim():"";const result=key&&value?__WEBPACK_EXTERNAL_MODULE_react_createElement__(__WEBPACK_EXTERNAL_MODULE_react_Fragment__,{children:value,key}):value?value:null;return()=>result}// endregion
if(!domNode.getAttributeNames)return()=>null;// region native elements and wrapped react components
/// region prepare type and static properties
const staticProperties={};let target;const isComponent=this.self.isReactComponent(domNode);if(isComponent){// region pre-compile nested render context
domNode.determineRenderScope();if(Object.keys(this.compiledSlots).length===0)domNode.preCompileSlots();// endregion
/*
                NOTE: Nested components are already instantiated and connected,
                so use their initialized properties. We need to merge them when
                actually rendering the nested component.
            */if(key&&!Object.prototype.hasOwnProperty.call(staticProperties,"key"))staticProperties.key=key;target=domNode.constructor.content}else{staticProperties.key=key;target=domNode.tagName.toLowerCase()}/// endregion
/// region pre-compile dynamic properties
let knownScopeNames=Object.keys(scope);const compiledProperties={};for(const attributeName of domNode.getAttributeNames()){let value=domNode.getAttribute(attributeName);if(value===null)continue;let extend=false;let name="";if(attributeName.startsWith("data-bind-"))name=attributeName.substring("data-bind-".length);else if(attributeName.startsWith("bind-"))name=attributeName.substring("bind-".length);if(name.startsWith("attribute-")||name==="attributes"||name.startsWith("property-")||name==="properties"){const{error,originalScopeNames,templateFunction}=__WEBPACK_EXTERNAL_MODULE_clientnode_compile__(value,{scope:knownScopeNames});if(error){void ReactWeb_log.warn("Error occurred during compiling given attribute",`binding "${attributeName}" on node:`,domNode,error);continue}if(name==="attributes"||name==="properties")extend=true;else name=name.startsWith("attribute-")?name.substring("attribute-".length):name.substring("property-".length);value={originalScopeNames,templateFunction:templateFunction.bind(this)}}else if(name.startsWith("on-")){name=__WEBPACK_EXTERNAL_MODULE_clientnode_delimitedToCamelCase__(name);if(!Object.prototype.hasOwnProperty.call(scope,"event"))knownScopeNames=[...knownScopeNames,"event"];if(!Object.prototype.hasOwnProperty.call(scope,"parameters"))knownScopeNames=[...knownScopeNames,"parameters"];/*
                    NOTE: We pre-compile event listener since they should
                    usually be called more than it would be re-rendered.
                */const{error,originalScopeNames,scopeNames,templateFunction}=__WEBPACK_EXTERNAL_MODULE_clientnode_compile__(value,{scope:knownScopeNames,execute:true});if(error){void ReactWeb_log.warn("Error occurred during compiling given event",`binding "${attributeName}" on node:`,domNode,error);continue}const eventHandler=templateFunction.bind(this);value=(...parameters)=>{scope.event=parameters[0];scope.parameters=parameters;try{eventHandler(/*
                                NOTE: We want to be ensured to have the same
                                ordering as we have for the scope names and to
                                call internal registered getter by retrieving
                                values. So simple using
                                "...Object.values(scope)" is not appreciate
                                here.
                            */...originalScopeNames.map(name=>scope[name]))}catch(error){void ReactWeb_log.warn("Error occurred during processing given",`event binding "${attributeName}" on node: `,domNode,`Given expression "${value}" could`,"not be evaluated with given scope names",`"${scopeNames.join("\", \"")}":`,__WEBPACK_EXTERNAL_MODULE_clientnode_represent__(error))}}}else name=attributeName;const mapping={class:"className",for:"htmlFor"};if(Object.prototype.hasOwnProperty.call(mapping,name))name=mapping[name];name=__WEBPACK_EXTERNAL_MODULE_clientnode_delimitedToCamelCase__(name);if(value?.originalScopeNames)// NOTE: "''" marks a property set like in JSX "{...props}".
compiledProperties[extend?"":name]=value;else if(!isComponent)/*
                    NOTE: Properties of components are evaluated already by
                    them self and set as "internalProperties". Those
                    properties, which need to be evaluated against the parent
                    scope, should be marked via the "bind-property-" prefix.
                    That's why they are omitted here.
                */staticProperties[name]=value}/// endregion
/// region pre-compiled nested nodes of native elements
if(!isComponent){const childNodes=Array.from(domNode.childNodes);if(childNodes.length)staticProperties.children=this.preCompileDomNodes(childNodes,scope)}/// endregion
/// region create evaluable render function
return runtimeScope=>{// region prepare scope
runtimeScope={...scope,...runtimeScope};runtimeScope.scope=runtimeScope;// endregion
let properties={...staticProperties};// region evaluate dynamic properties
for(const[name,{originalScopeNames,templateFunction}]of Object.entries(compiledProperties)){const value=templateFunction(...originalScopeNames.map(name=>runtimeScope[name]));if(name==="")properties={...properties,...value};else properties[name]=value}// endregion
// region prepare react specific element property handling
if(Object.prototype.hasOwnProperty.call(properties,"innerHTML")){properties.dangerouslySetInnerHTML={__html:properties.innerHTML};delete properties.children;delete properties.innerHTML}if(Object.prototype.hasOwnProperty.call(properties,"textContent")){properties.children=properties.textContent;delete properties.textContent}else if(isComponent){// region evaluate nested render contexts
/*
                    NOTE: Properties of components are evaluated already by
                    them self and set as "internalProperties". Those
                    properties, which need to be evaluated against the parent
                    scope, should be marked via the "bind-property-" prefix.
                */properties={...domNode.internalProperties,...properties};runtimeScope={...properties,...runtimeScope,parentInstance:domNode};domNode.evaluateSlots(runtimeScope);domNode.prepareProperties(properties);// endregion
}else if(properties.children)properties.children=this.evaluatePreCompiledDomNodes(properties.children,runtimeScope);// endregion
return __WEBPACK_EXTERNAL_MODULE_react_createElement__(target,properties)};/// endregion
// endregion
}/**
     * Evaluates given pre-compiled nodes into a single react element or a
     * React element list.
     * @param nodes - Pre-compiled nodes.
     * @param scope - Additional scope to render subcomponents against.
     * @returns Transformed react elements.
     */evaluatePreCompiledDomNodes(nodes,scope={}){if(!Array.isArray(nodes))return nodes(scope);if(nodes.length===1)return nodes[0](scope);const result=[];for(const node of nodes){const element=node(scope);if(element)result.push(element)}return result}/**
     * Pre compiles and caches determined slots.
     */preCompileSlots(){for(const name in this.slots)if(this.slots[name]&&name!=="default")this.compiledSlots[name]=this.preCompileDomNode(this.slots[name],{...this.scope,parentInstance:this},[__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_func__,"function"].includes(this.self.propertyTypes[name]));if(this.slots.default&&this.slots.default.length>0)this.compiledSlots.children=this.preCompileDomNodes(this.slots.default,{...this.scope,parentInstance:this},[__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_func__,"function"].includes(this.self.propertyTypes.children))}/**
     * Evaluates pre-compiled slots.
     * @param scope - To render again.
     */evaluateSlots(scope){this.preparedSlots={};for(const name in this.compiledSlots)if(Object.prototype.hasOwnProperty.call(this.compiledSlots,name))if(name==="children")this.preparedSlots.children=this.evaluatePreCompiledDomNodes(this.compiledSlots[name],scope);else this.preparedSlots[name]=this.compiledSlots[name](scope)}// endregion
// region helper
/**
     * Determines if the given element type is a react-wrapped component.
     * @param domNode - Node to determine from.
     * @returns Boolean indicator.
     */static isReactComponent(domNode){const type=domNode.constructor;return typeof type.content==="object"&&(!type.attachWebComponentAdapterIfNotExists||type.content.webComponentAdapterWrapped==="react")}/**
     * Determines initial root and react root who initializes their rendering
     * digests.
     */determineRootBinding(){super.determineRootBinding();let currentElement=this.parentNode;while(currentElement){if(this.self.isReactComponent(currentElement)){this.rootReactInstance=currentElement;break}currentElement=currentElement.parentNode}}/**
     * Applies missing forward ref and or memorizing wrapper to a current react
     * component.
     */applyComponentWrapper(){if(typeof this.self.content==="string"||this.isWrapped)return;this.isWrapped=true;const wrapped=this.self.content.wrapped||this.self.content;if(this.self.content.webComponentAdapterWrapped){if(this.wrapMemorizingWrapper){this.self.content=__WEBPACK_EXTERNAL_MODULE_react_memo__(this.self.content);this.self.content.wrapped=wrapped}}else if(this.self.attachWebComponentAdapterIfNotExists){if(!this.self.content.displayName)this.self.content.displayName=this.self._name;this.self.content=__WEBPACK_EXTERNAL_MODULE_react_forwardRef__((properties,reference)=>{__WEBPACK_EXTERNAL_MODULE_react_useImperativeHandle__(reference,()=>({properties}),[properties]);return __WEBPACK_EXTERNAL_MODULE_react_createElement__(wrapped,properties)});if(this.wrapMemorizingWrapper||this.wrapMemorizingWrapper===null)this.self.content=__WEBPACK_EXTERNAL_MODULE_react_memo__(this.self.content);this.self.content.wrapped=wrapped;this.self.content.webComponentAdapterWrapped="react"}else if(this.wrapMemorizingWrapper){this.self.content=__WEBPACK_EXTERNAL_MODULE_react_memo__(this.self.content);this.self.content.wrapped=wrapped}}/**
     * Prepares a given properties object to render against the current
     * component. Creates a reference for being recognized of reacts internal
     * state updates.
     * @param properties - Properties to prepare.
     */prepareProperties(properties){__WEBPACK_EXTERNAL_MODULE_clientnode_extend__(properties,this.preparedSlots);this.self.removeKnownUnwantedPropertyKeys(this.self,properties);/*
            NOTE: Provide instance if and only if not explicitly requested from
            parent via properties.
        */if(!properties.ref){this.instance=__WEBPACK_EXTERNAL_MODULE_react_createRef__();properties.ref=reference=>{if(this.instance)this.instance.current=reference;else this.instance={current:reference};this.reflectInstanceProperties()}}}/**
     * Removes unwanted known and not specified properties from a given
     * properties object (usually added by dev-tools).
     * @param target - ReactElement where properties belong to.
     * @param properties - Properties object to trim.
     */static removeKnownUnwantedPropertyKeys(target,properties){if(typeof target.content==="string")return;// NOTE: Known root of errors caused by browser dev-tools.
for(const name of["isRoot","isTrusted","__composed"])if(Object.prototype.hasOwnProperty.call(properties,name)&&(Object.prototype.hasOwnProperty.call(target.content,"propTypes")&&!Object.prototype.hasOwnProperty.call(target.content.propTypes,name)||Object.prototype.hasOwnProperty.call(target.content,"wrapped")&&Object.prototype.hasOwnProperty.call(target.content.wrapped,"propTypes")&&!Object.prototype.hasOwnProperty.call(target.content.wrapped.propTypes,name)))delete properties[name]}// endregion
}ReactWeb_defineProperty(ReactWeb,"attachWebComponentAdapterIfNotExists",true);ReactWeb_defineProperty(ReactWeb,"content","div");ReactWeb_defineProperty(ReactWeb,"react",__WEBPACK_EXTERNAL_MODULE_react_default__);ReactWeb_defineProperty(ReactWeb,"_name","ReactWebComponent");const ReactWeb_api=(/* unused pure expression or super */ null && ({component:ReactWeb,register:(tagName=ReactWeb_camelCaseToDelimited(ReactWeb._name))=>{customElements.define(tagName,ReactWeb)}}));/* harmony default export */ const src_ReactWeb = (ReactWeb);
;// ./src/index.ts
/* unused harmony import specifier */ var propertyImport;
/* unused harmony import specifier */ var reactWebAPIImport;
/* unused harmony import specifier */ var webAPIImport;
/* unused harmony import specifier */ var WebImport;
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module index *//* !
    region header
    [Project page](https://tsickert.com/web-component-wrapper)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
    endregion
*/// region imports
function src_defineProperty(r,t,o){return(t=src_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function src_toPropertyKey(r){var o=src_toPrimitive(r,"string");return"symbol"==typeof o?o:o+""}function src_toPrimitive(t,e){if("object"!=typeof t||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)};// endregion
const src_property=(/* unused pure expression or super */ null && (propertyImport));const src_ReactWeb_0=src_ReactWeb;const reactWebAPI=(/* unused pure expression or super */ null && (reactWebAPIImport));const webAPI=(/* unused pure expression or super */ null && (webAPIImport));const src_Web_0=(/* unused pure expression or super */ null && (WebImport));/**
 * Wraps given react component as web component.
 * @param component - React component to wrap.
 * @param nameHint - A name to set as property in runtime generated web
 * component class.
 * @param configuration - Additional web component configurations.
 * @returns Generated object to register and retrieve generated web component.
 */const wrapAsWebComponent=(component,nameHint="NoName",configuration={})=>{// Determine class / function name.
const name=component._name||// NOTE: Not minifyable save: "component.name ||"
/*
            NOTE: There exists babel plugins which reflects component name and
            member variables under this property. Try to respect these.
        */component.___types?.name?.name||nameHint.replace(/^(.*\/+)?([^/]+)\.tsx$/,"$2");if(configuration.propTypes)component.propTypes=configuration.propTypes;const propertyTypes=component.propTypes||{};const propertyAliases=configuration.propertyAliases||component.propertyAliases||{};const allPropertyNames=__WEBPACK_EXTERNAL_MODULE_clientnode_unique__(Object.keys(propertyTypes).concat(Object.keys(propertyAliases)).concat(Object.values(propertyAliases)));// NOTE: We extend given configuration properties by base class defined.
let propertiesToReflectAsAttributes=configuration.propertiesToReflectAsAttributes||component.propertiesToReflectAsAttributes||[];if(src_ReactWeb_0.propertiesToReflectAsAttributes)if(Array.isArray(propertiesToReflectAsAttributes))propertiesToReflectAsAttributes=[...src_ReactWeb_0.propertiesToReflectAsAttributes,...propertiesToReflectAsAttributes];else if(propertiesToReflectAsAttributes instanceof Map)for(const name of src_ReactWeb_0.propertiesToReflectAsAttributes)propertiesToReflectAsAttributes.set(name,src_ReactWeb_0.propertyTypes[name]);else if(typeof propertiesToReflectAsAttributes==="object")for(const name of src_ReactWeb_0.propertiesToReflectAsAttributes)propertiesToReflectAsAttributes[name]=src_ReactWeb_0.propertyTypes[name];const attributeNames=allPropertyNames.map(name=>__WEBPACK_EXTERNAL_MODULE_clientnode_camelCaseToDelimited__(name));/**
     * Runtime generated web component.
     */class ConcreteComponent extends src_ReactWeb_0{constructor(...args){super(...args);src_defineProperty(this,"self",ConcreteComponent);src_defineProperty(this,"internalProperties",configuration.internalProperties?{...configuration.internalProperties}:component.internalProperties?{...component.internalProperties}:{});src_defineProperty(this,"unmountOnDisconnect",configuration.unmountOnDisconnect??true)}}src_defineProperty(ConcreteComponent,"attachWebComponentAdapterIfNotExists",typeof configuration.attachWebComponentAdapterIfNotExists==="boolean"?configuration.attachWebComponentAdapterIfNotExists:true);src_defineProperty(ConcreteComponent,"content",component);src_defineProperty(ConcreteComponent,"observedAttributes",src_ReactWeb_0.observedAttributes.concat(attributeNames)// NOTE: Respect pre-evaluation indicator attributes.
.concat(attributeNames.map(name=>`-${name}`)));src_defineProperty(ConcreteComponent,"controllableProperties",component.controllableProperties||configuration.controllableProperties||[]);src_defineProperty(ConcreteComponent,"eventToPropertyMapping",configuration.eventToPropertyMapping===null?configuration.eventToPropertyMapping:configuration.eventToPropertyMapping?{...configuration.eventToPropertyMapping}:component.eventToPropertyMapping===null?component.eventToPropertyMapping:component.eventToPropertyMapping?{...component.eventToPropertyMapping}:{});src_defineProperty(ConcreteComponent,"propertyAliases",{...src_ReactWeb_0.propertyAliases,...propertyAliases});src_defineProperty(ConcreteComponent,"propertiesToReflectAsAttributes",propertiesToReflectAsAttributes);src_defineProperty(ConcreteComponent,"propertyTypes",{...src_ReactWeb_0.propertyTypes,...propertyTypes});src_defineProperty(ConcreteComponent,"renderProperties",configuration.renderProperties??component.renderProperties??src_ReactWeb_0.renderProperties);src_defineProperty(ConcreteComponent,"_name",name);const webComponentAPI={component:ConcreteComponent,register:(tagName=__WEBPACK_EXTERNAL_MODULE_clientnode_camelCaseToDelimited__(name))=>{customElements.define(tagName,ConcreteComponent)}};return webComponentAPI};/* harmony default export */ const src = (wrapAsWebComponent);
;// ./src/test.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/* !
    region header
    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
    endregion
*/// region imports
function test_defineProperty(r,t,o){return(t=test_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function test_toPropertyKey(r){var o=test_toPrimitive(r,"string");return"symbol"==typeof o?o:o+""}function test_toPrimitive(t,e){if("object"!=typeof t||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)};// endregion
// region helper
let tagNameCounter=0;/**
 * Registers given component class under a unique tag name and creates an
 * (unconnected) instance of it.
 * @param type - Component class to instantiate.
 * @returns Created instance.
 */const createInstance=type=>{tagNameCounter+=1;const tagName=`test-instance-${String(tagNameCounter)}`;customElements.define(tagName,type);return document.createElement(tagName)};/**
 * Silences and returns a spy on the web component logger's warn method.
 * @returns Created spy.
 */const mockWarn=()=>__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_jest__.spyOn(log,"warn").mockImplementation(()=>Promise.resolve());__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_afterEach__(()=>{__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_jest__.restoreAllMocks()});// endregion
// region Web
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_describe__("Web",()=>{__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("constructor",()=>{/**
         * Mock Test class.
         */class WebTest extends src_Web{}test_defineProperty(WebTest,"observedAttributes",["is-root","on-click","on-event"]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(WebTest).toHaveProperty("content");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(WebTest).toHaveProperty("observedAttributes");customElements.define("test-web",WebTest);const web=document.createElement("test-web");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web).not.toHaveProperty("clicked");web.setAttribute("on-click","this.clicked = true");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web).not.toHaveProperty("clicked");document.body.appendChild(web);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web).toHaveProperty("rootInstance",web);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web).not.toHaveProperty("clicked");web.onClick();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web).toHaveProperty("clicked",true);const clickCallback=__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_jest__.fn();web.addEventListener("click",clickCallback);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(clickCallback).not.toHaveBeenCalled();web.onClick();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(clickCallback).toHaveBeenCalled()});/// region static helper
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("hasCode",()=>{__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode(undefined)).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode(null)).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode(1)).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode({})).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode("")).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode("plain text")).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode("${ without end")).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode("end without start }")).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode("} wrong order ${")).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode("${}")).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode("${a}")).toStrictEqual(true);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode("Hello ${name}!")).toStrictEqual(true);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.hasCode("${\n    a\n}")).toStrictEqual(true)});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("normalizePropertyTypeList",()=>{__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.normalizePropertyTypeList("isRoot")).toStrictEqual(new Map([["isRoot",__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__]]));__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.normalizePropertyTypeList(["isRoot","unknown"])).toStrictEqual(new Map([["isRoot",__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__]]));__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.normalizePropertyTypeList([])).toStrictEqual(new Map);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_Web.normalizePropertyTypeList({a:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__,b:"number"})).toStrictEqual(new Map([["a",__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__],["b","number"]]))});/// endregion
/// region properties
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("generateAliasIndex/getPropertyAlias",()=>{/**
         * Mock test class.
         */class AliasWeb extends src_Web{}test_defineProperty(AliasWeb,"propertyAliases",{alternateName:"name"});test_defineProperty(AliasWeb,"propertyTypes",{...src_Web.propertyTypes,name:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__});const web=createInstance(AliasWeb);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(AliasWeb._propertyAliasIndex).toStrictEqual({alternateName:"name",name:"alternateName"});// Source configuration should not be touched.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(AliasWeb.propertyAliases).toStrictEqual({alternateName:"name"});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.getPropertyAlias("alternateName")).toStrictEqual("name");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.getPropertyAlias("name")).toStrictEqual("alternateName");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.getPropertyAlias("unknown")).toBeNull();// Inherited object properties should not be interpreted as alias.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.getPropertyAlias("toString")).toBeNull()});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("set(Internal|External)PropertyValue",()=>{/**
         * Mock test class.
         */class AliasWeb extends src_Web{}test_defineProperty(AliasWeb,"propertyAliases",{alternateName:"name"});const web=createInstance(AliasWeb);web.setExternalPropertyValue("name","external");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.externalProperties).toHaveProperty("name","external");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.externalProperties).toHaveProperty("alternateName","external");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.internalProperties).not.toHaveProperty("name");web.setInternalPropertyValue("alternateName","internal");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.internalProperties).toHaveProperty("name","internal");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.internalProperties).toHaveProperty("alternateName","internal");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.externalProperties).toHaveProperty("name","external");web.setInternalPropertyValue("other",1);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.internalProperties).toHaveProperty("other",1);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.internalProperties).not.toHaveProperty("alternateOther")});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("getPropertyValue/isStateProperty",()=>{const web=createInstance(class extends src_Web{});web.setInternalPropertyValue("internal","internal");web.setExternalPropertyValue("internal","shadowed");web.setExternalPropertyValue("external","external");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.getPropertyValue("internal")).toStrictEqual("internal");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.getPropertyValue("external")).toStrictEqual("external");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.getPropertyValue("unknown")).toBeUndefined();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.isStateProperty("internal")).toStrictEqual(false);const onClick=()=>{// Do nothing.
};web.setInternalPropertyValue("onClick",onClick);web.instance={current:{properties:{internal:"wrapped"},state:{modelState:{model:"model"},state:"state"}}};// Wrapped component properties should win.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.getPropertyValue("internal")).toStrictEqual("wrapped");// State should win over everything.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.getPropertyValue("state")).toStrictEqual("state");// Base properties should not be shadowed.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.getPropertyValue("onClick")).toStrictEqual(onClick);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.isStateProperty("state")).toStrictEqual(true);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.isStateProperty("model")).toStrictEqual(true);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.isStateProperty("internal")).toStrictEqual(false)});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("evaluateStringOrNullAndSetAsProperty",()=>{/**
         * Mock test class.
         */class AttributeWeb extends src_Web{}test_defineProperty(AttributeWeb,"propertyAliases",{alternateLabel:"label"});test_defineProperty(AttributeWeb,"propertyTypes",{...src_Web.propertyTypes,config:"json",count:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__,data:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_object__,flag:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__,label:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__,onSelect:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_func__});const web=createInstance(AttributeWeb);const set=(name,value)=>{web.evaluateStringOrNullAndSetAsProperty(name,value)};const internal=web.internalProperties;const external=web.externalProperties;const warn=mockWarn();// Unknown properties are ignored.
set("unknown","value");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).not.toHaveProperty("unknown");// region boolean
set("flag","");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("flag",true);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(external).toHaveProperty("flag",true);set("flag","false");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("flag",false);set("flag","true");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("flag",true);set("flag",null);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("flag",false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(external).toHaveProperty("flag",false);// endregion
// region number
set("count","2.5");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("count",2.5);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(external).toHaveProperty("count",2.5);set("count","not a number");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("count",undefined);set("count",null);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("count",null);// endregion
// region string
set("label","text");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("label","text");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(external).toHaveProperty("label","text");set("label",null);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("label",null);// Attribute names are converted and aliases are respected.
set("alternate-label","aliased");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("label","aliased");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("alternateLabel","aliased");// endregion
// region json
set("config","{\"a\": {\"b\": 1}}");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("config",{a:{b:1}});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(external).toHaveProperty("config",{a:{b:1}});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(external.config).not.toBe(internal.config);set("config","");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("config",null);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(external).toHaveProperty("config",null);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(warn).not.toHaveBeenCalled();set("config","{invalid");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(warn).toHaveBeenCalledTimes(1);// Previous value is kept.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("config",null);// endregion
// region evaluated (default)
set("data","[1, 2]");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("data",[1,2]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(external).toHaveProperty("data",[1,2]);set("data",null);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("data",null);web.setAttribute("data","");set("data","");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("data",true);web.removeAttribute("data");set("data","(");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(warn).toHaveBeenCalledTimes(2);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("data",true);// endregion
// region pre-evaluation
set("-count","1 + 2");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("count",3);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(external).toHaveProperty("count",3);// Pre-evaluated strings are not interpreted as numbers.
set("-label","`a` + `b`");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("label","ab");// Empty pre-evaluation values are ignored.
set("-count","");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("count",3);set("-count","(");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(warn).toHaveBeenCalledTimes(3);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(internal).toHaveProperty("count",undefined);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(external).toHaveProperty("count",3);// endregion
});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("evaluateStringOrNullAndSetAsProperty (function)",()=>{/**
         * Mock test class.
         */class HandlerWeb extends src_Web{}test_defineProperty(HandlerWeb,"propertyTypes",{...src_Web.propertyTypes,onSelect:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_func__});const web=createInstance(HandlerWeb);const getHandler=()=>web.internalProperties.onSelect;const selectCallback=__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_jest__.fn();web.addEventListener("select",selectCallback);const warn=mockWarn();web.evaluateStringOrNullAndSetAsProperty("on-select","this.selected = event");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.externalProperties).toHaveProperty("onSelect",__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__.any(Function));__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web).not.toHaveProperty("selected");getHandler()("value","second");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web).toHaveProperty("selected","value");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(selectCallback).toHaveBeenCalledTimes(1);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(selectCallback.mock.calls[0][0]).toHaveProperty("detail.parameters",["value","second"]);// A runtime error is caught and the event is still forwarded.
web.evaluateStringOrNullAndSetAsProperty("on-select","event.not.existing");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(getHandler()(undefined)).toBeUndefined();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(warn).toHaveBeenCalledTimes(1);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(selectCallback).toHaveBeenCalledTimes(2);// A compile error is reported and external property is left as is.
const externalHandler=web.externalProperties.onSelect;web.evaluateStringOrNullAndSetAsProperty("on-select","(");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(warn).toHaveBeenCalledTimes(2);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.externalProperties).toHaveProperty("onSelect",externalHandler);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(getHandler()()).toBeUndefined();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(selectCallback).toHaveBeenCalledTimes(3)});/// endregion
/// region events
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("forwardEvent",()=>{const web=createInstance(class extends src_Web{});const callbacks={};for(const name of["fooBar","on","onX","plain"]){callbacks[name]=__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_jest__.fn();web.addEventListener(name,callbacks[name])}__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.forwardEvent("onFooBar",[1,2])).toStrictEqual(true);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(callbacks.fooBar).toHaveBeenCalledTimes(1);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(callbacks.fooBar.mock.calls[0][0]).toHaveProperty("detail.parameters",[1,2]);// Too short names are not interpreted as handler names.
web.forwardEvent("on",[]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(callbacks.on).toHaveBeenCalledTimes(1);web.forwardEvent("onX",[]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(callbacks.onX).toHaveBeenCalledTimes(1);web.forwardEvent("plain",[]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(callbacks.plain).toHaveBeenCalledTimes(1);web.addEventListener("plain",event=>{event.preventDefault()});// Not cancelable events can not be prevented.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.forwardEvent("plain",[])).toStrictEqual(true)});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("addSecureEventListener/unregisterDomNodeEventBindings",()=>{const web=createInstance(class extends src_Web{});const domNode=document.createElement("div");const firstHandler=__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_jest__.fn();const deregister=web.addSecureEventListener(domNode,"click",firstHandler);domNode.dispatchEvent(new Event("click"));__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(firstHandler).toHaveBeenCalledTimes(1);deregister();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.domNodeEventBindings.size).toStrictEqual(0);domNode.dispatchEvent(new Event("click"));__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(firstHandler).toHaveBeenCalledTimes(1);const focusHandler=__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_jest__.fn();web.addSecureEventListener(domNode,"focus",focusHandler);web.addSecureEventListener(window,"resize",focusHandler);// A new handler for the same event replaces the old one.
web.addSecureEventListener(domNode,"click",firstHandler);const secondHandler=__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_jest__.fn();web.addSecureEventListener(domNode,"click",secondHandler);domNode.dispatchEvent(new Event("click"));__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(firstHandler).toHaveBeenCalledTimes(1);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(secondHandler).toHaveBeenCalledTimes(1);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.domNodeEventBindings.get(domNode)?.size).toStrictEqual(2);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.domNodeEventBindings.size).toStrictEqual(2);web.unregisterDomNodeEventBindings();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.domNodeEventBindings.size).toStrictEqual(0);domNode.dispatchEvent(new Event("click"));domNode.dispatchEvent(new Event("focus"));window.dispatchEvent(new Event("resize"));__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(secondHandler).toHaveBeenCalledTimes(1);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(focusHandler).not.toHaveBeenCalled();// Replacing the only handler of a node keeps it registered.
const outdatedDeregister=web.addSecureEventListener(domNode,"click",firstHandler);web.addSecureEventListener(domNode,"click",secondHandler);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.domNodeEventBindings.get(domNode)?.size).toStrictEqual(1);// Outdated deregister functions do not affect their successor.
outdatedDeregister();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.domNodeEventBindings.get(domNode)?.size).toStrictEqual(1);web.unregisterDomNodeEventBindings();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.domNodeEventBindings.size).toStrictEqual(0);domNode.dispatchEvent(new Event("click"));__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(firstHandler).toHaveBeenCalledTimes(1);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(secondHandler).toHaveBeenCalledTimes(1)});/// endregion
/// region templates
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("evaluateDomNodeTemplate",()=>{const web=createInstance(class extends src_Web{});const domNode=document.createElement("div");domNode.innerHTML="Hello ${name}!<span>${name.length}</span><x-nested>${name}"+"</x-nested><p>static</p>";web.evaluateDomNodeTemplate(domNode,{name:"World"});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(domNode.innerHTML).toStrictEqual("Hello World!<span>5</span><x-nested>${name}</x-nested>"+"<p>static</p>");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.domNodeTemplateCache.has(domNode)).toStrictEqual(true);// Compiled templates are cached and therefore re-evaluable.
web.evaluateDomNodeTemplate(domNode,{name:"you"});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(domNode.innerHTML).toStrictEqual("Hello you!<span>3</span><x-nested>${name}</x-nested>"+"<p>static</p>");// A separate cache leads to a fresh compilation.
const otherDomNode=document.createElement("div");otherDomNode.innerHTML="<span>${a}</span>${a}";const domNodeTemplateCache=new Map;web.evaluateDomNodeTemplate(otherDomNode,{a:"b"},{domNodeTemplateCache,filter:domNode=>domNode.nodeName!=="SPAN"});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(otherDomNode.innerHTML).toStrictEqual("<span>${a}</span>b");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(domNodeTemplateCache.has(otherDomNode)).toStrictEqual(true);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.domNodeTemplateCache.has(otherDomNode)).toStrictEqual(false);// Nested components can be traversed explicitly.
const nestedDomNode=document.createElement("div");nestedDomNode.innerHTML="<x-nested>${a}</x-nested>";web.evaluateDomNodeTemplate(nestedDomNode,{a:"b"},{ignoreNestedComponents:false});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(nestedDomNode.innerHTML).toStrictEqual("<x-nested>b</x-nested>");// Given components itself are ignored by default.
const componentDomNode=document.createElement("x-component");componentDomNode.innerHTML="${a}";web.evaluateDomNodeTemplate(componentDomNode,{a:"b"});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(componentDomNode.innerHTML).toStrictEqual("${a}")});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("evaluateDomNodeTemplate (unsafe)",()=>{const web=createInstance(class extends src_Web{});const domNode=document.createElement("div");domNode.innerHTML="<b>${name}</b>";web.evaluateDomNodeTemplate(domNode,{name:"<i>markup</i>"},{unsafe:true});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(domNode.innerHTML).toStrictEqual("<b><i>markup</i></b>");// Safe rendering escapes markup.
const safeDomNode=document.createElement("div");safeDomNode.innerHTML="<b>${name}</b>";web.evaluateDomNodeTemplate(safeDomNode,{name:"<i>markup</i>"});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(safeDomNode.innerHTML).toStrictEqual("<b>&lt;i&gt;markup&lt;/i&gt;</b>");// Nodes without code are not compiled in unsafe mode.
const plainDomNode=document.createElement("div");plainDomNode.innerHTML="<b>plain</b>";__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.compileDomNodeTemplate(plainDomNode,[],{unsafe:true})).toBeNull();// Grabbed templates are used when no content exists.
const templateDomNode=document.createElement("div");templateDomNode.template="${a}";__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.compileDomNodeTemplate(templateDomNode,["a"],{unsafe:true})).toHaveProperty("template","${a}")});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("evaluateCompiledDomNodeTemplate",()=>{const web=createInstance(class extends src_Web{});const domNode=document.createTextNode("");const item=properties=>({domNode,children:[],...properties});const warn=mockWarn();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.evaluateCompiledDomNodeTemplate(item({}),{})).toBeNull();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.evaluateCompiledDomNodeTemplate(item({templateFunction:()=>"a"}),{})).toBeNull();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.evaluateCompiledDomNodeTemplate(item({scopeNames:["a","b"],templateFunction:(...parameters)=>parameters.join("-")}),{a:"A",b:"B",c:"C"})).toStrictEqual("A-B");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(warn).not.toHaveBeenCalled();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.evaluateCompiledDomNodeTemplate(item({error:"compile error",scopeNames:[],templateFunction:()=>"a"}),{})).toBeNull();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(warn).toHaveBeenCalledTimes(1);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.evaluateCompiledDomNodeTemplate(item({scopeNames:[],templateFunction:()=>{throw new Error("runtime error")}}),{})).toBeNull();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(warn).toHaveBeenCalledTimes(2)});/// endregion
/// region slots
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("grabGivenSlots",()=>{const web=createInstance(class extends src_Web{});web.innerHTML="<div slot=\"header\">Header</div>"+"<x-nested><div slot=\"inner\">Inner</div></x-nested>"+"<span> Default </span>";web.grabGivenSlots();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.slots.header).toBe(web.firstChild);// Slots of nested components are left to them.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.slots).not.toHaveProperty("inner");// Without explicit default slot all children are used.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.slots.default).toStrictEqual(Array.from(web.childNodes));const explicitWeb=createInstance(class extends src_Web{});explicitWeb.innerHTML="<div slot=\"default\">Default</div><span>Other</span>";explicitWeb.grabGivenSlots();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(explicitWeb.slots.default).toStrictEqual([explicitWeb.firstChild]);const emptyWeb=createInstance(class extends src_Web{});emptyWeb.grabGivenSlots();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(emptyWeb.slots).toStrictEqual({default:[]})});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("grabSlotContent",()=>{var _Class;const web=createInstance(class extends src_Web{});const templateSlot=document.createElement("div");templateSlot.className="web-component-template";templateSlot.innerHTML="<textarea>${name}</textarea>";const grabbed=web.grabSlotContent(templateSlot);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(grabbed).not.toBe(templateSlot);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(grabbed).toHaveProperty("template","${name}");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(grabbed.innerHTML).toStrictEqual("");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(grabbed.classList.contains("web-component-template")).toStrictEqual(false);// Source node is untouched to allow re-instantiation.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(templateSlot.classList.contains("web-component-template")).toStrictEqual(true);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(templateSlot.innerHTML).toStrictEqual("<textarea>${name}</textarea>");templateSlot.firstElementChild?.setAttribute("data-no-template","false");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.grabSlotContent(templateSlot)).toHaveProperty("template","${name}");templateSlot.firstElementChild?.setAttribute("data-no-template","");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.grabSlotContent(templateSlot)).toBe(templateSlot);const plainSlot=document.createElement("div");plainSlot.innerHTML="<span>content</span>";__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.grabSlotContent(plainSlot)).toBe(plainSlot);const textSlot=document.createTextNode("text");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.grabSlotContent(textSlot)).toBe(textSlot);const cloningWeb=createInstance((_Class=class extends src_Web{},test_defineProperty(_Class,"cloneSlots",true),_Class));const cloned=cloningWeb.grabSlotContent(plainSlot);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(cloned).not.toBe(plainSlot);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(cloned.isEqualNode(plainSlot)).toStrictEqual(true)});/// endregion
/// region render
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("determineRenderScope",()=>{var _Class2,_Class3;const web=createInstance((_Class2=class extends src_Web{},test_defineProperty(_Class2,"_name","ScopeTest"),_Class2));web.setInternalPropertyValue("internal","value");web.determineRenderScope({given:"given"});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.scope).toHaveProperty("given","given");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.scope).toHaveProperty("internal","value");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.scope).toHaveProperty("self",web);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.scope).toHaveProperty("scopeTest",web);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.scope).toHaveProperty("rootInstance",web);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(web.scope.scope).toBe(web.scope);const child=createInstance((_Class3=class extends src_Web{},test_defineProperty(_Class3,"_name",""),_Class3));child.parentInstance=web;child.determineRenderScope();// Parent scope is inherited.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(child.scope).toHaveProperty("given","given");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(child.scope).toHaveProperty("parentInstance",web);// Fallback name.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(child.scope).toHaveProperty("instance",child);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(child.scope).toHaveProperty("self",child)});/// endregion
});// endregion
// region ReactWeb
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_describe__("ReactWeb",()=>{__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("constructor",async()=>{let triggerOnEvent;let componentProperty="initial";const component=({onEvent,property=componentProperty})=>{/*
                eslint-enable @typescript-eslint/no-useless-default-assignment
            */triggerOnEvent=onEvent;componentProperty=property;return __WEBPACK_EXTERNAL_MODULE_react_createElement__("div",{className:property})};/**
         * Mock test class.
         */class TestReactWeb extends src_ReactWeb{constructor(...args){super(...args);test_defineProperty(this,"self",TestReactWeb)}}test_defineProperty(TestReactWeb,"_name","Test");test_defineProperty(TestReactWeb,"content",component);test_defineProperty(TestReactWeb,"observedAttributes",["is-root","on-click","on-event"]);test_defineProperty(TestReactWeb,"propertyTypes",{...src_Web.propertyTypes,onEvent:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_func__,property:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(TestReactWeb).toHaveProperty("content");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(TestReactWeb).toHaveProperty("observedAttributes");customElements.define("test-react",TestReactWeb);const react=document.createElement("test-react");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(react).not.toHaveProperty("clicked");react.setAttribute("on-click","this.clicked = true");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(react).toHaveProperty("onClick");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(react).not.toHaveProperty("clicked");react.setAttribute("on-event","this.eventHappened = true");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(react).toHaveProperty("onEvent");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(triggerOnEvent).not.toBeDefined();document.body.appendChild(react);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(react).toHaveProperty("rootInstance",react);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(react).toHaveProperty("reactRoot");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(triggerOnEvent).not.toBeDefined();await __WEBPACK_EXTERNAL_MODULE_clientnode_timeout__();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(triggerOnEvent).toBeDefined();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(react).not.toHaveProperty("eventHappened");if(triggerOnEvent)triggerOnEvent();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(react).toHaveProperty("eventHappened",true);const eventCallback=__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_jest__.fn();react.addEventListener("event",eventCallback);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(eventCallback).not.toHaveBeenCalled();if(triggerOnEvent)triggerOnEvent();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(eventCallback).toHaveBeenCalled();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(react).not.toHaveProperty("clicked");react.onClick();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(react).toHaveProperty("clicked",true);const clickCallback=__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_jest__.fn();react.addEventListener("click",clickCallback);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(clickCallback).not.toHaveBeenCalled();react.onClick();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(clickCallback).toHaveBeenCalled();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(componentProperty).toStrictEqual("initial");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(document.querySelector("div")?.className).toStrictEqual("initial");react.property="test";await __WEBPACK_EXTERNAL_MODULE_clientnode_timeout__();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(react).toHaveProperty("property","test");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(document.querySelector("div")?.className).toStrictEqual("test")});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("isReactComponent",()=>{const domNode=type=>({constructor:type});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_ReactWeb.isReactComponent(domNode({content:"template"}))).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_ReactWeb.isReactComponent(domNode({content:()=>null}))).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_ReactWeb.isReactComponent(domNode({content:{}}))).toStrictEqual(true);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_ReactWeb.isReactComponent(domNode({attachWebComponentAdapterIfNotExists:true,content:{}}))).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src_ReactWeb.isReactComponent(domNode({attachWebComponentAdapterIfNotExists:true,content:{webComponentAdapterWrapped:"react"}}))).toStrictEqual(true)});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("removeKnownUnwantedPropertyKeys",()=>{const remove=(content,properties)=>{src_ReactWeb.removeKnownUnwantedPropertyKeys({content},properties);return properties};const properties=()=>({__composed:true,isRoot:true,isTrusted:true,other:1});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(remove("template",properties())).toStrictEqual(properties());// Without any type information nothing is known to be unwanted.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(remove({},properties())).toStrictEqual(properties());__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(remove({propTypes:{}},properties())).toStrictEqual({other:1});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(remove({propTypes:{isRoot:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__}},properties())).toStrictEqual({isRoot:true,other:1});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(remove({wrapped:{propTypes:{isTrusted:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__}}},properties())).toStrictEqual({isTrusted:true,other:1});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(remove({wrapped:{}},properties())).toStrictEqual(properties())})});// endregion
// region decorator
/* eslint-disable @typescript-eslint/no-extraneous-class */__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_describe__("decorator",()=>{__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("property (attribute reading and types)",()=>{/**
         * Mock base class.
         */class Base{}/**
         * Mock test class.
         */test_defineProperty(Base,"observedAttributes",["base"]);test_defineProperty(Base,"propertyTypes",{base:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__});class Target extends Base{}test_defineProperty(Target,"existing",1);decorator()(Target.prototype,"fooBar");decorator({type:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__})(Target.prototype,"count");decorator({readAttribute:false,type:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__})(Target.prototype,"hidden");// Duplicates are not added twice.
decorator()(Target.prototype,"fooBar");// Symbols are ignored.
decorator()(Target.prototype,Symbol("symbol"));__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Target.observedAttributes).toStrictEqual(["base","foo-bar","count"]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Target.propertyTypes).toStrictEqual({base:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__,count:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__,fooBar:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__,hidden:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__});// Parent configurations stay untouched.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Base.observedAttributes).toStrictEqual(["base"]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Base.propertyTypes).toStrictEqual({base:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__});// Existing static members are only overwritten via "update".
decorator({type:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__})(Target.prototype,"existing");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Target.propertyTypes).not.toHaveProperty("existing");decorator({type:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__,update:true})(Target.prototype,"existing");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Target.propertyTypes).toHaveProperty("existing",__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__);// Members every class owns do not count as existing static members.
decorator({alias:"title",writeAttribute:true})(Target.prototype,"name");decorator({type:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__})(Target.prototype,"length");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Target.propertyTypes).toHaveProperty("name",__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Target.propertyTypes).toHaveProperty("length",__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Target).toHaveProperty("propertiesToReflectAsAttributes",["name"]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Target).toHaveProperty("propertyAliases",{name:"title"});// Explicitly given "self" references are respected.
/**
         * Mock self class.
         */class Self{}decorator({type:undefined})({self:Self},"viaSelf");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Self).toHaveProperty("observedAttributes",["via-self"]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Self).not.toHaveProperty("propertyTypes")});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("property (attribute writing and aliases)",()=>{/**
         * Mock array based class.
         */class ArrayTarget{}test_defineProperty(ArrayTarget,"propertiesToReflectAsAttributes",["base"]);test_defineProperty(ArrayTarget,"propertyAliases",{base:"alternateBase"});decorator({writeAttribute:true})(ArrayTarget.prototype,"label");decorator({update:true,writeAttribute:true})(ArrayTarget.prototype,"label");decorator({alias:"alternateName"})(ArrayTarget.prototype,"other");// NOTE: Strict equality also ensures no named array properties.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(ArrayTarget.propertiesToReflectAsAttributes).toStrictEqual(["base","label"]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(ArrayTarget.propertyAliases).toStrictEqual({base:"alternateBase",other:"alternateName"});/**
         * Mock map based class.
         */class MapTarget{}// Explicitly given types convert lists to maps.
test_defineProperty(MapTarget,"normalizePropertyTypeList",value=>src_Web.normalizePropertyTypeList(value));test_defineProperty(MapTarget,"propertiesToReflectAsAttributes",["isRoot"]);decorator({writeAttribute:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__})(MapTarget.prototype,"count");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(MapTarget.propertiesToReflectAsAttributes).toBeInstanceOf(Map);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Array.from(MapTarget.propertiesToReflectAsAttributes.entries())).toStrictEqual([["isRoot",__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__],["count",__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__]]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(MapTarget.propertiesToReflectAsAttributes).not.toHaveProperty("count");/**
         * Mock object based class.
         */class ObjectTarget{}test_defineProperty(ObjectTarget,"propertiesToReflectAsAttributes",{base:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__});decorator({type:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__,writeAttribute:true})(ObjectTarget.prototype,"flag");decorator({writeAttribute:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_string__})(ObjectTarget.prototype,"flag");decorator({update:true,writeAttribute:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__})(ObjectTarget.prototype,"base");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(ObjectTarget.propertiesToReflectAsAttributes).toStrictEqual({base:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_number__,flag:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__});// Without type information nothing will be reflected.
/**
         * Mock untyped class.
         */class UntypedTarget{}decorator({type:undefined,writeAttribute:true})(UntypedTarget.prototype,"label");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(UntypedTarget).toHaveProperty("propertiesToReflectAsAttributes",[])})});/* eslint-enable @typescript-eslint/no-extraneous-class */// endregion
// region index
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_describe__("index",()=>{__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("wrapAsWebComponent",()=>{const componentAPI=src(()=>__WEBPACK_EXTERNAL_MODULE_react_createElement__("div"),"TestComponent",{eventToPropertyMapping:{},propertyAliases:{alternateName:"name"},propertiesToReflectAsAttributes:[],propTypes:{name:"string"}});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(componentAPI).toHaveProperty("component");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(componentAPI).toHaveProperty("register");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(componentAPI.component).toHaveProperty("_name","TestComponent");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(componentAPI.component).toHaveProperty("propertyTypes.name","string");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(componentAPI.component).toHaveProperty("propertiesToReflectAsAttributes",["isRoot"]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(componentAPI.component).toHaveProperty("eventToPropertyMapping",{});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(componentAPI.component.observedAttributes).toStrictEqual(__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__.arrayContaining(["name","alternate-name","-name","-alternate-name"]));__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(componentAPI.component.propertyAliases).toHaveProperty("alternateName","name")});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("wrapAsWebComponent (name determination)",()=>{const component=(properties={})=>Object.assign(()=>__WEBPACK_EXTERNAL_MODULE_react_createElement__("div"),properties);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src(component()).component).toHaveProperty("_name","NoName");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src(component(),"src/path/Hint.tsx").component).toHaveProperty("_name","Hint");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src(component(),"Hint.tsx").component).toHaveProperty("_name","Hint");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src(component(),"Hint.ts").component).toHaveProperty("_name","Hint.ts");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src(component({___types:{name:{name:"Typed"}}}),"Hint").component).toHaveProperty("_name","Typed");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(src(component({_name:"Explicit",___types:{name:{name:"Typed"}}}),"Hint").component).toHaveProperty("_name","Explicit")});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("wrapAsWebComponent (configuration merging)",()=>{const component=Object.assign(()=>__WEBPACK_EXTERNAL_MODULE_react_createElement__("div"),{controllableProperties:["value"],eventToPropertyMapping:{onChange:()=>null},internalProperties:{internal:"component"},propTypes:{value:"string"},propertiesToReflectAsAttributes:new Map([["value","string"]]),renderProperties:["render"]});const ConcreteComponent=src(component).component;__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(ConcreteComponent.controllableProperties).toStrictEqual(["value"]);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(ConcreteComponent.eventToPropertyMapping).toStrictEqual(component.eventToPropertyMapping);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(ConcreteComponent.eventToPropertyMapping).not.toBe(component.eventToPropertyMapping);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(ConcreteComponent.renderProperties).toStrictEqual(["render"]);// Base class reflected properties are added to given maps.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(Array.from(ConcreteComponent.propertiesToReflectAsAttributes.entries())).toStrictEqual([["value","string"],["isRoot",__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__]]);const ConfiguredComponent=src(component,"Configured",{attachWebComponentAdapterIfNotExists:false,eventToPropertyMapping:null,internalProperties:{internal:"configuration"},propertiesToReflectAsAttributes:{value:"string"},renderProperties:[]}).component;__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(ConfiguredComponent.attachWebComponentAdapterIfNotExists).toStrictEqual(false);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(ConfiguredComponent.eventToPropertyMapping).toBeNull();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(ConfiguredComponent.renderProperties).toStrictEqual([]);// Base class reflected properties are added to given objects.
__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(ConfiguredComponent.propertiesToReflectAsAttributes).toStrictEqual({isRoot:__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2_boolean__,value:"string"});const NullComponent=src(Object.assign(()=>__WEBPACK_EXTERNAL_MODULE_react_createElement__("div"),{eventToPropertyMapping:null})).component;__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(NullComponent.eventToPropertyMapping).toBeNull();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(NullComponent.attachWebComponentAdapterIfNotExists).toStrictEqual(true);__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(NullComponent.renderProperties).toStrictEqual(src_ReactWeb.renderProperties)});__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_test__("wrapAsWebComponent (register)",()=>{const component=()=>__WEBPACK_EXTERNAL_MODULE_react_createElement__("div");src(component,"RegisterTest").register();__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(customElements.get("register-test")).toBeDefined();src(component,"RegisterTest").register("custom-tag");__WEBPACK_EXTERNAL_MODULE__jest_globals_d700ac6c_expect__(customElements.get("custom-tag")).toBeDefined()})});//  endregion
