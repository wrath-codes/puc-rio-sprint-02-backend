import { Client, Prisma } from "@prisma/client";

import { ClientsRepository } from "../interfaces/clients-repository";
import { randomUUID } from "node:crypto";

export class InMemoryClientsRepository implements ClientsRepository {
  private clients: Client[] = [];

  async create(data: Prisma.ClientUncheckedCreateInput): Promise<Client> {
    const client = {
      id: data.id || randomUUID(),
      name: data.name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
    } as Client;

    this.clients.push(client);

    return client;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = this.clients.find((client) => client.email === email);

    if (!client) {
      return null;
    }

    return client;
  }
}