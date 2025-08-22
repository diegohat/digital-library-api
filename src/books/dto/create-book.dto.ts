import { IsEnum, IsInt, IsString, MaxLength, Min } from 'class-validator';
import { BookStatus } from '@prisma/client';

export class CreateBookDto {
  @IsString() @MaxLength(255) title: string;
  @IsString() @MaxLength(255) author: string;
  @IsInt() @Min(0) publishedYear: number;
  @IsEnum(BookStatus) status?: BookStatus;
}