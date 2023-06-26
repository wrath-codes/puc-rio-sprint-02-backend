import { GetClientInfoUseCase } from "../get-client-info";
import { PrismaAddressesRepository } from "@/repositories/prisma/addresses-repository-prisma";
import { PrismaClientsRepository } from "@/repositories/prisma/clients-repository-prisma";

export const makeGetClientInfoUseCase = (): GetClientInfoUseCase => {
  const prismaClientsRepository = new PrismaClientsRepository();
  const prismaAddressesRepository = new PrismaAddressesRepository();

  const getClientInfoUseCase = new GetClientInfoUseCase(
    prismaClientsRepository,
    prismaAddressesRepository
  );

  return getClientInfoUseCase;
}