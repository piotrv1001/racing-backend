import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusStatDict } from './bonus-stat-dict.entity';
import { BonusStatDictService } from './bonus-stat-dict.service';
import { BonusStatDictController } from './bonus-stat-dict.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BonusStatDict])],
  providers: [BonusStatDictService],
  controllers: [BonusStatDictController],
})
export class BonusStatDictModule {}
