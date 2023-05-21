import { Controller, Get, Param, Delete, Post, Request } from '@nestjs/common';
import { BonusStatDictService } from './bonus-stat-dict.service';
import { BonusStatDict } from './bonus-stat-dict.entity';

@Controller('bonus-stat-dict')
export class BonusStatDictController {
  constructor(private readonly bonusStatDictService: BonusStatDictService) {}

  @Post()
  create(@Request() req): Promise<BonusStatDict> {
    return this.bonusStatDictService.create(req.body);
  }

  @Get()
  getAll(): Promise<BonusStatDict[]> {
    return this.bonusStatDictService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<BonusStatDict> {
    return this.bonusStatDictService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.bonusStatDictService.delete(id);
  }
}
