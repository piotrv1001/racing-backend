import { Driver } from 'src/driver/driver.entity';
import { Group } from 'src/group/group.entity';
import { Race } from 'src/race/race.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
} from 'typeorm';

@Entity({ name: 'prediction' })
export class Prediction {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  predictedPosition?: number;

  @ManyToOne(() => Driver, (driver) => driver.predictions, { nullable: true })
  driver?: Relation<Driver>;

  @ManyToOne(() => User, (user) => user.predictions, { nullable: true })
  user?: Relation<User>;

  @ManyToOne(() => Race, (race) => race.predictions, { nullable: true })
  race?: Relation<Race>;

  @ManyToOne(() => Group, (group) => group.predictions, { nullable: true })
  group?: Relation<Group>;

  @Column({ nullable: true })
  driverId?: number;

  @Column({ nullable: true })
  userId?: number;

  @Column({ nullable: true })
  raceId?: number;

  @Column({ nullable: true })
  groupId?: number;
}
