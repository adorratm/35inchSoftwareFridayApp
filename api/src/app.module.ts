import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WalletModule } from 'src/modules/wallet.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { JwtService } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheManager } from 'src/common/cache.manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ormconfig } from '../ormconfig';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AllExceptionsFilter } from 'src/common/all-exceptions.filter';
import { RequestHandlerMiddleware } from 'src/common/request-handler-middleware.service';

@Module({
  imports: [WinstonModule.forRoot({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
          }),
        ),
      }),
    ],
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
    renderPath: '/public',
    serveRoot: '/public',
  }),
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRootAsync({
    useFactory: () => ormconfig as TypeOrmModuleOptions,
  }),
  CacheModule.register({ isGlobal: true }),
  ThrottlerModule.forRoot({
    throttlers: [
      {
        name: 'short',
        ttl: 1000,
        limit: 20,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]
  }),
  ],
  controllers: [AppController],
  providers: [JwtService, AppService, CacheManager, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  }, {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestHandlerMiddleware).forRoutes('*');
  }
}
