import { Client, Prisma } from "@prisma/client";

import { ClientsRepository } from "../interfaces/clients-repository";
import { randomUUID } from "node:crypto";

export class InMemoryClientsRepository implements ClientsRepository {
  private clients: Client[] = [];

  async create(data: Prisma.ClientUncheckedCreateInput): Promise<Client> {
    const client = {
      id: data.id || randomUUID(),
      name: data.name,
      lastName: data.lastName,
      email: data.email || undefined,
      phone: data.phone,
    } as Client;

    this.clients.push(client);

    return client;
  }
}