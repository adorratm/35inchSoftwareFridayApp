import { Injectable, Inject } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Wallet } from 'src/entities/wallet.entity';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class WalletService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @Inject('REDLOCK') private readonly redlock: Redlock,
  ) {}

  async createWallet(initialBalance: number): Promise<Wallet> {
    return this.entityManager.transaction(async (manager) => {
      const wallet = manager.create(Wallet, { balance: initialBalance });
      return await manager.save(wallet);
    });
  }

  async updateBalance(walletId: number, amount: number): Promise<Wallet> {
    // Redlock kullanarak distributed lock ile concurrency ve consistency sağlama
    const lock = await this.redlock.acquire([`wallet:${walletId}`], 1000); // 1 saniye lock süresi

    try {
      return await this.entityManager.transaction(async (manager) => {
        const wallet = await manager.findOne(Wallet, { where: { id: walletId } });
        if (!wallet) {
          throw new Error('Wallet not found');
        }
        wallet.balance += amount;
        return await manager.save(wallet);
      });
    } finally {
      // Lock serbest bırakma
      await lock.release().catch((err) => console.error(err));
    }
  }
}
