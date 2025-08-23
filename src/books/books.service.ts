import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppLogger } from '../shared/logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BookStatus } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async create(dto: CreateBookDto) {
    this.logger.log(`Book creation requested`, BooksService.name);
    this.logger.debug(`Payload: ${JSON.stringify(dto)}`, BooksService.name);
    try {
      const result = await this.prisma.book.create({ data: dto });
      this.logger.log(
        `Book created successfully (id: ${result.id})`,
        BooksService.name,
      );
      this.logger.debug(
        `Created book: ${JSON.stringify(result)}`,
        BooksService.name,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to create book. Payload: ${JSON.stringify(dto)}. Error: ${error.message}`,
        error.stack,
        BooksService.name,
      );
      throw error;
    }
  }

  async findAll(status?: BookStatus, title?: string) {
    this.logger.log('Books fetch requested', BooksService.name);
    this.logger.debug(
      `Filters - status: ${status}, title: ${title}`,
      BooksService.name,
    );
    try {
      const result = await this.prisma.book.findMany({
        where: {
          status,
          title: title ? { contains: title, mode: 'insensitive' } : undefined,
        },
        orderBy: { title: 'asc' },
      });
      this.logger.log(
        `Books fetch successful. Count: ${result.length}`,
        BooksService.name,
      );
      this.logger.debug(
        `Books found: ${JSON.stringify(result.map((b) => b.id))}`,
        BooksService.name,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch books. Filters - status: ${status}, title: ${title}. Error: ${error.message}`,
        error.stack,
        BooksService.name,
      );
      throw error;
    }
  }

  async updateStatus(id: string, status: BookStatus) {
    this.logger.log(`Book status update requested`, BooksService.name);
    this.logger.debug(
      `Book id: ${id}, New status: ${status}`,
      BooksService.name,
    );
    try {
      return await this.prisma.$transaction(async (tx) => {
        const book = await tx.book.findUnique({ where: { id } });
        if (!book) {
          this.logger.warn(
            `Book not found for status update. Id: ${id}`,
            BooksService.name,
          );
          throw new NotFoundException(`Book with id '${id}' not found`);
        }
        if (book.status === status) {
          this.logger.warn(
            `Book status already '${status}'. Id: ${id}`,
            BooksService.name,
          );
          throw new BadRequestException(`Book status is already '${status}'`);
        }
        const updated = await tx.book.update({
          where: { id },
          data: { status },
        });
        this.logger.log(
          `Book status updated successfully. Id: ${id}, New status: ${status}`,
          BooksService.name,
        );
        this.logger.debug(
          `Updated book: ${JSON.stringify(updated)}`,
          BooksService.name,
        );
        return updated;
      });
    } catch (error) {
      this.logger.error(
        `Failed to update book status. Id: ${id}, New status: ${status}. Error: ${error.message}`,
        error.stack,
        BooksService.name,
      );
      throw error;
    }
  }
}
