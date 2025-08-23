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

export class CreateBookDto {
  @IsString() @MaxLength(255) @IsNotEmpty() title: string;
  @IsString() @MaxLength(255) @IsNotEmpty() author: string;
  @IsInt() @IsPositive() @IsNotEmpty() publishedYear: number;
  @IsOptional() @IsEnum(BookStatus) status?: BookStatus;
}
