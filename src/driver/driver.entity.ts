import { BonusStat } from 'src/bonus-stat/bonus-stat.entity';
import { Prediction } from 'src/prediction/prediction.entity';
import { Race } from 'src/race/race.entity';
import { Result } from 'src/result/result.entity';
import { Team } from 'src/team/team.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'driver' })
export class Driver {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name?: string;

  @ManyToOne(() => Team, (team) => team.drivers, { nullable: true })
  team?: Relation<Team>;

  @Column({ nullable: true })
  teamId?: number;

  @OneToMany(() => Prediction, (prediction) => prediction.driver, {
    nullable: true,
  })
  predictions?: Relation<Prediction[]>;

  @OneToMany(() => Result, (result) => result.driver, {
    nullable: true,
  })
  results?: Relation<Result[]>;

  @OneToMany(() => Race, (race) => race.fastestLapDriver, {
    nullable: true,
  })
  fastestLapRaces?: Relation<Race[]>;

  @ManyToMany(() => Race, (race) => race.dnfDrivers, {
    nullable: true,
    cascade: true,
  })
  @JoinTable()
  dnfRaces?: Relation<Race[]>;

  @OneToMany(() => BonusStat, (bonusStat) => bonusStat.bonusStatDict, {
    nullable: true,
  })
  bonusStats?: Relation<BonusStat[]>;
}
