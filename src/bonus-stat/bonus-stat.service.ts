import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonusStat } from './bonus-stat.entity';
import { BonusStatDTO } from './bonus-stat.dto';
import { Group } from 'src/group/group.entity';

@Injectable()
export class BonusStatService {
  constructor(
    @InjectRepository(BonusStat)
    private readonly bonusStatRepository: Repository<BonusStat>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async create(bonusStatDTO: BonusStatDTO): Promise<BonusStat> {
    const bonusStat = new BonusStat();
    bonusStat.bonusStatDictId = bonusStatDTO.bonusStatDictId;
    bonusStat.raceId = bonusStatDTO.raceId;
    bonusStat.groupId = bonusStatDTO.groupId;
    bonusStat.userId = bonusStatDTO.userId;
    return this.bonusStatRepository.save(bonusStat);
  }

  async getAll(): Promise<BonusStat[]> {
    return this.bonusStatRepository.find();
  }

  async getById(id: number): Promise<BonusStat> {
    return this.bonusStatRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.bonusStatRepository.delete(id);
  }

  async update(bonusStat: BonusStat): Promise<BonusStat> {
    return await this.bonusStatRepository.save(bonusStat);
  }

  async updateMany(bonusStatArray: BonusStat[]): Promise<BonusStat[]> {
    const updatedBonusStatArray: BonusStat[] = [];
    for (const bonusStat of bonusStatArray) {
      const updatedPrediction = await this.bonusStatRepository.save(bonusStat);
      updatedBonusStatArray.push(updatedPrediction);
    }
    return updatedBonusStatArray;
  }

  async createMany(bonusStatDtoArray: BonusStatDTO[]): Promise<BonusStat[]> {
    const newBonusStatArray: BonusStat[] = [];
    for (const bonusStatDto of bonusStatDtoArray) {
      const newBonusStat = await this.bonusStatRepository.save(bonusStatDto);
      newBonusStatArray.push(newBonusStat);
    }
    return newBonusStatArray;
  }

  async getByRaceGroupUser(
    raceId: number,
    groupId: number,
    userId: number,
  ): Promise<BonusStat[]> {
    return await this.bonusStatRepository.find({
      where: { raceId: raceId, groupId: groupId, userId: userId },
    });
  }

  async getByRaceGroup(
    raceId: number,
    groupId: number,
  ): Promise<Map<number, BonusStat[]>> {
    const bonusStats = await this.bonusStatRepository.find({
      where: { raceId, groupId },
    });

    const group = await this.groupRepository.findOne({
      relations: {
        users: true,
      },
      where: {
        id: groupId,
      },
    });
    if (!group) {
      throw new Error(`Group with ID ${groupId} not found`);
    }
    const userIds = group.users.map((user) => user.id);
    const groupedBonusStats = new Map<number, BonusStat[]>();
    bonusStats.forEach((bonusStat) => {
      const userId = bonusStat.userId;
      if (groupedBonusStats.has(userId)) {
        const userBonusStats = groupedBonusStats.get(userId);
        userBonusStats.push(bonusStat);
        groupedBonusStats.set(userId, userBonusStats);
      } else {
        groupedBonusStats.set(userId, [bonusStat]);
      }
    });

    userIds.forEach((userId) => {
      if (!groupedBonusStats.has(userId)) {
        groupedBonusStats.set(userId, []);
      }
    });

    return groupedBonusStats;
  }
}
