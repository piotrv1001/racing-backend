import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './driver.entity';
import { Repository } from 'typeorm';
import { DriverDTO } from './driver.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(driverDto: DriverDTO): Promise<Driver> {
    const driver = new Driver();
    driver.name = driverDto.name;
    driver.teamId = driverDto.teamId;
    return this.driverRepository.save(driver);
  }

  async getAll(): Promise<Driver[]> {
    return this.driverRepository.find({
      relations: {
        team: true,
      },
    });
  }

  async getById(id: number): Promise<Driver> {
    return this.driverRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.driverRepository.delete(id);
  }

  async initDrivers(): Promise<Driver[]> {
    const drivers = await this.driverRepository.find();
    if (drivers.length > 0) {
      return drivers;
    }
    const newDrivers: Driver[] = [];
    const verstappen = new Driver();
    verstappen.name = 'Max Verstappen';
    verstappen.teamId = 1;
    newDrivers.push(await this.driverRepository.save(verstappen));
    const perez = new Driver();
    perez.name = 'Sergio Perez';
    perez.teamId = 1;
    newDrivers.push(await this.driverRepository.save(perez));
    const alonso = new Driver();
    alonso.name = 'Fernando Alonso';
    alonso.teamId = 2;
    newDrivers.push(await this.driverRepository.save(alonso));
    const stroll = new Driver();
    stroll.name = 'Lance Stroll';
    stroll.teamId = 2;
    newDrivers.push(await this.driverRepository.save(stroll));
    const russel = new Driver();
    russel.name = 'George Russell';
    russel.teamId = 3;
    newDrivers.push(await this.driverRepository.save(russel));
    const hamilton = new Driver();
    hamilton.name = 'Lewis Hamilton';
    hamilton.teamId = 3;
    newDrivers.push(await this.driverRepository.save(hamilton));
    const leclerc = new Driver();
    leclerc.name = 'Charles Leclerc';
    leclerc.teamId = 4;
    newDrivers.push(await this.driverRepository.save(leclerc));
    const sainz = new Driver();
    sainz.name = 'Carlos Sainz';
    sainz.teamId = 4;
    newDrivers.push(await this.driverRepository.save(sainz));
    const piastri = new Driver();
    piastri.name = 'Oscar Piastri';
    piastri.teamId = 5;
    newDrivers.push(await this.driverRepository.save(piastri));
    const norris = new Driver();
    norris.name = 'Lando Norris';
    norris.teamId = 5;
    newDrivers.push(await this.driverRepository.save(norris));
    const ocon = new Driver();
    ocon.name = 'Esteban Ocon';
    ocon.teamId = 6;
    newDrivers.push(await this.driverRepository.save(ocon));
    const gasly = new Driver();
    gasly.name = 'Pierre Gasly';
    gasly.teamId = 6;
    newDrivers.push(await this.driverRepository.save(gasly));
    const hulk = new Driver();
    hulk.name = 'Nico Hulkenberg';
    hulk.teamId = 7;
    newDrivers.push(await this.driverRepository.save(hulk));
    const kmag = new Driver();
    kmag.name = 'Kevin Magnussen';
    kmag.teamId = 7;
    newDrivers.push(await this.driverRepository.save(kmag));
    const joe = new Driver();
    joe.name = 'Zhou Guanyu';
    joe.teamId = 8;
    newDrivers.push(await this.driverRepository.save(joe));
    const bottas = new Driver();
    bottas.name = 'Valtteri Bottas';
    bottas.teamId = 8;
    newDrivers.push(await this.driverRepository.save(bottas));
    const deVries = new Driver();
    deVries.name = 'Nyck de Vries';
    deVries.teamId = 9;
    newDrivers.push(await this.driverRepository.save(deVries));
    const tsuonda = new Driver();
    tsuonda.name = 'Yuki Tsunoda';
    tsuonda.teamId = 9;
    newDrivers.push(await this.driverRepository.save(tsuonda));
    const logan = new Driver();
    logan.name = 'Logan Sargeant';
    logan.teamId = 10;
    newDrivers.push(await this.driverRepository.save(logan));
    const albon = new Driver();
    albon.name = 'Alexander Albon';
    albon.teamId = 10;
    newDrivers.push(await this.driverRepository.save(albon));

    return newDrivers;
  }
}
