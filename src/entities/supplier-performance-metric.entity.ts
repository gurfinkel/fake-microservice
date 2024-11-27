import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Supplier } from './supplier.entity';

@Entity('supplier_performance_metrics')
@Check(`"quality_rating" >= 1 AND "quality_rating" <= 5`)
export class SupplierPerformanceMetric {
  @PrimaryColumn({ name: 'supplier_id' })
  supplierId: number;

  @PrimaryColumn({ name: 'date', type: 'date' })
  date: string;

  @Column({
    name: 'cost_of_goods',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  costOfGoods: number;

  @Column({ name: 'length_of_delivery', type: 'integer', nullable: true })
  lengthOfDelivery: number;

  @Column({
    name: 'number_of_late_deliveries',
    type: 'integer',
    nullable: true,
  })
  numberOfLateDeliveries: number;

  @Column({
    name: 'number_of_recalled_products',
    type: 'integer',
    nullable: true,
  })
  numberOfRecalledProducts: number;

  @Column({ name: 'quality_rating', type: 'integer', nullable: true })
  qualityRating: number;

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

  @ManyToOne(() => Supplier, (supplier) => supplier.performanceMetrics)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;
}
