import { Race } from 'src/race/race.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
} from 'typeorm';

@Entity('season')
export class Season {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name?: string;

  @OneToMany(() => Race, (race) => race.season, { nullable: true })
  races?: Relation<Race[]>;
}
