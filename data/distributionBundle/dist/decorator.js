if(typeof window==='undefined'||window===null)var window=(typeof globalThis==='undefined'||globalThis===null)?{}:globalThis;import * as __WEBPACK_EXTERNAL_MODULE_clientnode__ from "clientnode";
import * as __WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2__ from "clientnode/property-types";
import * as __WEBPACK_EXTERNAL_MODULE_core_js_modules_es_array_push_js_baa3ea94__ from "core-js/modules/es.array.push.js";
import * as __WEBPACK_EXTERNAL_MODULE_core_js_modules_es_map_get_or_insert_computed_js_7751ea4f__ from "core-js/modules/es.map.get-or-insert-computed.js";
import * as __WEBPACK_EXTERNAL_MODULE_core_js_modules_es_map_get_or_insert_js_7d374552__ from "core-js/modules/es.map.get-or-insert.js";
/******/ var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["camelCaseToDelimited"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.camelCaseToDelimited), ["copy"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.copy) });

/***/ }),
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({  });

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({  });

/***/ }),
/* 3 */,
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({  });

/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["string"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode_property_types_4789ebe2__.string) });

/***/ })
/******/ ]);
/************************************************************************/
/******/ // The module cache
/******/ const __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	const cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	const module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ // define getter/value functions for harmony exports
/******/ __webpack_require__.d = (exports, definition) => {
/******/ 	for(var key in definition) {
/******/ 		if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 			Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 		}
/******/ 	}
/******/ };
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 
/************************************************************************/
/* harmony import */ var core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var core_js_modules_es_map_get_or_insert_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var core_js_modules_es_map_get_or_insert_computed_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var clientnode__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(0);
/* harmony import */ var clientnode_property_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
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
 */function property(options={}){options={readAttribute:true,type:clientnode_property_types__WEBPACK_IMPORTED_MODULE_4__.string,...options};/**
     * Registers given property to different property / attribute conversion
     * data structures.
     * NOTE: It is important to set static configuration properties on its
     * "own" properties instead of some inherited one. So we have to check via
     * "hasOwnProperty" for existence in this decorator.
     * @param target - Instance to apply given property to.
     * @param name - Field name to apply.
     */return function(target,name){if(typeof name!=="string")return;const self=target.self||target.constructor;if(options.readAttribute){if(!Object.prototype.hasOwnProperty.call(self,"observedAttributes"))self.observedAttributes=self.observedAttributes?[...self.observedAttributes]:[];const attributeName=(0,clientnode__WEBPACK_IMPORTED_MODULE_3__.camelCaseToDelimited)(name);if(self.observedAttributes&&!self.observedAttributes.includes(attributeName))self.observedAttributes.push(attributeName)}if(options.type){if(!Object.prototype.hasOwnProperty.call(self,"propertyTypes"))self.propertyTypes=self.propertyTypes?{...self.propertyTypes}:{};if(self.propertyTypes&&(options.update||!hasOwnStaticMember(self,name)))self.propertyTypes[name]=options.type}if(options.writeAttribute){if(!Object.prototype.hasOwnProperty.call(self,"propertiesToReflectAsAttributes"))self.propertiesToReflectAsAttributes=self.propertiesToReflectAsAttributes?(0,clientnode__WEBPACK_IMPORTED_MODULE_3__.copy)(self.propertiesToReflectAsAttributes):[];const reflectionConfiguration=self.propertiesToReflectAsAttributes;if(options.update||(reflectionConfiguration instanceof Map?!reflectionConfiguration.has(name):Array.isArray(reflectionConfiguration)?!reflectionConfiguration.includes(name):typeof reflectionConfiguration==="object"&&!Object.prototype.hasOwnProperty.call(reflectionConfiguration,name))){let result;if(typeof options.writeAttribute==="boolean"){if(options.writeAttribute&&self.propertyTypes&&Object.prototype.hasOwnProperty.call(self.propertyTypes,name))result=self.propertyTypes[name]}else result=options.writeAttribute;if(result!==undefined){if(Array.isArray(self.propertiesToReflectAsAttributes))if(options.writeAttribute===true){if(!self.propertiesToReflectAsAttributes.includes(name))self.propertiesToReflectAsAttributes.push(name)}else if(self.normalizePropertyTypeList)self.propertiesToReflectAsAttributes=self.normalizePropertyTypeList(self.propertiesToReflectAsAttributes);if(self.propertiesToReflectAsAttributes instanceof Map)self.propertiesToReflectAsAttributes.set(name,result);else if(!Array.isArray(self.propertiesToReflectAsAttributes)&&typeof self.propertiesToReflectAsAttributes==="object")self.propertiesToReflectAsAttributes[name]=result}}}if(options.alias){if(!Object.prototype.hasOwnProperty.call(self,"propertyAliases"))self.propertyAliases=self.propertyAliases?{...self.propertyAliases}:{};if(self.propertyAliases&&(options.update||!hasOwnStaticMember(self,name)))self.propertyAliases[name]=options.alias}}}/* harmony default export */ const decorator = (property);
export { decorator as default, property };
