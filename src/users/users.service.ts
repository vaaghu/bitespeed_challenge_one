import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
@Injectable()
export class UsersService {
  async add(email: string, phoneNumber: string) {
    let user = await prisma.contact.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });
    if (!user) {
      user = await prisma.contact.findFirst({
        where: { phoneNumber },
        orderBy: { createdAt: 'desc' },
      });
      if (!user) {
        return await prisma.contact.create({
          data: {
            email: email,
            phoneNumber: phoneNumber,
          },
        });
      }
    }

    return await prisma.contact.create({
      data: {
        email: email,
        phoneNumber: phoneNumber,
        linkPrecedence: 'secondary',
        linkedId: { connect: { id: user.id } },
      },
    });
  }
  async indentify(email?: string, phoneNumber?: string) {
    let contact: any = await prisma.contact.findFirst({
      where: { email, phoneNumber },
      include: {
        linkedId: { take: 1, include: { linkedId: true } },
      },
    });
    if (!contact) {
      return await this.add(email, phoneNumber);
    }
    const secondaryIds = [];
    const emails = [];
    const phoneNumbers = [];
    while (contact.linkedId) {
      secondaryIds.push(contact.id);
      emails.push(contact.email);
      phoneNumbers.push(contact.phoneNumber);
      console.log(contact);
      contact = contact.linkedId[0];
    }
    emails.push(contact.email);
    phoneNumbers.push(contact.phoneNumber);
    console.log(contact);

    secondaryIds.reverse();
    emails.reverse();
    phoneNumbers.reverse();

    return {
      contact: {
        primaryContatctId: contact.id,
        emails,
        phoneNumbers,
        secondaryIds,
      },
    };
  }
  async getAll() {
    return await prisma.contact.findMany({
      select: { id: true, email: true, phoneNumber: true },
    });
  }
}
