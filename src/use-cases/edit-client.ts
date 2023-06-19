import { Client } from "@prisma/client";
import { ClientNotFoundError } from "./errors/client-not-found";
import { ClientsRepository } from "@/repositories/interfaces/clients-repository";

interface EditClientRequest {
  id: string;
  client: {
    name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }
}

interface EditClientResponse {
  client: Client;
}

export class EditClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
  ) {}

  async execute({
    id,
    client,
  }: EditClientRequest): Promise<EditClientResponse> {
    const clientExists = await this.clientsRepository.findById(id);

    if (!clientExists) {
      throw new ClientNotFoundError();
    }

    const updatedClient = await this.clientsRepository.update(id, client);

    return {
      client: updatedClient as Client,
    };
  }
}