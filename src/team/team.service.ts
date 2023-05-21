import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { TeamDTO } from './team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(teamDto: TeamDTO): Promise<Team> {
    const team = new Team();
    team.name = teamDto.name;
    team.color = teamDto.color;
    return this.teamRepository.save(team);
  }

  async getAll(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  async getById(id: number): Promise<Team> {
    return this.teamRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.teamRepository.delete(id);
  }

  async initTeams(): Promise<Team[]> {
    const teams = await this.teamRepository.find();
    if (teams.length > 0) {
      return teams;
    }
    const newTeams = [];
    const redBull = new Team();
    redBull.name = 'Red Bull Racing';
    redBull.color = '#3671C6';
    newTeams.push(await this.teamRepository.save(redBull));
    const astonMartin = new Team();
    astonMartin.name = 'Aston Martin';
    astonMartin.color = '#358C75';
    newTeams.push(await this.teamRepository.save(astonMartin));
    const mercedes = new Team();
    mercedes.name = 'Mercedes';
    mercedes.color = '#6CD3BF';
    newTeams.push(await this.teamRepository.save(mercedes));
    const ferrari = new Team();
    ferrari.name = 'Ferrari';
    ferrari.color = '#F91536';
    newTeams.push(await this.teamRepository.save(ferrari));
    const mcLaren = new Team();
    mcLaren.name = 'McLaren';
    mcLaren.color = '#F58020';
    newTeams.push(await this.teamRepository.save(mcLaren));
    const alpine = new Team();
    alpine.name = 'Alpine';
    alpine.color = '#2293D1';
    newTeams.push(await this.teamRepository.save(alpine));
    const haas = new Team();
    haas.name = 'Haas F1 Team';
    haas.color = '#B6BABD';
    newTeams.push(await this.teamRepository.save(haas));
    const alfaRomeo = new Team();
    alfaRomeo.name = 'Alfa Romeo';
    alfaRomeo.color = '#C92D4B';
    newTeams.push(await this.teamRepository.save(alfaRomeo));
    const alphaTauri = new Team();
    alphaTauri.name = 'AlphaTauri';
    alphaTauri.color = '#5E8FAA';
    newTeams.push(await this.teamRepository.save(alphaTauri));
    const williams = new Team();
    williams.name = 'Williams';
    williams.color = '#37BEDD';
    newTeams.push(await this.teamRepository.save(williams));

    return newTeams;
  }
}
