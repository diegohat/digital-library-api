import {
  IsEnum,
  IsInt,
  IsString,
  MaxLength,
  Min,
  IsOptional,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { BookStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Gatsby', description: 'book title' })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald', description: 'book author' })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: 1925, description: 'book published year' })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  publishedYear: number;

  @ApiProperty({ example: BookStatus.AVAILABLE, description: 'book status', enum: BookStatus })
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;
}
