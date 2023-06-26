import { CreateClientUseCase } from "../create-client";
import { PrismaAddressesRepository } from "@/repositories/prisma/addresses-repository-prisma";
import { PrismaClientsRepository } from "@/repositories/prisma/clients-repository-prisma";

export const makeCreateClientUseCase = (): CreateClientUseCase => {
  const prismaAddressesRepository = new PrismaAddressesRepository();
  const prismaClientsRepository = new PrismaClientsRepository();

  const createClientUseCase = new CreateClientUseCase(
    prismaClientsRepository,
    prismaAddressesRepository,
  );

  return createClientUseCase;
};