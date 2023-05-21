import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusStat } from './bonus-stat.entity';
import { BonusStatService } from './bonus-stat.service';
import { BonusStatController } from './bonus-stat.controller';
import { Group } from 'src/group/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BonusStat]),
    TypeOrmModule.forFeature([Group]),
  ],
  providers: [BonusStatService],
  controllers: [BonusStatController],
})
export class BonusStatModule {}
