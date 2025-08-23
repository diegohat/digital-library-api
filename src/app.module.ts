import { Module } from '@nestjs/common';
import { LoggerModule } from './shared/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    PrismaModule,
    BooksModule,
    UsersModule,
    LoansModule,
  ],
})
export class AppModule {}
