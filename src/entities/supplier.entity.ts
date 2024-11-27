import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SupplierPerformanceMetric } from './supplier-performance-metric.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn({ name: 'supplier_id', type: 'integer' })
  supplierId: number;

  @Column({ name: 'supplier_name', type: 'varchar', length: 255 })
  supplierName: string;

  @Column({ name: 'contact_info', type: 'text', nullable: true })
  contactInfo: string;

  @Column({
    name: 'financial_stability_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  financialStabilityScore: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => SupplierPerformanceMetric, (metric) => metric.supplier)
  performanceMetrics: SupplierPerformanceMetric[];
}
