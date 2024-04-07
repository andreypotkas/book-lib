import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { AuthResponse } from 'src/auth/interfaces/auth-response';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  public async register(
    registerUserDto: RegisterUserDto,
  ): Promise<AuthResponse> {
    const { email } = registerUserDto;

    const user = await this.findOneByEmail(email);

    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.create(registerUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = newUser;

    const tokens = this.authService.generateTokens({
      email,
      id: newUser.id,
    });

    return { ...rest, ...tokens };
  }

  public async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    const { email, password } = loginUserDto;

    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException("User with this email doesn't exist");
    }

    const isPasswordCorrect = await this.authService.validatePassword(
      user.password,
      password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect password');
    }

    const tokens = this.authService.generateTokens({
      email,
      id: user.id,
    });

    const userPlainObject = instanceToPlain(user) as Omit<User, 'password'>;

    return { ...userPlainObject, ...tokens };
  }

  private async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  private async create(registerUserDto: RegisterUserDto): Promise<User> {
    const { password } = registerUserDto;
    const hashedPassword = await bcrypt.hash(password, 7);

    const newUser = this.userRepository.save({
      ...registerUserDto,
      password: hashedPassword,
    });

    return newUser;
  }
}
