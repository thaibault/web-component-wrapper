import type { PropertyConfiguration } from './type';
/**
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
 */
export declare function property(options?: {
    alias?: string;
    readAttribute?: boolean;
    type?: PropertyConfiguration;
    update?: boolean;
    writeAttribute?: boolean | PropertyConfiguration;
}): PropertyDecorator;
export default property;
