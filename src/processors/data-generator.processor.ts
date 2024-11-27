import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { SupplierService } from '../services/supplier.service';
import { PerformanceMetricService } from '../services/performance-metric.service';

@Processor('data-generation')
@Injectable()
export class DataGeneratorProcessor extends WorkerHost {
  private readonly logger = new Logger(DataGeneratorProcessor.name);

  constructor(
    private readonly supplierService: SupplierService,
    private readonly performanceMetricService: PerformanceMetricService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'generate-data':
        try {
          this.logger.log('Running data generation task...');
          await this.generateData();
          this.logger.log('Data generation task completed.');
        } catch (error) {
          this.logger.error('Error during data generation task:', error);
          throw error;
        }
        break;

      default:
        this.logger.warn(`No handler for job name ${job.name}`);
        break;
    }
  }
  async generateData() {
    this.logger.log('Generating performance metrics...');

    // Generate performance metrics
    const suppliers = await this.supplierService.getSuppliers();
    const date = new Date().toISOString().split('T')[0];

    for (const supplier of suppliers) {
      await this.performanceMetricService.addPerformanceMetric({
        supplierId: supplier.supplierId,
        date,
        costOfGoods: parseFloat((Math.random() * 10000).toFixed(2)),
        lengthOfDelivery: Math.floor(Math.random() * 10) + 1,
        numberOfLateDeliveries: Math.floor(Math.random() * 5),
        numberOfRecalledProducts: Math.floor(Math.random() * 2),
        qualityRating: Math.floor(Math.random() * 5) + 1,
      });
    }

    this.logger.log('Performance metrics generation complete.');
  }
}
