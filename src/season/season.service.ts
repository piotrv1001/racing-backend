import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Season } from './season.entity';
import { Repository } from 'typeorm';
import { SeasonDTO } from './season.dto';
import { Race } from 'src/race/race.entity';

export interface SeasonWithProgress {
  id?: number;
  name?: string;
  progress?: number;
  total?: number;
}

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
    @InjectRepository(Race)
    private readonly raceRepository: Repository<Race>,
  ) {}

  async create(seasonDto: SeasonDTO): Promise<Season> {
    const season = new Season();
    season.name = seasonDto.name;
    return this.seasonRepository.save(season);
  }

  async getAll(): Promise<SeasonWithProgress[]> {
    const result: SeasonWithProgress[] = [];
    const today = new Date();
    const seasons = await this.seasonRepository.find();
    for (const season of seasons) {
      const races = await this.raceRepository.find({
        where: { seasonId: season.id },
      });
      let completed = 0;
      for (const race of races) {
        if (typeof race.date === 'string') {
          race.date = new Date(race.date);
        }
        if (today > race.date) {
          completed++;
        } else {
          break;
        }
      }
      result.push({
        ...season,
        progress: completed,
        total: races.length,
      });
    }
    return result;
  }

  async getById(id: number): Promise<Season> {
    return this.seasonRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.seasonRepository.delete(id);
  }

  async initSeasons(): Promise<Season[]> {
    const seasons = await this.seasonRepository.find();
    if (seasons.length > 1) {
      return seasons;
    }
    const newSeasons: Season[] = [];
    const season2023 = new Season();
    season2023.name = '2023';
    newSeasons.push(await this.seasonRepository.save(season2023));
    const season2024 = new Season();
    season2023.name = '2024';
    newSeasons.push(await this.seasonRepository.save(season2024));
    return newSeasons;
  }
}
