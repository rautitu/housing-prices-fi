/**
 * Represents metadata about a PX-Web dataset
 */
export interface DatasetMetadata {
    title: string;
    variables: Variable[];
    source?: string;
    updated?: string;
    description?: string;
}

/**
 * Represents a variable (dimension) in the dataset
 */
export interface Variable {
    code: string;
    text: string;
    values: string[];
    valueTexts: string[];
    elimination?: boolean;
    time?: boolean;
}

/**
 * Represents a raw dataset extracted from the API
 */
export interface RawDataset {
    format: string;
    data: string;
    metadata: DatasetMetadata;
}

/**
 * Query to send to PX-Web API for data extraction
 */
export interface PxWebQuery {
    query: VariableSelection[];
    response: ResponseFormat;
}

/**
 * Variable selection for the query
 */
export interface VariableSelection {
    code: string;
    selection: Selection;
}

/**
 * Selection criteria for a variable
 */
export interface Selection {
    filter: string;
    values: string[];
}

/**
 * Response format specification
 */
export interface ResponseFormat {
    format: string;
}