import { Address, Prisma } from "@prisma/client";

import { AddressesRepository } from "../interfaces/addresses-repository";
import { prisma } from "@/lib/prisma";

export class PrismaAddressesRepository implements AddressesRepository {
  async create(data: Prisma.AddressUncheckedCreateInput): Promise<Address> {
    const address = await prisma.address.create({
      data: {
        street: data.street,
        number: data.number,
        complement: data.complement,
        district: data.district,
        city: data.city,
        zipcode: data.zipcode,
        client_id: data.client_id,
      },
    });

    return address;
  }

  async findById(id: string): Promise<Address | null> {
    const address = await prisma.address.findFirst({
      where: {
        id,
      },
    });

    if (!address) return null;

    return address;
  }

  async findByClientId(client_id: string): Promise<Address | null> {
    const address = await prisma.address.findFirst({
      where: {
        client_id,
      },
    });

    if (!address) return null;

    return address;
  }

  async update(id: string, data: Prisma.AddressUncheckedUpdateInput): Promise<Address | null> {
    const address = await prisma.address.update({
      where: {
        id,
      },
      data: {
        street: data.street,
        number: data.number,
        complement: data.complement,
        district: data.district,
        city: data.city,
        zipcode: data.zipcode,
      },
    });

    if (!address) return null;

    return address;
  }

  async delete(id: string): Promise<void | null> {
    const address = await prisma.address.delete({
      where: {
        id,
      },
    });

    if (!address) return null;
  }
}