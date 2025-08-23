import { Test, TestingModule } from '@nestjs/testing';
import { LoansService } from './loans.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppLogger } from '../shared/logger/logger.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BookStatus } from '@prisma/client';
import { createPrismaMock } from '../../test/factories/prisma.mock';
import { createLoggerMock } from '../../test/factories/logger.mock';

describe('LoansService', () => {
  let service: LoansService;
  let prismaMock: ReturnType<typeof createPrismaMock>;
  let loggerMock: ReturnType<typeof createLoggerMock>;

  beforeEach(async () => {
    prismaMock = createPrismaMock();
    loggerMock = createLoggerMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoansService, PrismaService, AppLogger],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideProvider(AppLogger)
      .useValue(loggerMock)
      .compile();

    service = module.get<LoansService>(LoansService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto = {
      bookId: 'book-1',
      userId: 'user-1',
    };

    it('should create a loan successfully', async () => {
      const loan = { id: 'loan-1', ...dto };

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn({
          book: {
            findUnique: jest.fn().mockResolvedValue({
              id: dto.bookId,
              status: BookStatus.AVAILABLE,
            }),
            update: jest.fn().mockResolvedValue({}),
          },
          user: {
            findUnique: jest.fn().mockResolvedValue({ id: dto.userId }),
          },
          loan: {
            create: jest.fn().mockResolvedValue(loan),
          },
        }),
      );

      const result = await service.create(dto);
      expect(result).toEqual(loan);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn({
          book: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        }),
      );

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if book is already borrowed', async () => {
      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn({
          book: {
            findUnique: jest
              .fn()
              .mockResolvedValue({ status: BookStatus.BORROWED }),
          },
        }),
      );

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn({
          book: {
            findUnique: jest
              .fn()
              .mockResolvedValue({ status: BookStatus.AVAILABLE }),
            update: jest.fn(),
          },
          user: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        }),
      );

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should propagate unexpected errors', async () => {
      (prismaMock.$transaction as jest.Mock).mockRejectedValue(
        new Error('Unexpected'),
      );

      await expect(service.create(dto)).rejects.toThrow('Unexpected');
    });
  });

  describe('return', () => {
    const loanId = 'loan-1';
    const returnDate = new Date();

    it('should return a loan successfully', async () => {
      const loan = { id: loanId, bookId: 'book-1', returnDate: null };
      const updatedLoan = { ...loan, returnDate };

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn({
          loan: {
            findUnique: jest.fn().mockResolvedValue(loan),
            update: jest.fn().mockResolvedValue(updatedLoan),
          },
          book: {
            update: jest.fn().mockResolvedValue({}),
          },
        }),
      );

      const result = await service.return(loanId, returnDate);
      expect(result).toEqual(updatedLoan);
    });

    it('should throw NotFoundException if loan does not exist', async () => {
      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn({
          loan: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        }),
      );

      await expect(service.return(loanId, returnDate)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if loan already returned', async () => {
      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn({
          loan: {
            findUnique: jest.fn().mockResolvedValue({ returnDate: new Date() }),
          },
        }),
      );

      await expect(service.return(loanId, returnDate)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should propagate unexpected errors', async () => {
      (prismaMock.$transaction as jest.Mock).mockRejectedValue(
        new Error('Unexpected'),
      );

      await expect(service.return(loanId, returnDate)).rejects.toThrow(
        'Unexpected',
      );
    });
  });
});
