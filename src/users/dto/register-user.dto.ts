import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MaxLength(40)
  readonly username: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
