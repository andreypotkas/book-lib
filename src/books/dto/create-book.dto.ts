import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @IsNumber()
  @IsNotEmpty()
  readonly yearOfPublication: number;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
}
