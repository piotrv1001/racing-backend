import { BonusStatDict } from 'src/bonus-stat-dict/bonus-stat-dict.entity';
import { Driver } from 'src/driver/driver.entity';
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

@Entity({ name: 'bonus_stat' })
export class BonusStat {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true, type: 'decimal', precision: 3, scale: 1 })
  points?: number;

  @ManyToOne(() => BonusStatDict, (bonusStatDict) => bonusStatDict.bonusStats, {
    nullable: true,
  })
  bonusStatDict?: Relation<BonusStatDict>;

  @Column({ nullable: true })
  bonusStatDictId?: number;

  @ManyToOne(() => Race, (race) => race.bonusStats, {
    nullable: true,
  })
  race?: Relation<Race>;

  @Column({ nullable: true })
  raceId?: number;

  @ManyToOne(() => Group, (group) => group.bonusStats, {
    nullable: true,
  })
  group?: Relation<Race>;

  @Column({ nullable: true })
  groupId?: number;

  @ManyToOne(() => User, (user) => user.bonusStats, {
    nullable: true,
  })
  user?: Relation<Race>;

  @Column({ nullable: true })
  userId?: number;

  @ManyToOne(() => Driver, (driver) => driver.bonusStats, {
    nullable: true,
  })
  driver?: Relation<Driver>;

  @Column({ nullable: true })
  driverId?: number;
}
