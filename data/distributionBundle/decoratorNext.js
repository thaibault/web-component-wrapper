'use strict';if(typeof module!=='undefined'&&module!==null&&eval('typeof require')!=='undefined'&&eval('require')!==null&&'main'in eval('require')&&eval('typeof require.main')!=='undefined'&&eval('require.main')!==null){var ORIGINAL_MAIN_MODULE=module;if(module!==eval('require.main')&&'paths'in module&&'paths'in eval('require.main')&&typeof __dirname!=='undefined'&&__dirname!==null)module.paths=eval('require.main.paths').concat(module.paths.filter(function(path){return eval('require.main.paths').includes(path)}))};if(typeof window==='undefined'||window===null)var window=(typeof global==='undefined'||global===null)?{}:global;!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("clientnode"),require("clientnode/property-types"));else if("function"==typeof define&&define.amd)define(["clientnode","clientnode/property-types"],t);else{var r="object"==typeof exports?t(require("clientnode"),require("clientnode/property-types")):t(e.clientnode,e["clientnode/property-types"]);for(var o in r)("object"==typeof exports?exports:e)[o]=r[o]}}(this,((e,t)=>(()=>{"use strict";var r=[t=>{t.exports=e},,e=>{e.exports=t}],o={};function p(e){var t=o[e];if(void 0!==t)return t.exports;var s=o[e]={exports:{}};return r[e](s,s.exports,p),s.exports}p.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return p.d(t,{a:t}),t},p.d=(e,t)=>{for(var r in t)p.o(t,r)&&!p.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},p.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),p.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var s={};return(()=>{p.r(s),p.d(s,{default:()=>i,property:()=>o});var e=p(0),t=p.n(e),r=p(2);function o(e){return void 0===e&&(e={}),e={readAttribute:!0,type:r.string,...e},function(r,o){if("string"!=typeof o)return;const p=r.self||r.constructor;if(e.readAttribute){Object.prototype.hasOwnProperty.call(p,"observedAttributes")||(p.observedAttributes=p.observedAttributes?[...p.observedAttributes]:[]);const e=t().stringCamelCaseToDelimited(o);p.observedAttributes.includes(e)||p.observedAttributes.push(e)}if(e.type&&(Object.prototype.hasOwnProperty.call(p,"propertyTypes")||(p.propertyTypes=p.propertyTypes?{...p.propertyTypes}:{}),!e.update&&Object.prototype.hasOwnProperty.call(p,o)||(p.propertyTypes[o]=e.type)),e.writeAttribute&&(Object.prototype.hasOwnProperty.call(p,"propertiesToReflectAsAttributes")||(p.propertiesToReflectAsAttributes=p.propertiesToReflectAsAttributes?t().copy(p.propertiesToReflectAsAttributes):[]),e.update||p.propertiesToReflectAsAttributes instanceof Map&&!p.propertiesToReflectAsAttributes.has(o)||Array.isArray(p.propertiesToReflectAsAttributes)&&!p.propertiesToReflectAsAttributes.includes(o)||null!==p.propertiesToReflectAsAttributes&&"object"==typeof p.propertiesToReflectAsAttributes&&!Object.prototype.hasOwnProperty.call(p.propertiesToReflectAsAttributes,o))){let t;"boolean"==typeof e.writeAttribute?!0===e.writeAttribute&&p.propertyTypes&&Object.prototype.hasOwnProperty.call(p.propertyTypes,o)&&(t=p.propertyTypes[o]):t=e.writeAttribute,void 0!==t&&(Array.isArray(p.propertiesToReflectAsAttributes)&&(!0===e.writeAttribute?p.propertiesToReflectAsAttributes.push(o):p.propertiesToReflectAsAttributes=p.normalizePropertyTypeList(p.propertiesToReflectAsAttributes)),p.propertiesToReflectAsAttributes instanceof Map&&p.propertiesToReflectAsAttributes.set(o,t),null!==p.propertiesToReflectAsAttributes&&"object"==typeof p.propertiesToReflectAsAttributes&&(p.propertiesToReflectAsAttributes[o]=t))}e.alias&&(Object.prototype.hasOwnProperty.call(p,"propertyAliases")||(p.propertyAliases=p.propertyAliases?{...p.propertyAliases}:{}),!e.update&&Object.prototype.hasOwnProperty.call(p,o)||(p.propertyAliases[o]=e.alias))}}const i=o})(),s})()));