package source

import model.DatasetMetadata
import model.Variable
import kotlinx.serialization.json.*
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

/**
 * Implementation of DatasetSource for PX-Web API
 * Handles communication with Statistics Finland's PX-Web API
 */
class PxWebDatasetSource(private val datasetUrl: String) : DatasetSource {
    
    private val httpClient = HttpClient.newBuilder()
        .followRedirects(HttpClient.Redirect.NORMAL)
        .build()
    
    private val json = Json { 
        ignoreUnknownKeys = true
        isLenient = true
    }
    
    override fun fetchMetadata(): DatasetMetadata {
        val apiUrl = convertToApiUrl(datasetUrl)
        
        val request = HttpRequest.newBuilder()
            .uri(URI.create(apiUrl))
            .header("Accept", "application/json")
            .GET()
            .build()
        
        val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
        
        if (response.statusCode() != 200) {
            throw Exception("Failed to fetch metadata. Status code: ${response.statusCode()}")
        }
        
        return parseMetadata(response.body())
    }
    
    override fun getUrl(): String = datasetUrl
    
    /**
     * Converts a PX-Web UI URL to an API URL
     * Example: .../pxweb/fi/StatFin/.../table.px/ -> .../api/v1/fi/StatFin/.../table.px
     */
    private fun convertToApiUrl(url: String): String {
        // Remove trailing slash if present
        val cleanUrl = url.trimEnd('/')
        
        // Check if already an API URL
        if (cleanUrl.contains("/api/v1/")) {
            return cleanUrl
        }
        
        // Convert pxweb URL to API URL
        return cleanUrl.replace("/PXWeb/pxweb/", "/PXWeb/api/v1/")
    }
    
    /**
     * Parses the JSON metadata response from PX-Web API
     */
    private fun parseMetadata(jsonString: String): DatasetMetadata {
        val jsonElement = json.parseToJsonElement(jsonString)
        val jsonObject = jsonElement.jsonObject
        
        val title = jsonObject["title"]?.jsonPrimitive?.content ?: "Unknown"
        val source = jsonObject["source"]?.jsonPrimitive?.contentOrNull
        val updated = jsonObject["updated"]?.jsonPrimitive?.contentOrNull
        val description = jsonObject["description"]?.jsonPrimitive?.contentOrNull
        
        val variables = jsonObject["variables"]?.jsonArray?.map { varElement ->
            parseVariable(varElement.jsonObject)
        } ?: emptyList()
        
        return DatasetMetadata(
            title = title,
            variables = variables,
            source = source,
            updated = updated,
            description = description
        )
    }
    
    /**
     * Parses a single variable from the metadata JSON
     */
    private fun parseVariable(varObject: JsonObject): Variable {
        val code = varObject["code"]?.jsonPrimitive?.content ?: ""
        val text = varObject["text"]?.jsonPrimitive?.content ?: ""
        
        val values = varObject["values"]?.jsonArray?.map { 
            it.jsonPrimitive.content 
        } ?: emptyList()
        
        val valueTexts = varObject["valueTexts"]?.jsonArray?.map { 
            it.jsonPrimitive.content 
        } ?: emptyList()
        
        val elimination = varObject["elimination"]?.jsonPrimitive?.booleanOrNull
        val time = varObject["time"]?.jsonPrimitive?.booleanOrNull
        
        return Variable(
            code = code,
            text = text,
            values = values,
            valueTexts = valueTexts,
            elimination = elimination,
            time = time
        )
    }
}
