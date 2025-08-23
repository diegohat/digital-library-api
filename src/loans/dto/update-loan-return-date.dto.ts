import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLoanReturnDateDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  returnDate: Date;
}
