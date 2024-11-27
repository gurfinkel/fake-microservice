import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SupplierComparisonService {
  constructor(
    @InjectQueue('supplier-comparison') private readonly queue: Queue,
  ) {
    this.addSupplierComparisonJob();
  }

  async addSupplierComparisonJob() {
    await this.queue.add(
      'compare-suppliers',
      {},
      { repeat: { every: 3 * 60 * 1000 } }, // Every 3 minutes
    );
  }
}
