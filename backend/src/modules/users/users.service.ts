import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { RoleEntity } from '../auth/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  private toResponse(user: UserEntity) {
    return {
      userId: user.userId,
      username: user.username,
      roleId: user.role?.roleId ?? null,
      roleName: user.role?.roleName ?? null,
    };
  }

  private async findRole(roleName: string) {
    const role = await this.roleRepository.findOne({
      where: { roleName },
    });

    if (!role) {
      throw new BadRequestException(`Role '${roleName}' not found`);
    }

    return role;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAndCount({
      order: { userId: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: data.map((item) => this.toResponse(item)),
      total,
      page,
      limit,
    };
  }

  async search(query: string) {
    const data = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.username LIKE :query', { query: `%${query}%` })
      .orderBy('user.user_id', 'DESC')
      .getMany();

    return data.map((item) => this.toResponse(item));
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { userId: id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.toResponse(user);
  }

  async create(dto: CreateUserDto) {
    const role = await this.findRole(dto.roleName);

    const user = this.userRepository.create({
      username: dto.username.trim(),
      password: dto.password,
      role,
    });

    const saved = await this.userRepository.save(user);
    this.logger.log(`Created user ID ${saved.userId}`);
    return this.toResponse(saved);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { userId: id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (dto.username !== undefined) {
      user.username = dto.username.trim();
    }

    if (dto.password) {
      user.password = dto.password;
    }

    if (dto.roleName) {
      user.role = await this.findRole(dto.roleName);
    }

    const updated = await this.userRepository.save(user);
    this.logger.log(`Updated user ID ${id}`);
    return this.toResponse(updated);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { userId: id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);
    this.logger.log(`Deleted user ID ${id}`);
    return { message: `User ${id} deleted successfully` };
  }
}
