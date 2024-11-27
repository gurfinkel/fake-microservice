import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SupplierPerformanceMetric } from '../entities/supplier-performance-metric.entity';
import { SupplierService } from './supplier.service';
import { ActionService } from './action.service';
import { EmailService } from './email.service';

@Injectable()
export class PerformanceMetricService {
  constructor(
    @InjectRepository(SupplierPerformanceMetric)
    private readonly performanceMetricRepository: Repository<SupplierPerformanceMetric>,
    private readonly supplierService: SupplierService,
    private readonly actionService: ActionService,
    private readonly emailService: EmailService,
  ) {}

  async addPerformanceMetric(
    metricData: Partial<SupplierPerformanceMetric>,
  ): Promise<SupplierPerformanceMetric> {
    const metric = this.performanceMetricRepository.create(metricData);
    return await this.performanceMetricRepository.save(metric);
  }

  async getRecentPerformanceMetrics(
    supplierId: number,
  ): Promise<SupplierPerformanceMetric[]> {
    return await this.performanceMetricRepository.find({
      where: { supplierId },
      order: { date: 'DESC' },
      take: 5,
    });
  }
}
