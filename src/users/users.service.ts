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
      select: {
        email: true,
        phoneNumber: true,
        linkPrecedence: true,
      },
    });
  }
  async indentify(email?: string, phoneNumber?: string) {
    const baseSelect = {
      id: true,
      email: true,
      phoneNumber: true,
      linkPrecedence: true,
      linkedId: { select: { id: true } },
    };
    let contact = await prisma.contact.findFirst({
      where: { email, phoneNumber },
      select: baseSelect,
    });
    if (!contact) {
      return await this.add(email, phoneNumber);
    }
    const secondaryIds = [];
    const emails = [];
    const phoneNumbers = [];
    while (contact.linkPrecedence == 'secondary') {
      console.log(contact);
      //lists
      secondaryIds.push(contact.id);
      emails.push(contact.email);
      phoneNumbers.push(contact.phoneNumber);

      contact = await prisma.contact.findFirst({
        where: {
          id: contact.linkedId[0].id,
        },
        select: baseSelect,
      });
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
