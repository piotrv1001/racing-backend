import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { DriverModule } from './driver/driver.module';
import { RaceModule } from './race/race.module';
import { GroupModule } from './group/group.module';
import { Prediction } from './prediction/prediction.entity';
import { Score } from './score/score.entity';
import { Result } from './result/result.entity';
import { Race } from './race/race.entity';
import { Driver } from './driver/driver.entity';
import { Group } from './group/group.entity';
import { Team } from './team/team.entity';
import { SeasonModule } from './season/season.module';
import { Season } from './season/season.entity';
import { BonusStatDictModule } from './bonus-stat-dict/bonus-stat-dict.module';
import { BonusStat } from './bonus-stat/bonus-stat.entity';
import { BonusStatDict } from './bonus-stat-dict/bonus-stat-dict.entity';
import { BonusStatModule } from './bonus-stat/bonus-stat.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get<string>('DATABASE_URL'),
        entities: [
          User,
          Prediction,
          Score,
          Result,
          Race,
          Driver,
          Group,
          Team,
          Season,
          BonusStat,
          BonusStatDict,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    TeamModule,
    DriverModule,
    RaceModule,
    GroupModule,
    SharedModule,
    SeasonModule,
    BonusStatDictModule,
    BonusStatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
