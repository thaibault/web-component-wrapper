import type { Mapping } from 'clientnode';
import type { Root as ReactRoot } from 'react-dom/client';
import type { ComponentType, ReactComponentBaseProperties, ReactRenderItemFactory, ReactRenderItemsFactory, ReactRenderItems, WebComponentAPI } from './type';
import { Logger } from 'clientnode';
import React from 'react';
import Web from './Web';
export declare const log: Logger;
/**
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
 */
export declare class ReactWeb<TElement = HTMLElement, ExternalProperties extends Mapping<unknown> = Mapping<unknown>, InternalProperties extends ReactComponentBaseProperties<TElement> = Mapping<unknown>> extends Web<TElement, ExternalProperties, InternalProperties> {
    static attachWebComponentAdapterIfNotExists: boolean;
    static content: ComponentType | string;
    static react: typeof React;
    static _name: string;
    unmountOnDisconnect: boolean;
    compiledSlots: (Mapping<ReactRenderItemsFactory> & {
        children?: ReactRenderItemsFactory;
    });
    preparedSlots: Mapping<ReactRenderItems> & {
        children?: ReactRenderItems;
    };
    reactRoot: null | ReactRoot;
    rootReactInstance: null | ReactWeb;
    readonly self: typeof ReactWeb;
    wrapMemorizingWrapper: boolean | null;
    isWrapped: boolean;
    /**
     * Triggered when this component is mounted into the document. Event
     * handlers will be attached and the final render proceeds.
     */
    connectedCallback(): void;
    /**
     * Triggered when this component is unmounted from the document. Event
     * handlers will be removed and state updated accordingly.
     */
    disconnectedCallback(): void;
    /**
     * Reflects wrapped component state back to web-component's attributes.
     * @param properties - Properties to update in reflected attribute state.
     */
    reflectExternalProperties(properties: Partial<ExternalProperties>): void;
    /**
     * Method that does the rendering job. Should be called when ever state
     * changes should be projected to the hosts dom content.
     * @param reason - Description why rendering is necessary.
     * @param resolveRendering - Indicates whether rendering should be resolved
     * finally. Should be set to "false" via super calls in inherited render
     * methods which do further dom manipulations afterward and resolve the
     * rendering process by their own.
     * @returns A promise resolving when rendering has finished. A promise may
     * be needed for classes inheriting from this class.
     */
    render(reason?: string, resolveRendering?: boolean): Promise<void>;
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
     */
    setPropertyValue(name: string, value: unknown): void;
    /**
     * Internal property setter. Respects configured aliases.
     * @param name - Property name to write.
     * @param value - New value to write.
     */
    setInternalPropertyValue(name: string, value: unknown): void;
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
     */
    preCompileDomNodes(domNodes: Array<Node>, scope?: Mapping<unknown>, isFunction?: boolean): ReactRenderItemsFactory;
    /**
     * Converts a given html dom node into a react-element.
     * @param domNode - Node to convert.
     * @param scope - Additional scope to render subcomponents against.
     * @param isFunction - Indicates whether given nodes should be provided as
     * function (render property).
     * @param key - Optional key to add to component properties.
     * @returns Transformed react element.
     */
    preCompileDomNode(domNode: Node, scope?: Mapping<unknown>, isFunction?: boolean, key?: string): ReactRenderItemFactory;
    /**
     * Evaluates given pre-compiled nodes into a single react element or a
     * React element list.
     * @param nodes - Pre-compiled nodes.
     * @param scope - Additional scope to render subcomponents against.
     * @returns Transformed react elements.
     */
    evaluatePreCompiledDomNodes(nodes: ReactRenderItemsFactory, scope?: Mapping<unknown>): ReactRenderItems;
    /**
     * Pre compiles and caches determined slots.
     */
    preCompileSlots(): void;
    /**
     * Evaluates pre-compiled slots.
     * @param scope - To render again.
     */
    evaluateSlots(scope: Mapping<unknown>): void;
    /**
     * Determines if the given element type is a react-wrapped component.
     * @param domNode - Node to determine from.
     * @returns Boolean indicator.
     */
    static isReactComponent(domNode: Node): boolean;
    /**
     * Determines initial root and react root who initializes their rendering
     * digests.
     */
    determineRootBinding(): void;
    /**
     * Applies missing forward ref and or memorizing wrapper to a current react
     * component.
     */
    applyComponentWrapper(): void;
    /**
     * Prepares a given properties object to render against the current
     * component. Creates a reference for being recognized of reacts internal
     * state updates.
     * @param properties - Properties to prepare.
     */
    prepareProperties(properties: InternalProperties): void;
    /**
     * Updates the current component instance and reflects newly determined
     * properties.
     */
    reflectInstanceProperties: () => void;
    /**
     * Removes unwanted known and not specified properties from a given
     * properties object (usually added by dev-tools).
     * @param target - ReactElement where properties belong to.
     * @param properties - Properties object to trim.
     */
    static removeKnownUnwantedPropertyKeys(target: typeof ReactWeb, properties: Mapping<unknown>): void;
}
export declare const api: WebComponentAPI<HTMLElement, Mapping<unknown>, ReactComponentBaseProperties, typeof ReactWeb>;
export default ReactWeb;
