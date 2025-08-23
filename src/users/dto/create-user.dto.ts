import { IsEmail, IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString() @MaxLength(255) @IsNotEmpty() name: string;
  @IsEmail() @MaxLength(255) @IsNotEmpty() email: string;
}
