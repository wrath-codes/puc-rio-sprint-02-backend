import { AddDishToMenuUseCase } from "../add-dish-to-menu";
import { PrismaDishesRepository } from "@/repositories/prisma/dishes-repository-prisma";
import { PrismaMenusRepository } from "@/repositories/prisma/menu-repositary-prisma";

export const makeAddDishToMenuUseCase = (): AddDishToMenuUseCase => {
  const prismaDishesRepository = new PrismaDishesRepository();
  const prismaMenusRepository = new PrismaMenusRepository();

  const addDishToMenuUseCase = new AddDishToMenuUseCase(
    prismaDishesRepository,
    prismaMenusRepository,
  );

  return addDishToMenuUseCase;
}