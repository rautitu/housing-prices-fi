package extractor

import model.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

/**
 * Extracts raw datasets from PX-Web API based on metadata
 */
class DatasetExtractor {
    
    private val httpClient = HttpClient.newBuilder()
        .followRedirects(HttpClient.Redirect.NORMAL)
        .build()
    
    private val json = Json { 
        ignoreUnknownKeys = true
        prettyPrint = true
    }
    
    /**
     * Extracts the complete dataset using metadata information
     * @param metadata Dataset metadata containing variables and structure
     * @param apiUrl The API endpoint URL for the dataset
     * @param format Output format (default: "json-stat2")
     * @return RawDataset containing the extracted data
     */
    fun extract(
        metadata: DatasetMetadata,
        apiUrl: String,
        format: String = "json-stat2"
    ): RawDataset {
        //TODO replace with buildDefaultQuery after initial tests
        val query = buildTestQuery(metadata, format)
        //val query = buildDefaultQuery(metadata, format)
        return executeQuery(apiUrl, metadata, query, format)
    }
    
    /**
     * Extracts dataset with a custom query
     * @param metadata Dataset metadata
     * @param apiUrl The API endpoint URL for the dataset
     * @param query Custom PxWebQuery
     * @param format Output format
     * @return RawDataset containing the extracted data
     */
    fun extractWithQuery(
        metadata: DatasetMetadata,
        apiUrl: String,
        query: PxWebQuery,
        format: String = "json-stat2"
    ): RawDataset {
        return executeQuery(apiUrl, metadata, query, format)
    }
    
    /**
     * Builds a default query that selects all values for all variables
     */
    private fun buildDefaultQuery(metadata: DatasetMetadata, format: String): PxWebQuery {
        val selections = metadata.variables.map { variable ->
            VariableSelection(
                code = variable.code,
                selection = Selection(
                    filter = "item",
                    values = variable.values
                )
            )
        }
        
        return PxWebQuery(
            query = selections,
            response = ResponseFormat(format = format)
        )
    }

    //TEMP method that mimics only parts of metadata for a certain API just to see that extracting this works
    //wont make the final implementation
    private fun buildTestQuery(metadata: DatasetMetadata, format: String = "json-stat"): PxWebQuery {
        // Define the exact variable codes and values from your working query
        val testSelections = listOf(
            VariableSelection(
                code = "Vuosi",
                selection = Selection(
                    filter = "item",
                    values = listOf("2024")
                )
            ),
            VariableSelection(
                code = "Postinumero",
                selection = Selection(
                    filter = "item",
                    values = listOf("00400")
                )
            ),
            VariableSelection(
                code = "Talotyyppi",
                selection = Selection(
                    filter = "item",
                    values = listOf("1", "2", "3", "5") // All building types
                )
            ),
            VariableSelection(
                code = "Tiedot",
                selection = Selection(
                    filter = "item",
                    values = listOf("keskihinta_aritm_nw", "lkm_julk20") // Both metrics
                )
            )
        )
        
        return PxWebQuery(
            query = testSelections,
            response = ResponseFormat(format = format)
        )
    }
    
    /**
     * Executes the query against the PX-Web API
     */
    private fun executeQuery(
        apiUrl: String,
        metadata: DatasetMetadata,
        query: PxWebQuery,
        format: String
    ): RawDataset {
        val requestBody = json.encodeToString(query)
        
        val request = HttpRequest.newBuilder()
            .uri(URI.create(apiUrl))
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build()
        
        val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
        
        if (response.statusCode() != 200) {
            throw Exception("Failed to extract dataset. Status code: ${response.statusCode()}, Body: ${response.body()}")
        }
        
        return RawDataset(
            format = format,
            data = response.body(),
            metadata = metadata
        )
    }
    
    /**
     * Helper method to create a query that selects the latest N values for time variables
     */
    fun buildLatestDataQuery(
        metadata: DatasetMetadata,
        topN: Int = 1,
        format: String = "json-stat2"
    ): PxWebQuery {
        val selections = metadata.variables.map { variable ->
            if (variable.time == true) {
                // For time variables, select the top N latest values
                VariableSelection(
                    code = variable.code,
                    selection = Selection(
                        filter = "top",
                        values = listOf(topN.toString())
                    )
                )
            } else {
                // For other variables, select all values
                VariableSelection(
                    code = variable.code,
                    selection = Selection(
                        filter = "item",
                        values = variable.values
                    )
                )
            }
        }
        
        return PxWebQuery(
            query = selections,
            response = ResponseFormat(format = format)
        )
    }
}
