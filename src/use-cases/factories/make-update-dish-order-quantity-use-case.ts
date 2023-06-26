import { PrismaDishOrdersRepository } from "@/repositories/prisma/dish-orders-repository-prisma";
import { PrismaDishesRepository } from "@/repositories/prisma/dishes-repository-prisma";
import { PrismaOrdersRepository } from "@/repositories/prisma/orders-repository-prisma";
import { UpdateDishOrderQuantityUseCase } from "../update-dish-order-quantity";

export const makeUpdateDishOrderQuantityUseCase = (): UpdateDishOrderQuantityUseCase => {
  const prismaDishOrdersRepository = new PrismaDishOrdersRepository();
  const prismaDishesRepository = new PrismaDishesRepository();
  const prismaOrdersRepository = new PrismaOrdersRepository();

  const updateDishOrderQuantityUseCase = new UpdateDishOrderQuantityUseCase(
    prismaDishesRepository,
    prismaOrdersRepository,
    prismaDishOrdersRepository,
  );

  return updateDishOrderQuantityUseCase;
}