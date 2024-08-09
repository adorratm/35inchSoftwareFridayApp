import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from 'src/services/ticket.service';
import { TicketController } from 'src/controllers/ticket.controller';
import { Ticket } from 'src/entities/ticket.entity';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
  ],
  providers: [
    TicketService,
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
  controllers: [TicketController],
})
export class TicketModule {}
