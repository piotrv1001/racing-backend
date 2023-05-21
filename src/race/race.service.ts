import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Race } from './race.entity';
import { In, Repository } from 'typeorm';
import { RaceDTO } from './race.dto';
import { Driver } from 'src/driver/driver.entity';

@Injectable()
export class RaceService {
  constructor(
    @InjectRepository(Race)
    private readonly raceRepository: Repository<Race>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(raceDto: RaceDTO): Promise<Race> {
    const race = new Race();
    race.name = raceDto.name;
    race.date = raceDto.date;
    race.predictionDeadline = raceDto.predictionDeadline;
    race.country = raceDto.country;
    race.countryCode = raceDto.countryCode;
    return this.raceRepository.save(race);
  }

  async getAll(): Promise<Race[]> {
    return this.raceRepository.find();
  }

  async getById(id: number): Promise<Race> {
    return this.raceRepository.findOneBy({ id: id });
  }

  async getByIdWithFLandDNF(id: number): Promise<Race> {
    return this.raceRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        fastestLapDriver: true,
        dnfDrivers: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.raceRepository.delete(id);
  }

  async update(race: Race): Promise<Race> {
    return this.raceRepository.save(race);
  }

  async getAllBySeasonId(seasonId: number): Promise<Race[]> {
    return this.raceRepository.find({
      where: { seasonId: seasonId },
      order: { date: 'ASC' },
    });
  }

  async assignFastestLap(driverId: number, raceId: number): Promise<Race> {
    const race = await this.raceRepository.findOneBy({ id: raceId });
    if (!race) {
      throw new Error(`Race with ID ${raceId} not found`);
    }
    const driver = await this.driverRepository.findOneBy({ id: driverId });
    race.fastestLapDriver = driver;
    return await this.raceRepository.save(race);
  }

  async assignDnfDrivers(driverIds: number[], raceId: number): Promise<Race> {
    const race = await this.raceRepository.findOneBy({ id: raceId });
    if (!race) {
      throw new Error(`Race with ID ${raceId} not found`);
    }
    const drivers = await this.driverRepository.findBy({ id: In(driverIds) });
    race.dnfDrivers = drivers;
    return await this.raceRepository.save(race);
  }

  async initRaces(): Promise<Race[]> {
    const races = await this.raceRepository.find();
    if (races.length > 1) {
      return races;
    }
    const newRaces: Race[] = [];
    const bahrain = new Race();
    bahrain.name = 'Formula 1 Gulf Air Bahrain Grand Prix 2023';
    bahrain.country = 'Bahrain';
    bahrain.countryCode = 'BH';
    bahrain.date = new Date(2023, 2, 5);
    bahrain.predictionDeadline = this.getTwoDaysPrior(bahrain.date);
    bahrain.seasonId = 1;
    newRaces.push(await this.raceRepository.save(bahrain));
    const saudi = new Race();
    saudi.name = 'Formula 1 STC Saudi Arabian Grand Prix 2023';
    saudi.country = 'Saudi Arabia';
    saudi.countryCode = 'SA';
    saudi.date = new Date(2023, 2, 19);
    saudi.predictionDeadline = this.getTwoDaysPrior(saudi.date);
    saudi.seasonId = 1;
    newRaces.push(await this.raceRepository.save(saudi));
    const australia = new Race();
    australia.name = 'Formula 1 Rolex Australian Grand Prix 2023';
    australia.country = 'Australia';
    australia.countryCode = 'AU';
    australia.date = new Date(2023, 3, 2);
    australia.predictionDeadline = this.getTwoDaysPrior(australia.date);
    australia.seasonId = 1;
    newRaces.push(await this.raceRepository.save(australia));
    const azerbaijan = new Race();
    azerbaijan.name = 'Formula 1 Azerbaijan Grand Prix 2023';
    azerbaijan.country = 'Azerbaijan';
    azerbaijan.countryCode = 'AZ';
    azerbaijan.date = new Date(2023, 3, 30);
    azerbaijan.predictionDeadline = this.getTwoDaysPrior(azerbaijan.date);
    azerbaijan.seasonId = 1;
    newRaces.push(await this.raceRepository.save(azerbaijan));
    const usa = new Race();
    usa.name = 'Formula 1 Crypto.com Miami Grand Prix 2023';
    usa.country = 'United States';
    usa.countryCode = 'US';
    usa.date = new Date(2023, 4, 7);
    usa.predictionDeadline = this.getTwoDaysPrior(usa.date);
    usa.seasonId = 1;
    newRaces.push(await this.raceRepository.save(usa));
    const italy = new Race();
    italy.name =
      "Formula 1 Qatar Airways Gran Premio Del Made In Italy E Dell'Emilia-Romagna 2023";
    italy.country = 'Italy';
    italy.countryCode = 'IT';
    italy.date = new Date(2023, 4, 21);
    italy.predictionDeadline = this.getTwoDaysPrior(italy.date);
    italy.seasonId = 1;
    newRaces.push(await this.raceRepository.save(italy));
    const monaco = new Race();
    monaco.name = 'Formula 1 Grand Prix De Monaco 2023';
    monaco.country = 'Monaco';
    monaco.countryCode = 'MC';
    monaco.date = new Date(2023, 4, 28);
    monaco.predictionDeadline = this.getTwoDaysPrior(monaco.date);
    monaco.seasonId = 1;
    newRaces.push(await this.raceRepository.save(monaco));
    const spain = new Race();
    spain.name = 'Formula 1 AWS Gran Premio DE Espana 2023';
    spain.country = 'Spain';
    spain.countryCode = 'ES';
    spain.date = new Date(2023, 5, 4);
    spain.predictionDeadline = this.getTwoDaysPrior(spain.date);
    spain.seasonId = 1;
    newRaces.push(await this.raceRepository.save(spain));
    const canada = new Race();
    canada.name = 'Formula 1 Pirelli Grand Prix Du Canada 2023';
    canada.country = 'Canada';
    canada.countryCode = 'CA';
    canada.date = new Date(2023, 5, 18);
    canada.predictionDeadline = this.getTwoDaysPrior(canada.date);
    canada.seasonId = 1;
    newRaces.push(await this.raceRepository.save(canada));
    const austria = new Race();
    austria.name = 'Formula 1 Grosser Preis Von Österreich 2023';
    austria.country = 'Austria';
    austria.countryCode = 'AT';
    austria.date = new Date(2023, 6, 2);
    austria.predictionDeadline = this.getTwoDaysPrior(austria.date);
    austria.seasonId = 1;
    newRaces.push(await this.raceRepository.save(austria));
    const britain = new Race();
    britain.name = 'Formula 1 Aramco British Grand Prix 2023';
    britain.country = 'Great Britain';
    britain.countryCode = 'GB';
    britain.date = new Date(2023, 6, 9);
    britain.predictionDeadline = this.getTwoDaysPrior(britain.date);
    britain.seasonId = 1;
    newRaces.push(await this.raceRepository.save(britain));
    const hungary = new Race();
    hungary.name = 'Formula 1 Qatar Airways Hungarian Grand Prix 2023';
    hungary.country = 'Hungary';
    hungary.countryCode = 'HU';
    hungary.date = new Date(2023, 6, 23);
    hungary.predictionDeadline = this.getTwoDaysPrior(hungary.date);
    hungary.seasonId = 1;
    newRaces.push(await this.raceRepository.save(hungary));
    const belgium = new Race();
    belgium.name = 'Formula 1 Belgian Grand Prix 2023';
    belgium.country = 'Belgium';
    belgium.countryCode = 'BE';
    belgium.date = new Date(2023, 6, 30);
    belgium.predictionDeadline = this.getTwoDaysPrior(belgium.date);
    belgium.seasonId = 1;
    newRaces.push(await this.raceRepository.save(belgium));
    const holland = new Race();
    holland.name = 'Formula 1 Heineken Dutch Grand Prix 2023';
    holland.country = 'Netherlands';
    holland.countryCode = 'NL';
    holland.date = new Date(2023, 7, 27);
    holland.predictionDeadline = this.getTwoDaysPrior(holland.date);
    holland.seasonId = 1;
    newRaces.push(await this.raceRepository.save(holland));
    const italy2 = new Race();
    italy2.name = 'Formula 1 Pirelli Gran Premio D’Italia 2023';
    italy2.country = 'Italy';
    italy2.countryCode = 'IT';
    italy2.date = new Date(2023, 8, 3);
    italy2.predictionDeadline = this.getTwoDaysPrior(italy2.date);
    italy2.seasonId = 1;
    newRaces.push(await this.raceRepository.save(italy2));
    const singapore = new Race();
    singapore.name = 'Formula 1 Singapore Airlines Singapore Grand Prix 2023';
    singapore.country = 'Singapore';
    singapore.countryCode = 'SG';
    singapore.date = new Date(2023, 8, 17);
    singapore.predictionDeadline = this.getTwoDaysPrior(singapore.date);
    singapore.seasonId = 1;
    newRaces.push(await this.raceRepository.save(singapore));
    const japan = new Race();
    japan.name = 'Formula 1 Lenovo Japanese Grand Prix 2023';
    japan.country = 'Japan';
    japan.countryCode = 'JP';
    japan.date = new Date(2023, 8, 24);
    japan.predictionDeadline = this.getTwoDaysPrior(japan.date);
    japan.seasonId = 1;
    newRaces.push(await this.raceRepository.save(japan));
    const qatar = new Race();
    qatar.name = 'Formula 1 Qatar Airways Qatar Grand Prix 2023';
    qatar.country = 'Qatar';
    qatar.countryCode = 'QA';
    qatar.date = new Date(2023, 9, 8);
    qatar.predictionDeadline = this.getTwoDaysPrior(qatar.date);
    qatar.seasonId = 1;
    newRaces.push(await this.raceRepository.save(qatar));
    const usa2 = new Race();
    usa2.name = 'Formula 1 Lenovo United States Grand Prix 2023';
    usa2.country = 'United States';
    usa2.countryCode = 'US';
    usa2.date = new Date(2023, 9, 22);
    usa2.predictionDeadline = this.getTwoDaysPrior(usa2.date);
    usa2.seasonId = 1;
    newRaces.push(await this.raceRepository.save(usa2));
    const mexico = new Race();
    mexico.name = 'Formula 1 Gran Premio De La Ciudad De Mexico 2023';
    mexico.country = 'Mexico';
    mexico.countryCode = 'MX';
    mexico.date = new Date(2023, 9, 29);
    mexico.predictionDeadline = this.getTwoDaysPrior(mexico.date);
    mexico.seasonId = 1;
    newRaces.push(await this.raceRepository.save(mexico));
    const brazil = new Race();
    brazil.name = 'Formula 1 Rolex Grande Premio De Sao Paulo 2023';
    brazil.country = 'Brazil';
    brazil.countryCode = 'BR';
    brazil.date = new Date(2023, 10, 5);
    brazil.predictionDeadline = this.getTwoDaysPrior(brazil.date);
    brazil.seasonId = 1;
    newRaces.push(await this.raceRepository.save(brazil));
    const usa3 = new Race();
    usa3.name = 'Formula 1 Heineken Silver Las Vegas Grand Prix 2023';
    usa3.country = 'United States';
    usa3.countryCode = 'US';
    usa3.date = new Date(2023, 10, 19);
    usa3.predictionDeadline = this.getTwoDaysPrior(usa3.date);
    usa3.seasonId = 1;
    newRaces.push(await this.raceRepository.save(usa3));
    const abuDhabi = new Race();
    abuDhabi.name = 'Formula 1 Etihad Airways Abu Dhabi Grand Prix 2023';
    abuDhabi.country = 'Abu Dhabi';
    abuDhabi.countryCode = 'AE';
    abuDhabi.date = new Date(2023, 10, 26);
    abuDhabi.predictionDeadline = this.getTwoDaysPrior(abuDhabi.date);
    abuDhabi.seasonId = 1;
    newRaces.push(await this.raceRepository.save(abuDhabi));

    return newRaces;
  }

  private getTwoDaysPrior(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 2);

    if (newDate.getMonth() !== date.getMonth()) {
      newDate.setMonth(date.getMonth());
    }

    return newDate;
  }
}
