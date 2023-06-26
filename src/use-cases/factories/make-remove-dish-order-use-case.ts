import { PrismaDishOrdersRepository } from "@/repositories/prisma/dish-orders-repository-prisma";
import { PrismaDishesRepository } from "@/repositories/prisma/dishes-repository-prisma";
import { PrismaOrdersRepository } from "@/repositories/prisma/orders-repository-prisma";
import { RemoveDishOrderUseCase } from "../remove-dish-order";

export const makeRemoveDishOrderUseCase = (): RemoveDishOrderUseCase => {
  const prismaDishOrdersRepository = new PrismaDishOrdersRepository();
  const prismaDishesRepository = new PrismaDishesRepository();
  const prismaOrdersRepository = new PrismaOrdersRepository();

  const removeDishOrderUseCase = new RemoveDishOrderUseCase(
    prismaDishesRepository,
    prismaOrdersRepository,
    prismaDishOrdersRepository,
  );

  return removeDishOrderUseCase;
}