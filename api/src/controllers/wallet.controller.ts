import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { WalletService } from 'src/services/wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async createWallet(@Body('balance') balance: number) {
    return await this.walletService.createWallet(balance);
  }

  @Patch(':id/balance')
  async updateBalance(@Param('id') id: number, @Body('amount') amount: number) {
    return await this.walletService.updateBalance(id, amount);
  }
}
