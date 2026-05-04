import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { PatientModule } from './modules/patient/patient.module';

@Module({
  imports: [
    // Global config from .env
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),

    // TypeORM — MSSQL with Windows Authentication
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        options: {
          encrypt: configService.get<boolean>('database.options.encrypt'),
          trustServerCertificate: configService.get<boolean>(
            'database.options.trustServerCertificate',
          ),
          instanceName: configService.get<string>('database.options.instanceName'),
        },
        autoLoadEntities: true,
        synchronize: false,
        logging: configService.get<string>('app.nodeEnv') === 'development',
      }),
    }),

    // Feature Modules
    PatientModule,
  ],
})
export class AppModule {}
