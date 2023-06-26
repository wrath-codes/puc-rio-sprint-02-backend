import { AddDishOrderUseCase } from "../add-dish-order";
import { PrismaDishOrdersRepository } from "@/repositories/prisma/dish-orders-repository-prisma";
import { PrismaDishesRepository } from "@/repositories/prisma/dishes-repository-prisma";
import { PrismaOrdersRepository } from "@/repositories/prisma/orders-repository-prisma";

export const makeAddDishOrderUseCase = (): AddDishOrderUseCase => {
  const prismaDishOrdersRepository = new PrismaDishOrdersRepository();
  const prismaDishesRepository = new PrismaDishesRepository();
  const prismaOrdersRepository = new PrismaOrdersRepository();

  const addDishOrderUseCase = new AddDishOrderUseCase(
    prismaDishesRepository,
    prismaOrdersRepository,
    prismaDishOrdersRepository,
  );

  return addDishOrderUseCase;
}