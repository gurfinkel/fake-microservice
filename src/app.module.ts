import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { Supplier } from './entities/supplier.entity';
import { SupplierPerformanceMetric } from './entities/supplier-performance-metric.entity';
import { SuppliersToEvaluate } from './entities/suppliers-to-evaluate.entity';
import { ActionGeneratedByConnie } from './entities/action-generated-by-connie.entity';
import { Email } from './entities/email.entity';

import { AppService } from './app.service';
import { DataGeneratorService } from './services/data-generator.service';
import { SupplierComparisonService } from './services/supplier-comparison.service';
import { EmailService } from './services/email.service';
import { ActionService } from './services/action.service';
import { PerformanceMetricService } from './services/performance-metric.service';
import { RecommendationService } from './services/recommendation.service';
import { SupplierService } from './services/supplier.service';

import { SupplierComparisonProcessor } from './processors/supplier-comparison.processor';
import { DataGeneratorProcessor } from './processors/data-generator.processor';

import { HealthController } from './health.controller';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: 'data-generation',
      },
      {
        name: 'supplier-comparison',
      },
    ),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'yourpassword',
      database: process.env.DB_NAME || 'supplier_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([
      Supplier,
      SupplierPerformanceMetric,
      SuppliersToEvaluate,
      ActionGeneratedByConnie,
      Email,
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [HealthController],
  providers: [
    AppService,
    SupplierService,
    PerformanceMetricService,
    RecommendationService,
    ActionService,
    EmailService,
    DataGeneratorService,
    SupplierComparisonService,
    DataGeneratorProcessor,
    SupplierComparisonProcessor,
  ],
})
export class AppModule {}
