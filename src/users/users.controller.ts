import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IsEmail, IsOptional, IsPhoneNumber } from '@nestjs/class-validator';

class CreateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber('IN')
  @IsOptional()
  phoneNumber?: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async add(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto?.email && !createUserDto?.phoneNumber) {
      throw new BadRequestException('Either email or phoneNumber must exist');
    }
    return await this.usersService.add(
      createUserDto?.email,
      createUserDto?.phoneNumber,
    );
  }
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
