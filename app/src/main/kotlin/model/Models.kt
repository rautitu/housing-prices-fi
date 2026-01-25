package model

import kotlinx.serialization.Serializable

/**
 * Represents metadata about a PX-Web dataset
 */
@Serializable
data class DatasetMetadata(
    val title: String,
    val variables: List<Variable>,
    val source: String? = null,
    val updated: String? = null,
    val description: String? = null
)

/**
 * Represents a variable (dimension) in the dataset
 */
@Serializable
data class Variable(
    val code: String,
    val text: String,
    val values: List<String>,
    val valueTexts: List<String>,
    val elimination: Boolean? = false,
    val time: Boolean? = false
)

/**
 * Represents a raw dataset extracted from the API
 */
data class RawDataset(
    val format: String,
    val data: String,
    val metadata: DatasetMetadata
)

/**
 * Query to send to PX-Web API for data extraction
 */
@Serializable
data class PxWebQuery(
    val query: List<VariableSelection>,
    val response: ResponseFormat
)

/**
 * Variable selection for the query
 */
@Serializable
data class VariableSelection(
    val code: String,
    val selection: Selection
)

/**
 * Selection criteria for a variable
 */
@Serializable
data class Selection(
    val filter: String,
    val values: List<String>
)

/**
 * Response format specification
 */
@Serializable
data class ResponseFormat(
    val format: String
)
