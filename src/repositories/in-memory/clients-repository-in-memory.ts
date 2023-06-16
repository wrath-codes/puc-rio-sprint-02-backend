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
    if (!client) return null;
    return client;
  }

  async findById(id: string): Promise<Client | null> {
    const client = this.clients.find((client) => client.id === id);
    if (!client) return null;
    return client;
  }

  async update(id: string, data: Prisma.ClientUncheckedUpdateInput): Promise<Client> {
    const client = this.clients.find((client) => client.id === id);
    if (!client) return null;

    const updatedClient = {
      ...client,
      name: data.name || client.name,
      last_name: data.last_name || client.last_name,
      email: data.email || client.email,
      phone: data.phone || client.phone,
    } as Client;

    this.clients = this.clients.map((client) => {
      if (client.id === id) return updatedClient;
      return client;
    });

    return updatedClient;
  }
}