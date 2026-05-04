import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { RoleSeederService } from './role-seeder.service';
import { UserSeederService } from './user-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [AuthController],
  providers: [AuthService, RoleSeederService, UserSeederService],
})
export class AuthModule {}