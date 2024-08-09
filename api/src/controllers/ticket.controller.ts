import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { TicketService } from 'src/services/ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('purchase/:id')
  async purchaseTicket(@Param('id') ticketId: number, @Body('quantity') quantity: number) {
    return await this.ticketService.purchaseTicket(ticketId, quantity);
  }
}
