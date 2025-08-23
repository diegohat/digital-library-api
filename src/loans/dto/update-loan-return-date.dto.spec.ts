import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateLoanReturnDateDto } from './update-loan-return-date.dto';

describe('UpdateLoanReturnDateDto', () => {
  it('should validate with valid date', async () => {
    const plain = { returnDate: new Date().toISOString() };
    const dto = plainToInstance(UpdateLoanReturnDateDto, plain);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid date', async () => {
    const plain = { returnDate: 'not-a-date' };
    const dto = plainToInstance(UpdateLoanReturnDateDto, plain);

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'returnDate')).toBe(true);
  });
});
