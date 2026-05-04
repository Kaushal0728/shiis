import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from '../auth/entities/user.entity';
import { RoleEntity } from '../auth/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
