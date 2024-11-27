import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SuppliersToEvaluate } from '../entities/suppliers-to-evaluate.entity';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(SuppliersToEvaluate)
    private readonly suppliersToEvaluateRepository: Repository<SuppliersToEvaluate>,
  ) {}

  async createRecommendation(
    recommendationData: Partial<SuppliersToEvaluate>,
  ): Promise<SuppliersToEvaluate> {
    const recommendation =
      this.suppliersToEvaluateRepository.create(recommendationData);
    return await this.suppliersToEvaluateRepository.save(recommendation);
  }
}
