import { Driver } from 'src/driver/driver.entity';
import { Race } from 'src/race/race.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'result' })
export class Result {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  position?: number;

  @ManyToOne(() => Race, (race) => race.results, { nullable: true })
  race?: Relation<Race>;

  @ManyToOne(() => Driver, (driver) => driver.results, { nullable: true })
  driver?: Relation<Driver>;

  @Column({ nullable: true })
  raceId?: number;

  @Column({ nullable: true })
  driverId?: number;
}
