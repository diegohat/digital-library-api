import { Injectable, ConflictException } from '@nestjs/common';
import { AppLogger } from '../shared/logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async create(dto: CreateUserDto) {
    this.logger.log('User creation requested', UsersService.name);
    this.logger.debug(`Payload: ${JSON.stringify(dto)}`, UsersService.name);
    try {
      const result = await this.prisma.user.create({ data: dto });
      this.logger.log(
        `User created successfully. UserId: ${result.id}, Email: ${result.email}`,
        UsersService.name,
      );
      this.logger.debug(
        `Created user: ${JSON.stringify(result)}`,
        UsersService.name,
      );
      return result;
    } catch (error: any) {
      if (error.code === 'P2002') {
        this.logger.warn(
          `Email already in use. Email: ${dto.email}`,
          UsersService.name,
        );
        throw new ConflictException('Email already in use');
      }
      this.logger.error(
        `Failed to create user. Payload: ${JSON.stringify(dto)}. Error: ${error.message}`,
        error.stack,
        UsersService.name,
      );
      throw error;
    }
  }
}
