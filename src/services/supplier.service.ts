import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supplier } from '../entities/supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async addSupplier(supplierData: Partial<Supplier>): Promise<Supplier> {
    const supplier = this.supplierRepository.create(supplierData);
    return await this.supplierRepository.save(supplier);
  }

  async getSuppliers(): Promise<Supplier[]> {
    return await this.supplierRepository.find();
  }

  async findSupplierById(supplierId: number): Promise<Supplier> {
    return await this.supplierRepository.findOneBy({ supplierId });
  }
}
