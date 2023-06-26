import { EditAddressUseCase } from "../edit-address";
import { PrismaAddressesRepository } from "@/repositories/prisma/addresses-repository-prisma";
import { PrismaClientsRepository } from "@/repositories/prisma/clients-repository-prisma";

export const makeEditAddressUseCase = (): EditAddressUseCase => {
  const prismaAddressesRepository = new PrismaAddressesRepository();
  const prismaClientsRepository = new PrismaClientsRepository();

  const editAddressUseCase = new EditAddressUseCase(
    prismaClientsRepository,
    prismaAddressesRepository
  );

  return editAddressUseCase;
}