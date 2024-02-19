import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
@Injectable()
export class UsersService {
  async add(email: string, phone_number: string) {
    const baseSelect = {
      id: true,
      email: true,
      phone_number: true,
      linked_id: true,
      link_precedence: true,
    };
    let user = await prisma.contact.findFirst({
      where: { email },
      select: { ...baseSelect, created_at: true },
      orderBy: { created_at: 'desc' },
    });
    const userPhone = await prisma.contact.findFirst({
      where: { phone_number },
      include: { linked: true },
      orderBy: { created_at: 'desc' },
    });
    if (!user) {
      if (!userPhone) {
        return await prisma.contact.create({
          data: {
            email: email,
            phone_number: phone_number,
          },
          select: baseSelect,
        });
      }
      user = userPhone;
    } else if (user && userPhone) {
      if (user.created_at < userPhone.created_at) {
        await prisma.contact.update({
          data: {
            link_precedence: 'secondary',
            linked: { connect: { id: user.id } },
          },
          include: { linked: true },
          where: { id: userPhone.id },
        });
        return await this.indentify(userPhone.email, userPhone.phone_number);
      }
      await prisma.contact.update({
        data: {
          link_precedence: 'secondary',
          linked: { connect: { id: userPhone.id } },
        },
        include: { linked: true },
        where: { id: user.id },
      });
      return await this.indentify(user.email, user.phone_number);
    }

    return await prisma.contact.create({
      data: {
        email: email,
        phone_number: phone_number,
        link_precedence: 'secondary',
        linked: { connect: { id: user.id } },
      },
      select: baseSelect,
    });
  }
  private async checkPush<T>(arr: Array<T>, value: T) {
    if (arr.slice(-1)[0] != value) arr.push(value);
  }
  async indentify(email?: string, phone_number?: string) {
    const baseSelect = {
      id: true,
      email: true,
      phone_number: true,
      link_precedence: true,
      linked: { select: { id: true } },
    };
    let contact = await prisma.contact.findFirst({
      where: { email, phone_number },
      select: baseSelect,
    });
    if (!contact) {
      return await this.add(email, phone_number);
    }
    const secondaryIds: Array<number> = [];
    const emails: Array<string> = [];
    const phone_numbers: Array<string> = [];
    while (contact.link_precedence == 'secondary') {
      //lists
      this.checkPush<number>(secondaryIds, contact.id);
      this.checkPush<string>(emails, contact.email);
      this.checkPush<string>(phone_numbers, contact.phone_number);
      contact = await prisma.contact.findFirst({
        where: {
          id: contact.linked.id,
        },
        select: baseSelect,
      });
    }
    this.checkPush<string>(emails, contact.email);
    this.checkPush<string>(phone_numbers, contact.phone_number);

    secondaryIds.reverse();
    emails.reverse();
    phone_numbers.reverse();

    return {
      contact: {
        primaryContatctId: contact.id,
        emails,
        phone_numbers,
        secondaryIds,
      },
    };
  }
  async getAll() {
    return await prisma.contact.findMany({
      select: { id: true, email: true, phone_number: true },
    });
  }
}
