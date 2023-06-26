import { PrismaDishesRepository } from "@/repositories/prisma/dishes-repository-prisma";
import { PrismaMenusRepository } from "@/repositories/prisma/menu-repositary-prisma";
import { RemoveDishOfMenuUseCase } from "../remove-dish-of-menu";

export const makeRemoveDishOfMenuUseCase = (): RemoveDishOfMenuUseCase => {
  const prismaDishesRepository = new PrismaDishesRepository();
  const prismaMenusRepository = new PrismaMenusRepository();

  const removeDishOfMenuUseCase = new RemoveDishOfMenuUseCase(
    prismaDishesRepository,
    prismaMenusRepository,
  );

  return removeDishOfMenuUseCase;
}