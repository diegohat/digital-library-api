import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new CreateUserDto();
    dto.name = 'Diego Trindade';
    dto.email = 'diego@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    const dto = new CreateUserDto();
    dto.name = '';
    dto.email = 'diego@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail if email is invalid', async () => {
    const dto = new CreateUserDto();
    dto.name = 'Diego';
    dto.email = 'not-an-email';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail if name exceeds max length', async () => {
    const dto = new CreateUserDto();
    dto.name = 'a'.repeat(256);
    dto.email = 'diego@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });
});
