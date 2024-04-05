import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from 'src/auth/interfaces/auth-response';
import { LoginUserDto } from './dto/login-user.dto';

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

    const tokens = this.authService.generateTokens({
      email,
      id: newUser.id,
    });

    return { ...newUser, ...tokens };
  }

  public async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    const { email, password } = loginUserDto;

    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException("User with this email doesn't exist");
    }

    const isPasswordCorrect = this.authService.validatePassword(
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

    return { ...user, ...tokens };
  }

  private findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  private async create(registerUserDto: RegisterUserDto): Promise<User> {
    const { password } = registerUserDto;

    const hashedPassword = await bcrypt.hash(password, 7);

    const newUser = this.userRepository.create({
      password: hashedPassword,
      ...registerUserDto,
    });

    return newUser;
  }
}
