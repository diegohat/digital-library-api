import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  async create(@Body() dto: CreateLoanDto) {
    return await this.loansService.create(dto);
  }

  @Patch(':id/return')
  async return(@Param('id') id: string) {
    return await this.loansService.return(id);
  }
}