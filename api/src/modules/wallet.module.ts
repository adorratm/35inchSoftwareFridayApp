import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from 'src/services/wallet.service';
import { WalletController } from 'src/controllers/wallet.controller';
import { Wallet } from 'src/entities/wallet.entity';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
  ],
  providers: [
    WalletService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        });
      },
    },
    {
      provide: 'REDLOCK',
      useFactory: (redisClient: Redis) => {
        return new Redlock([redisClient], {
          driftFactor: 0.01, // Zaman sapması
          retryCount: 10,
          retryDelay: 200, // ms
          retryJitter: 200, // ms
        });
      },
      inject: ['REDIS_CLIENT'],
    },
  ],
  controllers: [WalletController],
})
export class WalletModule {}
