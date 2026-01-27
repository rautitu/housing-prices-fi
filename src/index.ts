// src/index.ts

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { DatasetExtractor } from "./extractor/DatasetExtractor.ts";
import { PxWebDatasetSource } from "./source/PxWebDatasetSource.ts";
import type { RawDataset } from "./model/Models.ts";
import { createLogger } from './utils/Logger.ts';


async function main() {
  //central logger init
  const logger = createLogger('app');
  logger.info('Application starting...');

  const datasetUrl =
    "https://pxdata.stat.fi/PXWeb/api/v1/en/StatFin/statfin_ashi_pxt_13mu.px";

  logger.info("PX-Web Dataset Extractor");
  logger.info("========================\n");
  return

  const dataSource = new PxWebDatasetSource(datasetUrl);
  const extractor = new DatasetExtractor();

  try {
    logger.info(`Fetching metadata from: ${datasetUrl}`);
    const metadata = await dataSource.fetchMetadata();

    logger.info("\nDataset Information:");
    logger.info(`Title: ${metadata.title}`);
    logger.info(`Variables: ${metadata.variables.length}`);

    logger.info("\nExtracting dataset...");
    const rawDataset = await extractor.extract(
      metadata,
      dataSource.getUrl()
    );

    logger.info("\nExtraction complete!");
    logger.info(`Format: ${rawDataset.format}`);
    logger.info(`Data size: ${rawDataset.data.length} bytes`);

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
  logger.info(`Saved to: ${filePath}`);
}

// Bun supports top-level await,
// but calling main() is still a nice convention
await main();
