import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import IORedis from 'ioredis';
import Redis from 'ioredis';
import Redlock from 'redlock';


@Injectable()
export class TicketService {

    constructor(
        @InjectEntityManager() public entityManager: EntityManager,
        @Inject('REDLOCK') private readonly redlock: Redlock,
      ) {}

    async purchaseTicket(ticketId: number, quantity: number): Promise<Ticket> {
        const resource = `lock:ticket:${ticketId}`;
        const ttl = 1000; // 1 second lock

        const lock = await this.redlock.acquire([resource], ttl);

        try {
            const ticket = await this.entityManager.findOne(Ticket, { where: { id: ticketId } });

            if (!ticket) {
                throw new ConflictException('Bilet Bulunamadı.');
            }

            if (ticket.quantity < quantity) {
                throw new ConflictException('Yeteri kadar satılacak bilet kalmadı.');
            }

            ticket.quantity -= quantity;
            return await this.entityManager.save(ticket);
        } finally {
            await lock.release().catch((err) => console.error(err));
        }
    }
}
