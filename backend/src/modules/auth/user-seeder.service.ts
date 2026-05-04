import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';

const DEFAULT_USERS = [
  { username: 'admin', password: 'admin123', roleName: 'admin' },
  { username: 'doctor', password: 'doctor123', roleName: 'doctor' },
  { username: 'lab', password: 'lab123', roleName: 'lab' },
];

@Injectable()
export class UserSeederService implements OnModuleInit {
  private readonly logger = new Logger(UserSeederService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async onModuleInit() {
    const existingUsers = await this.userRepository.count();

    if (existingUsers > 0) {
      return;
    }

    const seededUsers: UserEntity[] = [];

    for (const defaultUser of DEFAULT_USERS) {
      const role = await this.roleRepository.findOne({
        where: { roleName: defaultUser.roleName },
      });

      if (!role) {
        this.logger.warn(`Skipping user ${defaultUser.username}: role ${defaultUser.roleName} not found`);
        continue;
      }

      seededUsers.push(
        this.userRepository.create({
          username: defaultUser.username,
          password: defaultUser.password,
          role,
        }),
      );
    }

    if (seededUsers.length === 0) {
      return;
    }

    await this.userRepository.save(seededUsers);
    this.logger.log(`Seeded ${seededUsers.length} default users`);
  }
}