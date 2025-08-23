import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanReturnDateDto } from './dto/update-loan-return-date.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('loans')
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new loan' })
  @ApiResponse({ status: 201, description: 'The loan has been successfully created.' })
  async create(@Body() dto: CreateLoanDto) {
    return await this.loansService.create(dto);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Update loan return date' })
  @ApiResponse({ status: 200, description: 'The loan return date has been successfully updated.' })
  async return(@Param('id') id: string, @Body() dto: UpdateLoanReturnDateDto) {
    return await this.loansService.return(id, dto.returnDate);
  }
}
