import { Address, Client } from "@prisma/client";

import { AddressesRepository } from "@/repositories/interfaces/addresses-repository";
import { ClientAlreadyExistsError } from "./errors/client-already-exists";
import { ClientsRepository } from "@/repositories/interfaces/clients-repository";

interface CreateClientRequest {
  client: {
    name: string;
    last_name: string;
    email: string;
    phone: string;
  }

  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    zipcode: string;
  }
}

interface CreateClientResponse {
  client: Client;
  address: Address;
}

export class CreateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    client,
    address,
  }: CreateClientRequest): Promise<CreateClientResponse> {
    const clientAlreadyExists = await this.clientsRepository.findByEmail(client.email);

    if (clientAlreadyExists) {
      throw new ClientAlreadyExistsError();
    }

    const createdClient = await this.clientsRepository.create({
      name: client.name,
      last_name: client.last_name,
      email: client.email,
      phone: client.phone,
    });

    const createdAddress = await this.addressesRepository.create({
      street: address.street,
      number: address.number,
      complement: address.complement || undefined,
      city: address.city,
      district: address.district,
      zipcode: address.zipcode,
      client_id: createdClient.id,
    }) as Address;

    return {
      client: createdClient,
      address: createdAddress,
    };
  }
} 