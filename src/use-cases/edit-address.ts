import { Address } from "@prisma/client";
import { AddressesRepository } from "@/repositories/interfaces/addresses-repository";
import { ClienWithNoAddressError } from "./errors/client-with-no-address";
import { ClientNotFoundError } from "./errors/client-not-found";
import { ClientsRepository } from "@/repositories/interfaces/clients-repository";

interface EditAddressRequest {
  client_id: string;
  address: {
    street?: string;
    number?: string;
    complement?: string;
    district?: string;
    city?: string;
    zipcode?: string;
  }
}

interface EditAddressResponse {
  address: Address;
}

export class EditAddressUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    client_id,
    address,
  }: EditAddressRequest): Promise<EditAddressResponse> {
    const clientExists = await this.clientsRepository.findById(client_id);

    if (!clientExists) {
      throw new ClientNotFoundError();
    }

    const clientAddress = await this.addressesRepository.findByClientId(client_id);

    if (!clientAddress) {
      throw new ClienWithNoAddressError();
    }

    const updatedAddress = await this.addressesRepository.update(clientAddress.id, address);

    return {
      address: updatedAddress as Address,
    };
  }
}