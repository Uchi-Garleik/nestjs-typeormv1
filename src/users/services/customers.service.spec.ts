import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomersService } from './customers.service';
import { ProductsService } from '../../products/services/products.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  @Module({
    providers: [
      UsersService,
      ProductsService,
      ConfigService,
      CustomersService,
      {
        provide: getRepositoryToken(User),
        useClass: Repository,
      },
    ],
  });

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ProductsService,
        ConfigService,
        CustomersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [new User(), new User()];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      expect(await service.findAll()).toBe(users);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = new User();
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      expect(await service.findOne(1)).toBe(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const newUser = new User();
      jest.spyOn(repository, 'create').mockReturnValue(newUser);
      jest.spyOn(repository, 'save').mockResolvedValue(newUser);

      expect(await service.create({} as any)).toBe(newUser);
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      const user = new User();
      jest.spyOn(service, 'findOne').mockResolvedValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      expect(await service.update(1, {} as any)).toBe(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({} as any);

      expect(await service.remove(1)).toEqual({});
    });
  });
});
