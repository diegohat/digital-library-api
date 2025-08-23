import { Controller, Post, Body, Get, Patch, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindBooksQueryDto } from './dto/find-books-query.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'The book has been successfully created.' })
  async create(@Body() dto: CreateBookDto) {
    return await this.booksService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'List of books retrieved successfully.' })
  async findAll(
    @Query() query: FindBooksQueryDto
  ) {
    return await this.booksService.findAll(query.status, query.title);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update book status' })
  @ApiResponse({ status: 200, description: 'The book status has been successfully updated.' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookStatusDto,
  ) {
    return await this.booksService.updateStatus(id, dto.status);
  }
}
