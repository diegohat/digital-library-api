import { validate } from 'class-validator';
import { CreateLoanDto } from './create-loan.dto';

describe('CreateLoanDto', () => {
  it('should validate with valid UUIDs', async () => {
    const dto = new CreateLoanDto();
    dto.bookId = '550e8400-e29b-41d4-a716-446655440000';
    dto.userId = '550e8400-e29b-41d4-a716-446655440001';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid bookId', async () => {
    const dto = new CreateLoanDto();
    dto.bookId = 'not-a-uuid';
    dto.userId = '550e8400-e29b-41d4-a716-446655440001';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'bookId')).toBe(true);
  });
});
