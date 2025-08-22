import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { BookStatus } from '@prisma/client';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLoanDto) {
    return await this.prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: dto.bookId } });
      if (!book) throw new NotFoundException('Book not found');
      if (book.status !== BookStatus.AVAILABLE) {
        throw new BadRequestException('Book is already borrowed');
      }

      const user = await tx.user.findUnique({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException('User not found');

      await tx.book.update({ where: { id: dto.bookId }, data: { status: BookStatus.BORROWED } });

      return await tx.loan.create({ data: { bookId: dto.bookId, userId: dto.userId } });
    });
  }

  async return(id: string) {
    return await this.prisma.$transaction(async (tx) => {
      const loan = await tx.loan.findUnique({ where: { id } });
      if (!loan) throw new NotFoundException('Loan not found');
      if (loan.returnDate) throw new BadRequestException('Book has already been returned');

      await tx.book.update({ where: { id: loan.bookId }, data: { status: BookStatus.AVAILABLE } });

      return await tx.loan.update({ where: { id }, data: { returnDate: new Date() } });
    });
  }
}
