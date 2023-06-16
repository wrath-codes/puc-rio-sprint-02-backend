import { Address, Prisma } from '@prisma/client';

export interface AddressesRepository {
  create(data: Prisma.AddressUncheckedCreateInput): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  findByClientId(client_id: string): Promise<Address | null>;
  update(id: string, data: Prisma.AddressUncheckedUpdateInput): Promise<Address | null>;
  delete(id: string): Promise<void | null>;
} 