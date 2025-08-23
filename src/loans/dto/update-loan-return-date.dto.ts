import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLoanReturnDateDto {
  @ApiProperty({ example: '2023-03-15T12:00:00Z', description: 'Return date ISO String' })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  returnDate: Date;
}
