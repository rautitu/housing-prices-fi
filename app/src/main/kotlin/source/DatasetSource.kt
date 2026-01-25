package source

import model.DatasetMetadata

/**
 * Interface for dataset sources
 * Defines the contract for fetching metadata from different data sources
 */
interface DatasetSource {
    /**
     * Fetches metadata about the dataset
     * @return DatasetMetadata containing information about the dataset structure
     * @throws Exception if metadata cannot be fetched
     */
    fun fetchMetadata(): DatasetMetadata
    
    /**
     * Gets the base URL of the dataset
     * @return String representing the dataset URL
     */
    fun getUrl(): String
}
