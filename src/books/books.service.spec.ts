import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppLogger } from '../shared/logger/logger.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BookStatus } from '@prisma/client';
import { createPrismaMock } from '../../test/factories/prisma.mock';
import { createLoggerMock } from '../../test/factories/logger.mock';

describe('BooksService', () => {
  let service: BooksService;
  let prismaMock: ReturnType<typeof createPrismaMock>;
  let loggerMock: ReturnType<typeof createLoggerMock>;

  beforeEach(async () => {
    prismaMock = createPrismaMock();
    loggerMock = createLoggerMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService, PrismaService, AppLogger],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideProvider(AppLogger)
      .useValue(loggerMock)
      .compile();
    service = module.get<BooksService>(BooksService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a book successfully', async () => {
      const dto = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        publishedYear: 2008,
        status: BookStatus.AVAILABLE,
      };
      const result = { id: 'book-1', ...dto };

      prismaMock.book.create.mockResolvedValue(result);

      expect(await service.create(dto)).toEqual(result);
      expect(prismaMock.book.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw error if prisma fails', async () => {
      const dto = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        publishedYear: 2008,
      };

      prismaMock.book.create.mockRejectedValue(new Error('DB error'));
      await expect(service.create(dto)).rejects.toThrow('DB error');
    });
  });

  describe('findAll', () => {
    it('should return books with filters', async () => {
      const result = [
        {
          id: 'book-1',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          publishedYear: 2008,
          status: BookStatus.AVAILABLE,
        },
        {
          id: 'book-2',
          title: 'Refactoring',
          author: 'Martin Fowler',
          publishedYear: 1999,
          status: BookStatus.AVAILABLE,
        },
      ];

      prismaMock.book.findMany.mockResolvedValue(result);

      const books = await service.findAll(BookStatus.AVAILABLE, 'Code');
      expect(books).toEqual(result);
      expect(prismaMock.book.findMany).toHaveBeenCalledWith({
        where: {
          status: BookStatus.AVAILABLE,
          title: { contains: 'Code', mode: 'insensitive' },
        },
        orderBy: { title: 'asc' },
      });
    });

    it('should handle errors from prisma', async () => {
      prismaMock.book.findMany.mockRejectedValue(new Error('Query failed'));

      await expect(service.findAll()).rejects.toThrow('Query failed');
    });
  });

  describe('updateStatus', () => {
    it('should update book status successfully', async () => {
      const bookId = 'book-1';
      const oldBook = { id: bookId, status: BookStatus.AVAILABLE };
      const updatedBook = { id: bookId, status: BookStatus.BORROWED };

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn({
          book: {
            findUnique: jest.fn().mockResolvedValue(oldBook),
            update: jest.fn().mockResolvedValue(updatedBook),
          },
        }),
      );

      const result = await service.updateStatus(bookId, BookStatus.BORROWED);
      expect(result).toEqual(updatedBook);
    });

    it('should throw NotFoundException if book not found', async () => {
      const bookId = 'book-404';

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn({
          book: {
            findUnique: jest.fn().mockResolvedValue(null),
            update: jest.fn(),
          },
        }),
      );

      await expect(
        service.updateStatus(bookId, BookStatus.BORROWED),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if status is unchanged', async () => {
      const bookId = 'book-1';
      const book = { id: bookId, status: BookStatus.BORROWED };

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn({
          book: {
            findUnique: jest.fn().mockResolvedValue(book),
            update: jest.fn(),
          },
        }),
      );

      await expect(
        service.updateStatus(bookId, BookStatus.BORROWED),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle transaction errors', async () => {
      (prismaMock.$transaction as jest.Mock).mockRejectedValue(
        new Error('Transaction failed'),
      );

      await expect(
        service.updateStatus('book-1', BookStatus.BORROWED),
      ).rejects.toThrow('Transaction failed');
    });
  });
});
