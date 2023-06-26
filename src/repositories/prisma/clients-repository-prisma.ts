import { Client, Prisma } from "@prisma/client";

import { ClientsRepository } from "../interfaces/clients-repository";
import { prisma } from "@/lib/prisma";

export class PrismaClientsRepository implements ClientsRepository {
  async create(data: Prisma.ClientUncheckedCreateInput): Promise<Client> {
    const client = await prisma.client.create({
      data: {
        name: data.name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
      },
    });

    return client;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await prisma.client.findFirst({
      where: {
        email,
      },
    });

    if (!client) return null;

    return client;
  }

  async findById(id: string): Promise<Client | null> {
    const client = await prisma.client.findFirst({
      where: {
        id,
      },
    });

    if (!client) return null;

    return client;
  }

  async update(id: string, data: Prisma.ClientUncheckedUpdateInput): Promise<Client | null> {
    const client = await prisma.client.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
      },
    });

    if (!client) return null;

    return client;
  }

  async delete(id: string): Promise<void | null> {
    const client = await prisma.client.delete({
      where: {
        id,
      },
    });

    if (!client) return null;

    return;
  }

  async list(): Promise<Client[]> {
    const clients = await prisma.client.findMany();

    return clients;
  }

}
