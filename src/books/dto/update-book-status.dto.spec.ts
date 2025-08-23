import { validate } from 'class-validator';
import { UpdateBookStatusDto } from './update-book-status.dto';
import { BookStatus } from '@prisma/client';

describe('UpdateBookStatusDto', () => {
  it('should validate with valid status', async () => {
    const dto = new UpdateBookStatusDto();
    dto.status = BookStatus.BORROWED;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid status', async () => {
    const dto = new UpdateBookStatusDto();
    // @ts-ignore
    dto.status = 'INVALID';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'status')).toBe(true);
  });
});
