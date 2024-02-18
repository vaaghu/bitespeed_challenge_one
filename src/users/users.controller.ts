import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';

class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsMobilePhone()
  @IsOptional()
  phoneNumber?: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async add(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.email && !createUserDto.phoneNumber) {
      throw new BadRequestException('Either email or phoneNumber must exist');
    }
    return await this.usersService.add(
      createUserDto?.email,
      createUserDto?.phoneNumber,
    );
  }

  @Get()
  async getAll() {
    return await this.usersService.getAll();
  }
}
