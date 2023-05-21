import { BonusStat } from 'src/bonus-stat/bonus-stat.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'bonus_stat_dict' })
export class BonusStatDict {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name?: string;

  @OneToMany(() => BonusStat, (bonusStat) => bonusStat.bonusStatDict, {
    nullable: true,
  })
  bonusStats?: Relation<BonusStat[]>;
}
