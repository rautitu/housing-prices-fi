// src/index.ts

import { DatasetExtractor } from "./extractor/DatasetExtractor.ts";
import { PxWebDatasetSource } from "./source/PxWebDatasetSource.ts";
import type { RawDataset } from "./model/Models.ts";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function main() {
  const datasetUrl =
    "https://pxdata.stat.fi/PXWeb/api/v1/en/StatFin/statfin_ashi_pxt_13mu.px";

  console.log("PX-Web Dataset Extractor");
  console.log("========================\n");

  const dataSource = new PxWebDatasetSource(datasetUrl);
  const extractor = new DatasetExtractor();

  try {
    console.log(`Fetching metadata from: ${datasetUrl}`);
    const metadata = await dataSource.fetchMetadata();

    console.log("\nDataset Information:");
    console.log(`Title: ${metadata.title}`);
    console.log(`Variables: ${metadata.variables.length}`);

    console.log("\nExtracting dataset...");
    const rawDataset = await extractor.extract(
      metadata,
      dataSource.getUrl()
    );

    console.log("\nExtraction complete!");
    console.log(`Format: ${rawDataset.format}`);
    console.log(`Data size: ${rawDataset.data.length} bytes`);

    await saveToFile(rawDataset);
  } catch (err) {
    console.error("Error:", err);
    if (err instanceof Error) {
      console.error(err.stack);
    }
  }
}

async function saveToFile(dataset: RawDataset) {
  const outputDir = "stat_fin_data_output";
  await mkdir(outputDir, { recursive: true });

  const filename = `dataset_${Date.now()}.${dataset.format}`;
  const filePath = join(outputDir, filename);

  await writeFile(filePath, dataset.data, "utf-8");
  console.log(`Saved to: ${filePath}`);
}

// Bun supports top-level await,
// but calling main() is still a nice convention
await main();
