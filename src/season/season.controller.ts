import { Controller, Get, Post, Param, Delete, Request } from '@nestjs/common';
import { SeasonService } from './season.service';
import { Season } from './season.entity';

@Controller('seasons')
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @Post('init')
  initRaces(): Promise<Season[]> {
    return this.seasonService.initSeasons();
  }

  @Post()
  create(@Request() req): Promise<Season> {
    return this.seasonService.create(req.body);
  }

  @Get()
  getAll(): Promise<Season[]> {
    return this.seasonService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Season> {
    return this.seasonService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.seasonService.delete(id);
  }
}
