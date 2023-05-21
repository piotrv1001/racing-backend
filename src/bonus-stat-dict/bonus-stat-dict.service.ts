import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonusStatDict } from './bonus-stat-dict.entity';
import { Repository } from 'typeorm';
import { BonusStatDictDTO } from './bonus-stat-dict.dto';

@Injectable()
export class BonusStatDictService {
  constructor(
    @InjectRepository(BonusStatDict)
    private readonly bonusStatDictRepository: Repository<BonusStatDict>,
  ) {}

  async create(bonusStatDictDTO: BonusStatDictDTO): Promise<BonusStatDict> {
    const bonusStatDict = new BonusStatDict();
    bonusStatDict.name = bonusStatDictDTO.name;
    return this.bonusStatDictRepository.save(bonusStatDict);
  }

  async getAll(): Promise<BonusStatDict[]> {
    return this.bonusStatDictRepository.find();
  }

  async getById(id: number): Promise<BonusStatDict> {
    return this.bonusStatDictRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.bonusStatDictRepository.delete(id);
  }
}
