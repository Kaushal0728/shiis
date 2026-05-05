import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async login(loginDto: LoginDto) {
    const username = loginDto.username.trim();

    // Fetch by username only — never compare plain passwords in a query
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Constant-time bcrypt comparison
    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return {
      user: {
        id: user.userId,
        username: user.username,
        roleId: user.role?.roleId ?? null,
        roleName: user.role?.roleName ?? 'User',
      },
    };
  }
}
