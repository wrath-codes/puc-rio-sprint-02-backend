import { ListClientsUseCase } from "../list-clients";
import { PrismaClientsRepository } from "@/repositories/prisma/clients-repository-prisma";

export const makeListClientsUseCase = (): ListClientsUseCase => {
  const prismaClientsRepository = new PrismaClientsRepository();

  const listClientsUseCase = new ListClientsUseCase(
    prismaClientsRepository
  );

  return listClientsUseCase;
}