import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';
import { BookStatus } from '@prisma/client';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() dto: CreateBookDto) {
    return await this.booksService.create(dto);
  }

  @Get()
  async findAll(
    @Query('status') status?: BookStatus,
    @Query('title') title?: string,
  ) {
    return await this.booksService.findAll(status, title);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookStatusDto,
  ) {
    return await this.booksService.updateStatus(id, dto.status);
  }
}
