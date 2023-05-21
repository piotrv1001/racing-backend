import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusStat } from 'src/bonus-stat/bonus-stat.entity';
import { Group } from 'src/group/group.entity';
import { GroupModule } from 'src/group/group.module';
import { PredictionController } from 'src/prediction/prediction.controller';
import { Prediction } from 'src/prediction/prediction.entity';
import { PredictionService } from 'src/prediction/prediction.service';
import { Race } from 'src/race/race.entity';
import { ResultController } from 'src/result/result.controller';
import { Result } from 'src/result/result.entity';
import { ResultService } from 'src/result/result.service';
import { ScoreController } from 'src/score/score.controller';
import { Score } from 'src/score/score.entity';
import { ScoreService } from 'src/score/score.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prediction]),
    TypeOrmModule.forFeature([Group]),
    TypeOrmModule.forFeature([Score]),
    TypeOrmModule.forFeature([Race]),
    TypeOrmModule.forFeature([BonusStat]),
    TypeOrmModule.forFeature([Result]),
    GroupModule,
  ],
  providers: [PredictionService, ScoreService, ResultService],
  controllers: [PredictionController, ScoreController, ResultController],
  exports: [PredictionService, ScoreService, ResultService],
})
export class SharedModule {}
