import { Entity, Column, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @VersionColumn()
  version: number;
}
