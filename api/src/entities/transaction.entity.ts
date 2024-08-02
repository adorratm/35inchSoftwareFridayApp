import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Wallet } from 'src/entities/wallet.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.sentTransactions)
  sender: Wallet;

  @ManyToOne(() => Wallet, (wallet) => wallet.receivedTransactions)
  receiver: Wallet;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
