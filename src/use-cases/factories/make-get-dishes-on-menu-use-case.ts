import { GetDishesOnMenuUseCase } from "../get-dishes-on-menu";
import { PrismaDishesRepository } from "@/repositories/prisma/dishes-repository-prisma";
import { PrismaMenusRepository } from "@/repositories/prisma/menu-repositary-prisma";

export const makeGetDishesOnMenuUseCase = (): GetDishesOnMenuUseCase => {
  const prismaMenusRepository = new PrismaMenusRepository();
  const prismaDishesRepository = new PrismaDishesRepository();

  const getDishesOnMenuUseCase = new GetDishesOnMenuUseCase(
    prismaMenusRepository,
    prismaDishesRepository,
  );

  return getDishesOnMenuUseCase;
}