import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Role' })
export class RoleEntity {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'role_name', type: 'varchar', length: 100, nullable: true })
  roleName: string | null;
}