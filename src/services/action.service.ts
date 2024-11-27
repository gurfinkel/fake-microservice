import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActionGeneratedByConnie } from '../entities/action-generated-by-connie.entity';
import { SupplierService } from './supplier.service';
import { EmailService } from './email.service';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(ActionGeneratedByConnie)
    private readonly actionRepository: Repository<ActionGeneratedByConnie>,
    private readonly supplierService: SupplierService,
    private readonly emailService: EmailService,
  ) {}

  async createAction(
    actionData: Partial<ActionGeneratedByConnie>,
  ): Promise<ActionGeneratedByConnie> {
    const action = this.actionRepository.create(actionData);
    const savedAction = await this.actionRepository.save(action);

    if (action.actionType === 'Email') {
      const supplier = await this.supplierService.findSupplierById(
        action.supplierId,
      );

      if (supplier) {
        await this.emailService.sendEmail({
          actionId: savedAction.actionId,
          toAddress: supplier.contactInfo,
          fromAddress: 'connie@company.com',
          subject: 'Capacity Inquiry',
          body: `Dear ${supplier.supplierName},\n\nWe are interested in increasing our orders. Do you have capacity to deliver more goods?\n\nBest regards,\nConnie`,
        });
      }
    }

    return savedAction;
  }
}
