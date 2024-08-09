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
    ) { }

    async purchaseTicket(ticketId: number, quantity: number): Promise<Ticket> {
        const resource = `lock:ticket:${ticketId}`;
        const ttl = 1000; // 1 second lock

        const lock = await this.redlock.acquire([resource], ttl);

        try {
            return await this.entityManager.transaction(async (transactionalEntityManager) => {
                const ticket = await transactionalEntityManager.findOne(Ticket, { where: { id: ticketId } });

                // Burada farklı tablolara kayıt edilen veya güncellenen verilere ait işlemler de bulunabilirdi.

                if (!ticket) {
                    throw new ConflictException('Bilet Bulunamadı.');
                }

                if (ticket.quantity < quantity) {
                    throw new ConflictException('Yeteri kadar satılacak bilet kalmadı.');
                }

                ticket.quantity -= quantity;
                return await transactionalEntityManager.save(ticket);
            })
        } finally {
            await lock.release().catch((err) => console.error(err));
        }
    }
}
