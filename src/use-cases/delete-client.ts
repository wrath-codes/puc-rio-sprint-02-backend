import { Client } from "@prisma/client";
import { ClientNotFoundError } from "./errors/client-not-found";
import { ClientsRepository } from "@/repositories/interfaces/clients-repository";

interface DeleteClientRequest {
  id: string;
}

interface DeleteClientResponse {
  client: Client;
}

export class DeleteClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
  ) {}

  async execute({
    id,
  }: DeleteClientRequest): Promise<DeleteClientResponse> {
    const clientExists = await this.clientsRepository.findById(id);

    if (!clientExists) {
      throw new ClientNotFoundError();
    }

    await this.clientsRepository.delete(id);

    return {
      client: clientExists as Client,
    };
  }
}