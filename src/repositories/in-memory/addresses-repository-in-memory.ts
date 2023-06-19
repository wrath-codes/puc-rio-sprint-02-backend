import { Address, Prisma } from '@prisma/client';

import { AddressesRepository } from '../interfaces/addresses-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryAddressesRepository implements AddressesRepository {
  private addresses: Address[] = [];

  async create(data: Prisma.AddressUncheckedCreateInput): Promise<Address> {
    const address = {
      id: data.id || randomUUID(),
      street: data.street,
      number: data.number,
      complement: data.complement,
      district: data.district,
      city: data.city,
      zipcode: data.zipcode,
      client_id: data.client_id,
    } as Address;

    this.addresses.push(address);

    return address;
  }

  async findById(id: string): Promise<Address | null> {
    const address = this.addresses.find((address) => address.id === id);
    if (!address) return null;
    return address;
  }

  async findByClientId(client_id: string): Promise<Address | null> {
    const address = this.addresses.find((address) => address.client_id === client_id);
    if (!address) return null;
    return address;
  }

  async update(id: string, data: Prisma.AddressUncheckedUpdateInput): Promise<Address | null> {
    const address = this.addresses.find((address) => address.id === id);
    if (!address) return null;

    const updatedAddress = {
      ...address,
      street: data.street || address.street,
      number: data.number || address.number,
      complement: data.complement || address.complement,
      district: data.district || address.district,
      city: data.city || address.city,
      zipcode: data.zipcode || address.zipcode,
    } as Address;

    this.addresses = this.addresses.map((address) => {
      if (address.id === id) return updatedAddress;
      return address;
    });

    return updatedAddress;
  }

  async delete(id: string): Promise<void | null> {
    const address = this.addresses.find((address) => address.id === id);
    if (!address) return null;

    this.addresses = this.addresses.filter((address) => address.id !== id);
  }
}

