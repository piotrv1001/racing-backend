import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './team.entity';
import { TeamDTO } from './team.dto';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('init')
  initTeams(): Promise<Team[]> {
    return this.teamService.initTeams();
  }

  @Post()
  create(@Body() teamDto: TeamDTO): Promise<Team> {
    return this.teamService.create(teamDto);
  }

  @Get()
  getAll(): Promise<Team[]> {
    return this.teamService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Team> {
    return this.teamService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.teamService.delete(id);
  }
}
