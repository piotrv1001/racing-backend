import { Race } from './race.entity';
import { RaceService } from './race.service';
import {
  Controller,
  Post,
  Get,
  Request,
  Param,
  Delete,
  Query,
  Put,
  Patch,
} from '@nestjs/common';

@Controller('races')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @Post('init')
  initRaces(): Promise<Race[]> {
    return this.raceService.initRaces();
  }

  @Patch('dnf/:raceId')
  assignDnfDrivers(
    @Request() req,
    @Param('raceId') raceId: number,
  ): Promise<Race> {
    return this.raceService.assignDnfDrivers(req.body, raceId);
  }

  @Patch('fastest-lap/:raceId/:driverId')
  assignFastestLap(
    @Param('raceId') raceId: number,
    @Param('driverId') driverId: number,
  ): Promise<Race> {
    return this.raceService.assignFastestLap(driverId, raceId);
  }

  @Get()
  getAllRacesBySeasonId(@Query('seasonId') seasonId: number): Promise<Race[]> {
    return this.raceService.getAllBySeasonId(seasonId);
  }

  @Post()
  create(@Request() req): Promise<Race> {
    return this.raceService.create(req.body);
  }

  @Get()
  getAll(): Promise<Race[]> {
    return this.raceService.getAll();
  }

  @Get(':id/fl-dnf')
  getByIdWithFLandDNF(@Param('id') id: number): Promise<Race> {
    return this.raceService.getByIdWithFLandDNF(id);
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Race> {
    return this.raceService.getById(id);
  }

  @Put()
  update(@Request() req): Promise<Race> {
    return this.raceService.update(req.body);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.raceService.delete(id);
  }
}
