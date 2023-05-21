import { BonusStat } from 'src/bonus-stat/bonus-stat.entity';
import { Group } from 'src/group/group.entity';
import { Prediction } from 'src/prediction/prediction.entity';
import { Score } from 'src/score/score.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  ManyToMany,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true, default: 0 })
  isAdmin?: number;

  @OneToMany(() => Prediction, (prediction) => prediction.user, {
    nullable: true,
  })
  predictions?: Relation<Prediction[]>;

  @OneToMany(() => Score, (score) => score.user, {
    nullable: true,
  })
  scores?: Relation<Score[]>;

  @ManyToMany(() => Group, (group) => group.users, { nullable: true })
  groups?: Relation<Group[]>;

  @OneToMany(() => BonusStat, (bonusStat) => bonusStat.bonusStatDict, {
    nullable: true,
  })
  bonusStats?: Relation<BonusStat[]>;
}
