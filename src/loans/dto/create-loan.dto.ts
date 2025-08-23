import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Book ID' })
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
