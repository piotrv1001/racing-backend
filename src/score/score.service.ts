import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Score } from './score.entity';
import { Repository } from 'typeorm';
import { ScoreDTO } from './score.dto';
import { Result } from 'src/result/result.entity';
import { PredictionService } from 'src/prediction/prediction.service';
import { Group } from 'src/group/group.entity';
import { Race } from 'src/race/race.entity';
import { BonusStat } from 'src/bonus-stat/bonus-stat.entity';
import { BonusStatEnum } from 'src/types/bonus-stat-enum';

export interface Stats {
  total: number;
  avg: number;
  min: number;
  max: number;
}

export type ScoreOutput =
  | Score[]
  | { scores: Score[]; bonusStats: BonusStat[] };

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Race)
    private readonly raceRepository: Repository<Race>,
    @InjectRepository(BonusStat)
    private readonly bonusStatRepository: Repository<BonusStat>,
    private readonly predictionService: PredictionService,
  ) {}

  async create(scoreDto: ScoreDTO): Promise<Score> {
    const score = new Score();
    score.points = scoreDto.points;
    score.position = scoreDto.position;
    score.userId = scoreDto.userId;
    score.raceId = scoreDto.raceId;
    score.groupId = scoreDto.groupId;
    return this.scoreRepository.save(score);
  }

  async updateMany(scoreDtoArray: Score[]): Promise<Score[]> {
    const updatedScoreArray: Score[] = [];
    for (const score of scoreDtoArray) {
      const updatedScore = await this.scoreRepository.save(score);
      updatedScoreArray.push(updatedScore);
    }
    return updatedScoreArray;
  }

  async getAll(): Promise<Score[]> {
    return this.scoreRepository.find();
  }

  async getById(id: number): Promise<Score> {
    return this.scoreRepository.findOneBy({ id: id });
  }

  async getByUserGroupRace(
    userId: number,
    groupId: number,
    raceId: number,
  ): Promise<Score[]> {
    return this.scoreRepository.find({
      where: {
        userId,
        raceId,
        groupId,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.scoreRepository.delete(id);
  }

  async getScoresByGroupAndRace(
    groupId: number,
    raceId: number,
  ): Promise<Map<number, Score[]>> {
    const scores = await this.scoreRepository.find({
      where: { groupId, raceId },
      order: { position: 'ASC' },
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
    const grouppedScores = new Map<number, Score[]>();
    scores.forEach((score) => {
      const userId = score.userId;
      if (grouppedScores.has(userId)) {
        const userScores = grouppedScores.get(userId);
        userScores.push(score);
        grouppedScores.set(userId, userScores);
      } else {
        grouppedScores.set(userId, [score]);
      }
    });

    userIds.forEach((userId) => {
      if (!grouppedScores.has(userId)) {
        grouppedScores.set(userId, []);
      }
    });

    return grouppedScores;
  }

  async calculateScoresForRaceForGroup(
    raceId: number,
    groupId: number,
    results: Result[],
  ): Promise<ScoreOutput> {
    const bonusStats: BonusStat[] = [];
    const scores: Score[] = [];
    const grouppedPredictions =
      await this.predictionService.getPredictionsByGroupAndRace(
        groupId,
        raceId,
      );
    const race = await this.raceRepository.findOne({
      where: {
        id: raceId,
      },
      relations: {
        dnfDrivers: true,
      },
    });
    const fastestLapDriverId = race.fastestLapDriverId;
    const dnfDrivers = race.dnfDrivers;
    for (const [userId] of grouppedPredictions) {
      const predictedFastestLap = await this.bonusStatRepository.findOne({
        where: {
          raceId,
          groupId,
          userId,
          bonusStatDictId: BonusStatEnum.FASTEST_LAP,
        },
      });
      if (!!predictedFastestLap) {
        const predictedFlDriverId = predictedFastestLap.driverId;
        const flPoints = predictedFlDriverId === fastestLapDriverId ? 0.5 : 0;
        predictedFastestLap.points = flPoints;
        bonusStats.push(
          await this.bonusStatRepository.save(predictedFastestLap),
        );
      }
      const predictedDNF = await this.bonusStatRepository.findOne({
        where: {
          raceId,
          groupId,
          userId,
          bonusStatDictId: BonusStatEnum.DNF,
        },
      });
      if (!!predictedDNF) {
        const dnfPoints =
          dnfDrivers.find((d) => d.id === predictedDNF.driverId) !== undefined
            ? 0.5
            : 0;
        predictedDNF.points = dnfPoints;
        bonusStats.push(await this.bonusStatRepository.save(predictedDNF));
      }
    }
    for (let i = 0; i < results.length; i++) {
      let fullGuess = false;
      let smallestDiff: number | null = null;
      const fullPointArray: number[] = [];
      let halfPointArray: number[] = [];
      for (const [userId, predictions] of grouppedPredictions) {
        if (predictions.length === 0) {
          continue;
        }
        if (results[i].driverId === predictions[i].driverId) {
          fullGuess = true;
          fullPointArray.push(userId);
          halfPointArray = [];
          const existingScore = await this.scoreRepository.findOne({
            where: {
              userId: userId,
              raceId: raceId,
              groupId: groupId,
              position: results[i].position,
            },
          });
          if (existingScore) {
            existingScore.points = 1;
            scores.push(await this.scoreRepository.save(existingScore));
          } else {
            const newScoreDto = new ScoreDTO();
            newScoreDto.points = 1;
            newScoreDto.position = results[i].position;
            newScoreDto.userId = userId;
            newScoreDto.raceId = raceId;
            newScoreDto.groupId = groupId;
            scores.push(await this.scoreRepository.save(newScoreDto));
          }
        } else if (!fullGuess) {
          const predictedDriverIndex = predictions.findIndex(
            (prediction) => prediction.driverId === results[i].driverId,
          );
          const diff = Math.abs(i - predictedDriverIndex);
          if (smallestDiff === null || diff <= smallestDiff) {
            if (diff < smallestDiff) {
              halfPointArray = [];
            }
            halfPointArray.push(userId);
            smallestDiff = diff;
          }
        }
      }
      for (const [userId] of grouppedPredictions) {
        if (!fullPointArray.includes(userId)) {
          const existingScore = await this.scoreRepository.findOne({
            where: {
              userId: userId,
              raceId: raceId,
              groupId: groupId,
              position: results[i].position,
            },
          });
          if (existingScore) {
            existingScore.points = halfPointArray.includes(userId) ? 0.5 : 0;
            scores.push(await this.scoreRepository.save(existingScore));
          } else {
            const newScoreDto = new ScoreDTO();
            newScoreDto.points = halfPointArray.includes(userId) ? 0.5 : 0;
            newScoreDto.position = results[i].position;
            newScoreDto.userId = userId;
            newScoreDto.raceId = raceId;
            newScoreDto.groupId = groupId;
            scores.push(await this.scoreRepository.save(newScoreDto));
          }
        }
      }
    }
    return { scores, bonusStats };
  }

  async sumPointsByUserIdAndGroupIdAndSeasonId(
    userId: number,
    groupId: number,
    seasonId: number,
  ): Promise<number> {
    const queryBuilder = this.scoreRepository
      .createQueryBuilder('s')
      .select('SUM(s.points)', 'sum_points')
      .innerJoin('s.race', 'r')
      .where('s.userId = :userId', { userId })
      .andWhere('s.groupId = :groupId', { groupId })
      .andWhere('r.seasonId = :seasonId', { seasonId });

    const result = await queryBuilder.getRawOne();
    return parseFloat(result.sum_points);
  }

  async getStatsByGroupIdAndSeasonId(
    groupId: number,
    seasonId: number,
  ): Promise<Map<number, Stats>> {
    const users = await this.scoreRepository.query(
      `
    SELECT DISTINCT userId
    FROM score
    WHERE groupId = ?`,
      [groupId],
    );

    const userIds = users.map((user) => user.userId);
    const resultMap = new Map<number, Stats>(
      userIds.map((userId) => [userId, {}]),
    );
    const scores = await this.scoreRepository
      .createQueryBuilder('s')
      .select([
        's.userId as userId',
        's.raceId as raceId',
        'SUM(s.points) as sum_points',
      ])
      .innerJoin('s.race', 'r')
      .where('s.groupId = :groupId', { groupId })
      .andWhere('r.seasonId = :seasonId', { seasonId })
      .groupBy('s.userId, s.raceId')
      .orderBy('s.userId', 'ASC')
      .getRawMany();

    let raceCount = 0;
    for (const score of scores) {
      let points = parseFloat(score.sum_points);
      const bonusFL = await this.bonusStatRepository.findOne({
        where: {
          userId: score.userId,
          groupId,
          raceId: score.raceId,
          bonusStatDictId: BonusStatEnum.FASTEST_LAP,
        },
      });
      if (bonusFL && bonusFL.points != null) {
        let bonusFLPoints = bonusFL.points;
        if (typeof bonusFLPoints === 'string') {
          bonusFLPoints = parseFloat(bonusFLPoints);
        }
        points += bonusFLPoints;
      }
      const bonusDNF = await this.bonusStatRepository.findOne({
        where: {
          userId: score.userId,
          groupId,
          raceId: score.raceId,
          bonusStatDictId: BonusStatEnum.DNF,
        },
      });
      if (bonusDNF && bonusDNF.points != null) {
        let bonusDNFPoints = bonusDNF.points;
        if (typeof bonusDNFPoints === 'string') {
          bonusDNFPoints = parseFloat(bonusDNFPoints);
        }
        points += bonusDNFPoints;
      }
      const stats: Stats = resultMap.get(score.userId);
      if (Object.keys(stats).length !== 0) {
        raceCount++;
        stats.total += points;
        stats.avg = stats.total / raceCount;
        if (points > stats.max) {
          stats.max = points;
        } else if (points < stats.min) {
          stats.min = points;
        }
      } else {
        raceCount = 1;
        const newStats: Stats = {
          max: points,
          min: points,
          total: points,
          avg: points,
        };
        resultMap.set(score.userId, newStats);
      }
    }

    return resultMap;
  }
}
