import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Email } from '../entities/email.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
  ) {}

  async sendEmail(emailData: Partial<Email>): Promise<Email> {
    const email = this.emailRepository.create(emailData);
    email.dateSent = new Date();
    const savedEmail = await this.emailRepository.save(email);

    // Implement actual email sending logic here if required
    // For example, using Nodemailer

    return savedEmail;
  }
}
