import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateLoanDto {
  @IsUUID() @IsNotEmpty() bookId: string;
  @IsUUID() @IsNotEmpty() userId: string;
}