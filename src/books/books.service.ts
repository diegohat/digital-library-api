import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BookStatus } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    return await this.prisma.book.create({ data: dto });
  }

  async findAll(status?: BookStatus, title?: string) {
    return await this.prisma.book.findMany({
      where: {
        status,
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
      },
      orderBy: { title: 'asc' },
    });
  }

  async updateStatus(id: string, status: BookStatus) {
    return await this.prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id } });
      if (!book) throw new NotFoundException('Livro não encontrado');
      return await tx.book.update({ where: { id }, data: { status } });
    });
  }
}