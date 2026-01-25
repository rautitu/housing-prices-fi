//package pxExtractorMain

import extractor.DatasetExtractor
import source.PxWebDatasetSource

fun main() {
    //running first example dataset from stat.fi
    val datasetUrl = "https://pxdata.stat.fi/PXWeb/api/v1/en/StatFin/statfin_ashi_pxt_13mu.px"
    
    println("PX-Web Dataset Extractor")
    println("========================\n")
    
    // Create data source and extractor
    val dataSource = PxWebDatasetSource(datasetUrl)
    val extractor = DatasetExtractor()
    
    try {
        // Extract dataset metadata
        println("Fetching metadata from: $datasetUrl")
        val metadata = dataSource.fetchMetadata()
        
        println("\nDataset Information:")
        println("Title: ${metadata.title}")
        println("Variables: ${metadata.variables.size}")
        metadata.variables.forEach { variable ->
            println("  - ${variable.text} (${variable.code}): ${variable.values.size} values")
        }
        return //TODO
        
        // Extract the raw dataset
        println("\nExtracting dataset...")
        val rawDataset = extractor.extract(metadata, dataSource.getUrl())
        
        println("\nExtraction complete!")
        println("Format: ${rawDataset.format}")
        println("Data size: ${rawDataset.data.length} bytes")
        
        //TODO Save to file (optional)
        //saveToFile(rawDataset)
        
    } catch (e: Exception) {
        println("Error: ${e.message}")
        e.printStackTrace()
    }
}

fun saveToFile(dataset: model.RawDataset) {
    val filename = "dataset_${System.currentTimeMillis()}.${dataset.format}"
    java.io.File(filename).writeText(dataset.data)
    println("Saved to: $filename")
}

//TODO: remove this when I get the actual program to work
//fun main() {
//    println("Hello from Kotlin!")
//    println("Java version: ${System.getProperty("java.version")}")
//}