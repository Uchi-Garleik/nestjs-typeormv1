import { Injectable, NotFoundException } from '@nestjs/common';

import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(@InjectRepository(Customer) private customerRepo: Repository<Customer>){}
  private counterId = 1;


  findAll() {
    // return this.customers;
    return this.customerRepo.find();
  }

  async findOne(id: number) {

    const customer = await this.customerRepo.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return null;
  }

  create(data: CreateCustomerDto) {
    const newCustomer = this.customerRepo.create(data);
    // Encuentra las coincidencias y las actualiza
    return this.customerRepo.save(newCustomer);
  }

  async update(id: number, changes: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    this.customerRepo.merge(customer, changes);
    return this.customerRepo.save(customer);
  }

  remove(id: number) {
    return this.customerRepo.delete(id);
  }
}
