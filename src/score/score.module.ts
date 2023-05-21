import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './score.entity';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { PredictionModule } from 'src/prediction/prediction.module';
import { Group } from 'src/group/group.entity';
import { Race } from 'src/race/race.entity';
import { BonusStat } from 'src/bonus-stat/bonus-stat.entity';

@Module({
  imports: [
    PredictionModule,
    TypeOrmModule.forFeature([Score]),
    TypeOrmModule.forFeature([Group]),
    TypeOrmModule.forFeature([Race]),
    TypeOrmModule.forFeature([BonusStat]),
  ],
  providers: [ScoreService],
  controllers: [ScoreController],
  exports: [ScoreService],
})
export class ScoreModule {}
