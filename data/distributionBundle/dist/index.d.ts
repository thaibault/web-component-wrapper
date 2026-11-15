import type { Mapping } from 'clientnode';
import type { ComponentType, WebComponentAPI, WebComponentConfiguration } from './type';
import propertyImport from './decorator';
import ReactWebImport from './ReactWeb';
import WebImport from './Web';
export declare const property: typeof propertyImport;
export declare const ReactWeb: typeof ReactWebImport;
export declare const reactWebAPI: WebComponentAPI<HTMLElement, Mapping<unknown>, import("./type").ReactComponentBaseProperties, typeof ReactWebImport>;
export declare const webAPI: WebComponentAPI<HTMLElement, Mapping<unknown>, Mapping<unknown>, typeof WebImport>;
export declare const Web: typeof WebImport;
/**
 * Wraps given react component as web component.
 * @param component - React component to wrap.
 * @param nameHint - A name to set as property in runtime generated web
 * component class.
 * @param configuration - Additional web component configurations.
 * @returns Generated object to register and retrieve generated web component.
 */
export declare const wrapAsWebComponent: <Type extends ComponentType = ComponentType, ExternalProperties extends Mapping<unknown> = Mapping<unknown>, InternalProperties extends Mapping<unknown> = Mapping<unknown>, EventParameters extends Array<unknown> = Array<unknown>>(component: Type, nameHint?: string, configuration?: WebComponentConfiguration<ExternalProperties, InternalProperties, EventParameters>) => WebComponentAPI<Type, ExternalProperties, InternalProperties, typeof ReactWeb<Type, ExternalProperties, InternalProperties>>;
export default wrapAsWebComponent;
