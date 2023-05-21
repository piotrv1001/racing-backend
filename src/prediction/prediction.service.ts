import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prediction } from './prediction.entity';
import { Repository } from 'typeorm';
import { PredictionDTO } from './prediction.dto';
import { Group } from 'src/group/group.entity';

@Injectable()
export class PredictionService {
  constructor(
    @InjectRepository(Prediction)
    private readonly predictionRepository: Repository<Prediction>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async createMany(predictionDtoArray: PredictionDTO[]): Promise<Prediction[]> {
    const newPredictionArray: Prediction[] = [];
    for (const predictionDto of predictionDtoArray) {
      const newPrediction = await this.predictionRepository.save(predictionDto);
      newPredictionArray.push(newPrediction);
    }
    return newPredictionArray;
  }

  async updateMany(predictionArray: Prediction[]): Promise<Prediction[]> {
    const updatedPredictionArray: Prediction[] = [];
    for (const prediction of predictionArray) {
      const updatedPrediction = await this.predictionRepository.save(
        prediction,
      );
      updatedPredictionArray.push(updatedPrediction);
    }
    return updatedPredictionArray;
  }

  async create(predictionDto: PredictionDTO): Promise<Prediction> {
    const prediction = new Prediction();
    prediction.predictedPosition = predictionDto.predictedPosition;
    prediction.driverId = predictionDto.driverId;
    prediction.raceId = predictionDto.raceId;
    prediction.userId = predictionDto.userId;
    prediction.groupId = predictionDto.groupId;
    return this.predictionRepository.save(prediction);
  }

  async getAll(): Promise<Prediction[]> {
    return this.predictionRepository.find();
  }

  async getById(id: number): Promise<Prediction> {
    return this.predictionRepository.findOneBy({ id: id });
  }

  async getPredictionsByGroupAndRace(
    groupId: number,
    raceId: number,
  ): Promise<Map<number, Prediction[]>> {
    const predictions = await this.predictionRepository.find({
      where: { groupId, raceId },
      order: {
        predictedPosition: 'ASC',
      },
      relations: ['user', 'driver'],
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

    const groupedPredictions = new Map<number, Prediction[]>();
    predictions.forEach((prediction) => {
      const userId = prediction.user.id;
      if (groupedPredictions.has(userId)) {
        const userPredictions = groupedPredictions.get(userId);
        userPredictions.push(prediction);
        groupedPredictions.set(userId, userPredictions);
      } else {
        groupedPredictions.set(userId, [prediction]);
      }
    });

    userIds.forEach((userId) => {
      if (!groupedPredictions.has(userId)) {
        groupedPredictions.set(userId, []);
      }
    });

    return groupedPredictions;
  }

  async getByUserAndRaceAndGroup(
    userId: number,
    raceId: number,
    groupId: number,
  ): Promise<Prediction[]> {
    return this.predictionRepository.find({
      where: {
        userId: userId,
        raceId: raceId,
        groupId: groupId,
      },
      order: {
        predictedPosition: 'ASC',
      },
      relations: {
        driver: {
          team: true,
        },
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.predictionRepository.delete(id);
  }
}
