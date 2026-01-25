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
        //metadata.variables.forEach { variable ->
        //    println("  - ${variable.text} (${variable.code}): ${variable.values.size} values")
        //}
        
        // Extract the raw dataset
        println("\nExtracting dataset...")
        val rawDataset = extractor.extract(metadata, dataSource.getUrl())
        
        println("\nExtraction complete!")
        println("Format: ${rawDataset.format}")
        println("Data size: ${rawDataset.data.length} bytes")
        
        //TODO DELETE Save to file (optional)
        saveToFile(rawDataset)
        
    } catch (e: Exception) {
        println("Error: ${e.message}")
        e.printStackTrace()
    }
}

//TODO DELETE
//temp method to save to file temporarily before we have a db
fun saveToFile(dataset: model.RawDataset) {
    val outputDir = java.io.File("stat_fin_data_output")
    if (!outputDir.exists()) outputDir.mkdirs()
    
    val filename = "dataset_${System.currentTimeMillis()}.${dataset.format}"
    val file = java.io.File(outputDir, filename)
    file.writeText(dataset.data)
    println("Saved to: ${file.absolutePath}")
}