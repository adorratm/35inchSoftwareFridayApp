import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from 'src/services/wallet.service';
import { CreateTransactionDto } from 'src/dtos/create_transaction.dtos';

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Post('transfer')
    async transferFunds(@Body() createTransactionDto: CreateTransactionDto) {
        await this.walletService.transferFunds(createTransactionDto);
        return { status: 'success', message: 'Transfer successful' };
    }
}
