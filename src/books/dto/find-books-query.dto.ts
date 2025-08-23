import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookStatus } from '@prisma/client';

export class FindBooksQueryDto {
  @ApiPropertyOptional({ enum: BookStatus, description: 'Book status' })
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;

  @ApiPropertyOptional({ example: 'Clean Code', description: 'Book title' })
  @IsOptional()
  @IsString()
  title?: string;
}
