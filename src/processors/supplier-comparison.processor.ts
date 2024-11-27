import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { Supplier } from '../entities/supplier.entity';
import { SupplierPerformanceMetric } from '../entities/supplier-performance-metric.entity';

import { SupplierService } from '../services/supplier.service';
import { PerformanceMetricService } from '../services/performance-metric.service';
import { ActionService } from '../services/action.service';
import { RecommendationService } from '../services/recommendation.service';

@Processor('supplier-comparison')
@Injectable()
export class SupplierComparisonProcessor extends WorkerHost {
  private readonly logger = new Logger(SupplierComparisonProcessor.name);

  constructor(
    private readonly actionService: ActionService,
    private readonly supplierService: SupplierService,
    private readonly performanceMetricService: PerformanceMetricService,
    private readonly recommendationService: RecommendationService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'compare-suppliers':
        try {
          this.logger.log('Running supplier comparison task...');
          await this.compareSuppliers();
          this.logger.log('Supplier comparison task completed.');
        } catch (error) {
          this.logger.error('Error during supplier comparison task:', error);
          throw error;
        }
        break;

      default:
        this.logger.warn(`No handler for job name ${job.name}`);
        break;
    }
  }

  async compareSuppliers() {
    this.logger.log('Comparing suppliers to find the best and worst...');

    const suppliers = await this.supplierService.getSuppliers();

    if (suppliers.length < 2) {
      this.logger.warn('Not enough suppliers to compare.');
      return;
    }

    let bestSupplier: Supplier = null;
    let worstSupplier: Supplier = null;
    let highestAverageQuality = -Infinity;
    let lowestAverageQuality = Infinity;

    for (const supplier of suppliers) {
      const metrics =
        await this.performanceMetricService.getRecentPerformanceMetrics(
          supplier.supplierId,
        );
      const avgQuality = this.calculateAverageQuality(metrics);

      if (avgQuality > highestAverageQuality) {
        highestAverageQuality = avgQuality;
        bestSupplier = supplier;
      }

      if (avgQuality < lowestAverageQuality) {
        lowestAverageQuality = avgQuality;
        worstSupplier = supplier;
      }
    }

    if (bestSupplier && worstSupplier) {
      this.logger.log(
        `Best supplier: ${bestSupplier.supplierName} (Quality: ${highestAverageQuality})`,
      );
      this.logger.log(
        `Worst supplier: ${worstSupplier.supplierName} (Quality: ${lowestAverageQuality})`,
      );

      const recommendation =
        await this.recommendationService.createRecommendation({
          supplier1Id: bestSupplier.supplierId,
          supplier2Id: worstSupplier.supplierId,
        });

      await this.createActions(recommendation, {
        betterSupplier: bestSupplier,
        worseSupplier: worstSupplier,
      });
    }

    this.logger.log('Supplier comparison completed.');
  }

  calculateAverageQuality(metrics: SupplierPerformanceMetric[]): number {
    if (!metrics.length) return 0;
    const total = metrics.reduce(
      (sum, metric) => sum + (metric.qualityRating || 0),
      0,
    );
    return total / metrics.length;
  }

  async createActions(
    recommendation: any,
    comparisonResult: { betterSupplier: Supplier; worseSupplier: Supplier },
  ) {
    const date = new Date().toISOString().split('T')[0];
    const { betterSupplier, worseSupplier } = comparisonResult;

    await this.actionService.createAction({
      recommendationId: recommendation.recommendationId,
      supplierId: betterSupplier.supplierId,
      actionType: 'Email',
      description: `Email supplier ${betterSupplier.supplierName} to see if they can deliver more goods.`,
      date,
      status: 'pending',
    });

    await this.actionService.createAction({
      recommendationId: recommendation.recommendationId,
      supplierId: worseSupplier.supplierId,
      actionType: 'Reminder',
      description: `Consider terminating supplier ${worseSupplier.supplierName} at the end of the contract period.`,
      date,
      status: 'pending',
    });
  }
}
