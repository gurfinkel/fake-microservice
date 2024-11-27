import { Test, TestingModule } from '@nestjs/testing';
import { SupplierComparisonProcessor } from './supplier-comparison.processor';
import { SupplierService } from '../services/supplier.service';
import { PerformanceMetricService } from '../services/performance-metric.service';
import { ActionService } from '../services/action.service';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Supplier } from '../entities/supplier.entity';
import { SupplierPerformanceMetric } from '../entities/supplier-performance-metric.entity';
import { ActionGeneratedByConnie } from '../entities/action-generated-by-connie.entity';
import { RecommendationService } from '../services/recommendation.service';

describe('SupplierComparisonProcessor', () => {
  let processor: SupplierComparisonProcessor;
  let supplierService: SupplierService;
  let performanceMetricService: PerformanceMetricService;
  let actionService: ActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierComparisonProcessor,
        {
          provide: SupplierService,
          useValue: {
            getSuppliers: jest.fn(),
          },
        },
        {
          provide: PerformanceMetricService,
          useValue: {
            getRecentPerformanceMetrics: jest.fn(),
          },
        },
        {
          provide: RecommendationService,
          useValue: {
            getRecommendations: jest.fn(),
            createRecommendation: jest.fn().mockResolvedValue({
              recommendationId: 1,
              supplier1Id: 1,
              supplier2Id: 2,
            }),
          },
        },
        {
          provide: ActionService,
          useValue: {
            createAction: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    processor = module.get(
      SupplierComparisonProcessor,
    ) as SupplierComparisonProcessor;

    supplierService = module.get(SupplierService) as SupplierService;
    performanceMetricService = module.get(
      PerformanceMetricService,
    ) as PerformanceMetricService;
    actionService = module.get(ActionService) as ActionService;
  });

  it('should process the job successfully', async () => {
    const job: Job = {
      id: '1',
      name: 'compare-suppliers',
      data: {},
    } as any;

    const suppliers: Supplier[] = [
      {
        supplierId: 1,
        supplierName: 'Supplier A',
        contactInfo: 'supplierA@example.com',
        financialStabilityScore: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
        performanceMetrics: [],
      },
      {
        supplierId: 2,
        supplierName: 'Supplier B',
        contactInfo: 'supplierB@example.com',
        financialStabilityScore: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
        performanceMetrics: [],
      },
    ];

    const metricsSupplierA: SupplierPerformanceMetric[] = [
      {
        supplierId: 1,
        qualityRating: 5,
        costOfGoods: 100,
        lengthOfDelivery: 5,
        numberOfLateDeliveries: 0,
        date: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SupplierPerformanceMetric,
    ];

    const metricsSupplierB: SupplierPerformanceMetric[] = [
      {
        supplierId: 2,
        qualityRating: 3,
        costOfGoods: 110,
        lengthOfDelivery: 7,
        numberOfLateDeliveries: 2,
        date: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SupplierPerformanceMetric,
    ];

    jest
      .spyOn(supplierService, 'getSuppliers')
      .mockResolvedValue(Promise.resolve(suppliers as Supplier[]));
    jest
      .spyOn(performanceMetricService, 'getRecentPerformanceMetrics')
      .mockImplementation((supplierId: number) => {
        return supplierId === 1
          ? Promise.resolve(metricsSupplierA)
          : Promise.resolve(metricsSupplierB);
      });
    jest.spyOn(actionService, 'createAction').mockResolvedValue({
      actionId: 1,
      recommendationId: null,
      supplierId: 1,
      date: new Date().toISOString().split('T')[0],
      actionType: 'Email',
      description: 'Test action',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ActionGeneratedByConnie);

    await processor.process(job);

    expect(supplierService.getSuppliers).toHaveBeenCalled();
    expect(
      performanceMetricService.getRecentPerformanceMetrics,
    ).toHaveBeenCalledTimes(2);
    expect(actionService.createAction).toHaveBeenCalled();
  });

  it('should handle case when there are no suppliers', async () => {
    const job: Job = {
      id: '1',
      name: 'compare-suppliers',
      data: {},
    } as any;

    jest.spyOn(supplierService, 'getSuppliers').mockResolvedValue([]);

    await processor.process(job);

    expect(supplierService.getSuppliers).toHaveBeenCalled();
    expect(
      performanceMetricService.getRecentPerformanceMetrics,
    ).not.toHaveBeenCalled();
    expect(actionService.createAction).not.toHaveBeenCalled();
  });

  it('should log error when an exception occurs', async () => {
    const job: Job = {
      id: '1',
      name: 'compare-suppliers',
      data: {},
    } as any;

    jest
      .spyOn(supplierService, 'getSuppliers')
      .mockRejectedValue(new Error('Database error'));

    const loggerErrorSpy = jest.spyOn(processor['logger'], 'error');

    await expect(processor.process(job)).rejects.toThrow('Database error');

    expect(supplierService.getSuppliers).toHaveBeenCalled();
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Error during supplier comparison tasks:',
      expect.objectContaining({ message: 'Database error' }),
    );
  });
});
