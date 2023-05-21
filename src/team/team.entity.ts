import { Driver } from 'src/driver/driver.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
} from 'typeorm';

@Entity({ name: 'team' })
export class Team {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  color: string;

  @OneToMany(() => Driver, (driver) => driver.team, {
    nullable: true,
  })
  drivers?: Relation<Driver[]>;
}
