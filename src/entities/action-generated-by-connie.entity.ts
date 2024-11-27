import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SuppliersToEvaluate } from './suppliers-to-evaluate.entity';
import { Supplier } from './supplier.entity';

@Entity('actions_generated_by_connie')
export class ActionGeneratedByConnie {
  @PrimaryGeneratedColumn({ name: 'action_id' })
  actionId: number;

  @Column({ name: 'recommendation_id', type: 'integer', nullable: true })
  recommendationId: number;

  @Column({ name: 'supplier_id', type: 'integer', nullable: true })
  supplierId: number;

  @Column({ name: 'date', type: 'date', nullable: true })
  date: string;

  @Column({ name: 'action_type', type: 'varchar', length: 255 })
  actionType: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 50,
    default: 'pending',
    nullable: true,
  })
  status: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => SuppliersToEvaluate)
  @JoinColumn({ name: 'recommendation_id' })
  recommendation: SuppliersToEvaluate;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;
}
