import {
  Controller,
  Get,
  Post,
  Delete,
  Request,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ResultService } from './result.service';
import { Result } from './result.entity';

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post('createMany')
  async createMany(@Request() req): Promise<Result[]> {
    const results = await this.resultService.createMany(req.body);
    const raceId = results[0].raceId;
    await this.resultService.updateScores(
      raceId,
      results.sort((r1, r2) => r1.position - r2.position),
    );
    return results;
  }

  @Post()
  create(@Request() req): Promise<Result> {
    return this.resultService.create(req.body);
  }

  @Put('updateMany')
  async updateMany(@Request() req): Promise<Result[]> {
    const results = await this.resultService.updateMany(req.body);
    const raceId = results[0].raceId;
    await this.resultService.updateScores(
      raceId,
      results.sort((r1, r2) => r1.position - r2.position),
    );
    return results;
  }

  @Get()
  getByRaceId(@Query('raceId') raceId: number): Promise<Result[]> {
    return this.resultService.getByRaceId(raceId);
  }

  @Get()
  getAll(): Promise<Result[]> {
    return this.resultService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Result> {
    return this.resultService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.resultService.delete(id);
  }
}
