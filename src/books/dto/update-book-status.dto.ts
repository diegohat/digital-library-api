import { IsEnum } from 'class-validator';
import { BookStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookStatusDto {
  @ApiProperty({ example: BookStatus.AVAILABLE, description: 'book status', enum: BookStatus })
  @IsEnum(BookStatus)
  status: BookStatus;
}
