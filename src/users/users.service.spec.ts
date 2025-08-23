import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppLogger } from '../shared/logger/logger.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { createPrismaMock } from '../../test/factories/prisma.mock';
import { createLoggerMock } from '../../test/factories/logger.mock';

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: ReturnType<typeof createPrismaMock>;
  let loggerMock: ReturnType<typeof createLoggerMock>;

  beforeEach(async () => {
    prismaMock = createPrismaMock();
    loggerMock = createLoggerMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService, AppLogger],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideProvider(AppLogger)
      .useValue(loggerMock)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an user successfully', async () => {
    const dto = { name: 'Diego', email: 'diego@email.com' };
    const result = { id: 'uuid-1', ...dto, createdAt: new Date() };
    prismaMock.user.create.mockResolvedValue(result);
    expect(await service.create(dto)).toEqual(result);
    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should throw ConflictException if email is already in use', async () => {
    prismaMock.user.create.mockRejectedValue({ code: 'P2002' });
    await expect(
      service.create({ name: 'Diego', email: 'duplicate@email.com' }),
    ).rejects.toThrow(ConflictException);
  });
});
