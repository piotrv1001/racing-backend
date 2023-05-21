import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Season } from './season.entity';
import { SeasonService } from './season.service';
import { SeasonController } from './season.controller';
import { Race } from 'src/race/race.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Season]),
    TypeOrmModule.forFeature([Race]),
  ],
  providers: [SeasonService],
  controllers: [SeasonController],
})
export class SeasonModule {}
