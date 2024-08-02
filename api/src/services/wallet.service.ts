import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from 'src/entities/wallet.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { CreateTransactionDto } from 'src/dtos/create_transaction.dtos';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async transferFunds(createTransactionDto: CreateTransactionDto): Promise<void> {
    const { senderWalletId, receiverWalletId, amount } = createTransactionDto;

    return this.dataSource.transaction(async (manager) => {
      const senderWallet = await manager.getRepository(Wallet).findOne({
        where: { id: senderWalletId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!senderWallet || senderWallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      senderWallet.balance -= amount;
      await manager.save(senderWallet);

      const receiverWallet = await manager.getRepository(Wallet).findOne({ where: { id: receiverWalletId } });
      receiverWallet.balance += amount;
      await manager.save(receiverWallet);

      const transaction = new Transaction();
      transaction.sender = senderWallet;
      transaction.receiver = receiverWallet;
      transaction.amount = amount;
      await manager.save(transaction);

      // Burada blockchain veya başka bir sistemle entegrasyon işlemi yapılabilir.
    });
  }
}
