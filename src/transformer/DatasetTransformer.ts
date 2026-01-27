import { createLogger } from '../utils/Logger.ts';

import type {
    RawDataset,
} from '../model/Models.ts';
import type { Logger } from 'pino';

/**
 * Transforms RawDataset to a format insertable to a DB (postgres)
 */
export class DatasetTransformer {
    private logger: Logger;
    private targetTableName: string;
    private rawDataset: RawDataset;

    constructor(
        rawDataset: RawDataset,
        datasetName: string
    ) {
        this.logger = createLogger('DatasetTransformer');
        this.rawDataset = rawDataset;
        this.targetTableName = datasetName;
    }

    testPrint(){
        this.logger.info("test prints begin")
        this.logger.info(this.targetTableName)
        this.logger.info(this.rawDataset.format)
        this.logger.info(this.rawDataset.metadata)
        this.logger.info(this.rawDataset.data)
        this.logger.info("test prints end")
    }
}