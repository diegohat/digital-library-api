import { validate } from 'class-validator';
import { CreateBookDto } from './create-book.dto';
import { BookStatus } from '@prisma/client';

describe('CreateBookDto', () => {
  it('should validate with correct data', async () => {
    const dto = new CreateBookDto();
    dto.title = 'Clean Code';
    dto.author = 'Robert C. Martin';
    dto.publishedYear = 2008;
    dto.status = BookStatus.AVAILABLE;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with empty title', async () => {
    const dto = new CreateBookDto();
    dto.title = '';
    dto.author = 'Author';
    dto.publishedYear = 2020;

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'title')).toBe(true);
  });

  it('should fail with negative publishedYear', async () => {
    const dto = new CreateBookDto();
    dto.title = 'Book';
    dto.author = 'Author';
    dto.publishedYear = -1990;

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'publishedYear')).toBe(true);
  });

  it('should fail with invalid status', async () => {
    const dto = new CreateBookDto();
    dto.title = 'Book';
    dto.author = 'Author';
    dto.publishedYear = 2020;
    // @ts-ignore
    dto.status = 'INVALID_STATUS';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'status')).toBe(true);
  });
});
