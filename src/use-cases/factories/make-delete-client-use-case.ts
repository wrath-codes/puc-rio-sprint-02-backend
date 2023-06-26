import { DeleteClientUseCase } from "../delete-client";
import { PrismaClientsRepository } from "@/repositories/prisma/clients-repository-prisma";

export const makeDeleteClientUseCase = (): DeleteClientUseCase => {
  const prismaClientsRepository = new PrismaClientsRepository();

  const deleteClientUseCase = new DeleteClientUseCase(
    prismaClientsRepository,
  );

  return deleteClientUseCase;
}