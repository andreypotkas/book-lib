import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './register-user.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
