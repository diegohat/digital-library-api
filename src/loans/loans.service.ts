import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppLogger } from '../shared/logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { BookStatus } from '@prisma/client';

@Injectable()
export class LoansService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async create(dto: CreateLoanDto) {
    this.logger.log('Loan creation requested', LoansService.name);
    this.logger.debug(`Payload: ${JSON.stringify(dto)}`, LoansService.name);
    try {
      return await this.prisma.$transaction(async (tx) => {
        const book = await tx.book.findUnique({ where: { id: dto.bookId } });
        if (!book) {
          this.logger.warn(
            `Book not found for loan. BookId: ${dto.bookId}`,
            LoansService.name,
          );
          throw new NotFoundException('Book not found');
        }
        if (book.status !== BookStatus.AVAILABLE) {
          this.logger.warn(
            `Book is not available for loan. BookId: ${dto.bookId}, Status: ${book.status}`,
            LoansService.name,
          );
          throw new BadRequestException('Book is already borrowed');
        }

        const user = await tx.user.findUnique({ where: { id: dto.userId } });
        if (!user) {
          this.logger.warn(
            `User not found for loan. UserId: ${dto.userId}`,
            LoansService.name,
          );
          throw new NotFoundException('User not found');
        }

        await tx.book.update({
          where: { id: dto.bookId },
          data: { status: BookStatus.BORROWED },
        });

        const loan = await tx.loan.create({
          data: { bookId: dto.bookId, userId: dto.userId },
        });
        this.logger.log(
          `Loan created successfully. LoanId: ${loan.id}, BookId: ${dto.bookId}, UserId: ${dto.userId}`,
          LoansService.name,
        );
        this.logger.debug(
          `Created loan: ${JSON.stringify(loan)}`,
          LoansService.name,
        );
        return loan;
      });
    } catch (error) {
      this.logger.error(
        `Failed to create loan. Payload: ${JSON.stringify(dto)}. Error: ${error.message}`,
        error.stack,
        LoansService.name,
      );
      throw error;
    }
  }

  async return(id: string, returnDate: Date) {
    this.logger.log('Loan return requested', LoansService.name);
    this.logger.debug(
      `LoanId: ${id}, ReturnDate: ${returnDate}`,
      LoansService.name,
    );
    try {
      return await this.prisma.$transaction(async (tx) => {
        const loan = await tx.loan.findUnique({ where: { id } });
        if (!loan) {
          this.logger.warn(
            `Loan not found for return. LoanId: ${id}`,
            LoansService.name,
          );
          throw new NotFoundException('Loan not found');
        }
        if (loan.returnDate) {
          this.logger.warn(
            `Loan already returned. LoanId: ${id}, ReturnDate: ${loan.returnDate}`,
            LoansService.name,
          );
          throw new BadRequestException('Book has already been returned');
        }
        await tx.book.update({
          where: { id: loan.bookId },
          data: { status: BookStatus.AVAILABLE },
        });
        const updatedLoan = await tx.loan.update({
          where: { id },
          data: { returnDate },
        });
        this.logger.log(
          `Loan returned successfully. LoanId: ${id}, BookId: ${loan.bookId}, ReturnDate: ${returnDate}`,
          LoansService.name,
        );
        this.logger.debug(
          `Updated loan: ${JSON.stringify(updatedLoan)}`,
          LoansService.name,
        );
        return updatedLoan;
      });
    } catch (error) {
      this.logger.error(
        `Failed to return loan. LoanId: ${id}, ReturnDate: ${returnDate}. Error: ${error.message}`,
        error.stack,
        LoansService.name,
      );
      throw error;
    }
  }
}
