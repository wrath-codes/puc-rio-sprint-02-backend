import { EditClientUseCase } from "../edit-client";
import { PrismaClientsRepository } from "@/repositories/prisma/clients-repository-prisma";

export const makeEditClientUseCase = (): EditClientUseCase => {
  const prismaClientsRepository = new PrismaClientsRepository();

  const editClientUseCase = new EditClientUseCase(
    prismaClientsRepository
  );

  return editClientUseCase;
}