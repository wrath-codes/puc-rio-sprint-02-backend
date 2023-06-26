import { DeleteMenuUseCase } from "../delete-menu";
import { PrismaDishesRepository } from "@/repositories/prisma/dishes-repository-prisma";
import { PrismaMenusRepository } from "@/repositories/prisma/menu-repositary-prisma";

export const makeDeleteMenuUseCase = (): DeleteMenuUseCase => {
  const prismaMenusRepository = new PrismaMenusRepository();
  const prismaDishesRepository = new PrismaDishesRepository();

  const deleteMenuUseCase = new DeleteMenuUseCase(
    prismaMenusRepository,
    prismaDishesRepository
  );

  return deleteMenuUseCase;
}