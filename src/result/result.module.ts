import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './result.entity';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { ScoreModule } from 'src/score/score.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Result]), ScoreModule, GroupModule],
  providers: [ResultService],
  controllers: [ResultController],
})
export class ResultModule {}
