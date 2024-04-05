import { User } from 'src/users/entities/user.entity';
import { AuthTokens } from './tokens';

export interface AuthResponse extends Omit<User, 'password'>, AuthTokens {}
