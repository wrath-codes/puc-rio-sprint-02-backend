import { Client } from "@prisma/client";
import { ClientsRepository } from "@/repositories/interfaces/clients-repository";

interface ListClientsResponse {
  clients: Client[];
}

export class ListClientsUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
  ) {}

  async execute(): Promise<ListClientsResponse> {
    const clients = await this.clientsRepository.list();

    return {
      clients,
    };
  }
}
