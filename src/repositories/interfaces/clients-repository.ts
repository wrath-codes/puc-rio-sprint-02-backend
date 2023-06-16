import { Client, Prisma } from "@prisma/client";

export interface ClientsRepository {
  create(data: Prisma.ClientUncheckedCreateInput): Promise<Client>;
}