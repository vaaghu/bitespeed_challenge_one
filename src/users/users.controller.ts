import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IsEmail, IsOptional, IsPhoneNumber } from '@nestjs/class-validator';
import { Transform } from 'class-transformer';

class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  email?: string;

  @IsPhoneNumber('IN')
  @Transform(({ value }) => value.trim())
  @IsOptional()
  phoneNumber?: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('/identify')
  async indentify(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto?.email && !createUserDto?.phoneNumber) {
      throw new BadRequestException('Either email or phoneNumber must exist');
    }
    return await this.usersService.indentify(
      createUserDto?.email,
      createUserDto?.phoneNumber,
    );
  }
  @Get()
  async getAll() {
    return await this.usersService.getAll();
  }
}
