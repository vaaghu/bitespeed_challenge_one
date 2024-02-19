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
import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty({ type: String, example: 'vaaghu0@gmail.com' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email?: string;

  @ApiProperty({ type: String, example: '9360748965' })
  @IsOptional()
  @IsPhoneNumber('IN')
  @Transform(({ value }) => value.trim())
  phoneNumber?: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('/identify')
  async indentify(@Body() userDto: UserDto) {
    if (!userDto?.email && !userDto?.phoneNumber) {
      throw new BadRequestException('Either email or phoneNumber must exist');
    }
    return await this.usersService.indentify(
      userDto?.email,
      userDto?.phoneNumber,
    );
  }
  @Get()
  async getAll() {
    return await this.usersService.getAll();
  }
}
