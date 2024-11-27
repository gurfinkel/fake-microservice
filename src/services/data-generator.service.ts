import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class DataGeneratorService {
  constructor(@InjectQueue('data-generation') private readonly queue: Queue) {
    this.addDataGenerationJob();
  }

  async addDataGenerationJob() {
    await this.queue.add(
      'generate-data',
      {},
      { repeat: { every: 2 * 60 * 1000 } }, // Every 2 minutes
    );
  }
}
