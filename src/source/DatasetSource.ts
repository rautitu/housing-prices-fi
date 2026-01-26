import type { DatasetMetadata } from '../model/Models.ts';

/**
 * Interface for dataset sources
 * Defines the contract for fetching metadata from different data sources
 */
export interface DatasetSource {
    /**
     * Fetches metadata about the dataset
     * @return DatasetMetadata containing information about the dataset structure
     * @throws Error if metadata cannot be fetched
     */
    fetchMetadata(): Promise<DatasetMetadata> | DatasetMetadata;
    
    /**
     * Gets the base URL of the dataset
     * @return string representing the dataset URL
     */
    getUrl(): string;
}

/**
 * Async version of DatasetSource that returns a Promise
 * Use this for implementations that perform asynchronous operations
 */
export interface AsyncDatasetSource extends DatasetSource {
    fetchMetadata(): Promise<DatasetMetadata>;
}

/**
 * Sync version of DatasetSource that returns synchronously
 * Use this for implementations that don't need async operations
 */
export interface SyncDatasetSource extends DatasetSource {
    fetchMetadata(): DatasetMetadata;
}