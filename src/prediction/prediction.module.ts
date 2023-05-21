import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './prediction.entity';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { Group } from 'src/group/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prediction]),
    TypeOrmModule.forFeature([Group]),
  ],
  providers: [PredictionService],
  controllers: [PredictionController],
  exports: [PredictionService],
})
export class PredictionModule {}
