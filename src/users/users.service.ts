import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
@Injectable()
export class UsersService {
  async add(email: string, phoneNumber: string) {
    console.log(email, phoneNumber);
    return await prisma.contact.create({
      data: { email: email, phoneNumber: phoneNumber },
    });
  }
  async getAll() {
    return await prisma.contact.findMany({
      select: { id: true, email: true, phoneNumber: true },
    });
  }
}
