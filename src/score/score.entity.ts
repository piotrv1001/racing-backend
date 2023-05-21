import { Group } from 'src/group/group.entity';
import { Race } from 'src/race/race.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'score' })
export class Score {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true, type: 'decimal', precision: 3, scale: 1 })
  points?: number;

  @Column({ nullable: true })
  position?: number;

  @ManyToOne(() => User, (user) => user.scores, { nullable: true })
  user?: Relation<User>;

  @ManyToOne(() => Race, (race) => race.scores, { nullable: true })
  race?: Relation<Race>;

  @ManyToOne(() => Group, (group) => group.scores, { nullable: true })
  group?: Relation<Group>;

  @Column({ nullable: true })
  userId?: number;

  @Column({ nullable: true })
  raceId?: number;

  @Column({ nullable: true })
  groupId?: number;
}
