import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';

@Entity('suppliers_to_evaluate')
export class SuppliersToEvaluate {
  @PrimaryGeneratedColumn({ name: 'recommendation_id' })
  recommendationId: number;

  @Column({ name: 'supplier_1', type: 'integer' })
  supplier1Id: number;

  @Column({ name: 'supplier_2', type: 'integer' })
  supplier2Id: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_1' })
  supplier1: Supplier;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_2' })
  supplier2: Supplier;
}
