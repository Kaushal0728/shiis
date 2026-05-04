import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'User' })
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'username', type: 'varchar', length: 100, nullable: true })
  username: string | null;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: true })
  password: string | null;

  @ManyToOne(() => RoleEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity | null;
}