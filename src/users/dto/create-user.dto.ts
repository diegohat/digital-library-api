import { IsEmail, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString() @MaxLength(255) name: string;
  @IsEmail() @MaxLength(255) email: string;
}