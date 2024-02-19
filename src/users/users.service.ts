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
          select: { email: true, phoneNumber: true, linkedIdRelation: true },
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
  private async checkPush<T>(arr: Array<T>, value: T) {
    if (arr.slice(-1)[0] != value) arr.push(value);
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
    const secondaryIds: Array<number> = [];
    const emails: Array<string> = [];
    const phoneNumbers: Array<string> = [];
    while (contact.linkPrecedence == 'secondary') {
      console.log(contact);
      //lists
      this.checkPush<number>(secondaryIds, contact.id);
      this.checkPush<string>(emails, contact.email);
      this.checkPush<string>(phoneNumbers, contact.phoneNumber);

      contact = await prisma.contact.findFirst({
        where: {
          id: contact.linkedId[0].id,
        },
        select: baseSelect,
      });
    }
    this.checkPush<string>(emails, contact.email);
    this.checkPush<string>(phoneNumbers, contact.phoneNumber);

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
