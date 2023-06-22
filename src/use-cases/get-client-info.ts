import { Address, Client } from "@prisma/client";

import { AddressesRepository } from "@/repositories/interfaces/addresses-repository";
import { ClienWithNoAddressError } from "./errors/client-with-no-address";
import { ClientNotFoundError } from "./errors/client-not-found";
import { ClientsRepository } from "@/repositories/interfaces/clients-repository";

interface GetClientInfoRequest {
  id: string;
}

interface GetClientInfoResponse {
  client: Client;
  address: Address;
}

export class GetClientInfoUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({ id }: GetClientInfoRequest): Promise<GetClientInfoResponse> {
    const clientExists = await this.clientsRepository.findById(id);

    if (!clientExists) {
      throw new ClientNotFoundError();
    }

    const address = await this.addressesRepository.findByClientId(id);

    if (!address) {
      throw new ClienWithNoAddressError();
    }

    return {
      client: clientExists,
      address,
    };
  }
}

