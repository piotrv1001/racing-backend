import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Race } from './race.entity';
import { RaceService } from './race.service';
import { RaceController } from './race.controller';
import { Driver } from 'src/driver/driver.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Race]),
    TypeOrmModule.forFeature([Driver]),
  ],
  providers: [RaceService],
  controllers: [RaceController],
})
export class RaceModule {}
