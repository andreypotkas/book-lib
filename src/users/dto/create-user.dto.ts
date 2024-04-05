import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(40)
  readonly username: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;
}
