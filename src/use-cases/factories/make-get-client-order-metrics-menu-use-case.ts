import { GetOrderMetricsMenu as GetOrderMetricsMenuUseCase } from "../get-order-metrics-menu";
import { PrismaClientsRepository } from "@/repositories/prisma/clients-repository-prisma";
import { PrismaDishOrdersRepository } from "@/repositories/prisma/dish-orders-repository-prisma";
import { PrismaDishesRepository } from "@/repositories/prisma/dishes-repository-prisma";
import { PrismaMenusRepository } from "@/repositories/prisma/menu-repositary-prisma";
import { PrismaOrdersRepository } from "@/repositories/prisma/orders-repository-prisma";

export const makeGetOrderMetricsMenuUseCase = (): GetOrderMetricsMenuUseCase => {
  const prismaOrdersRepository = new PrismaOrdersRepository();
  const prismaDishesRepository = new PrismaDishesRepository();
  const prismaClientsRepository = new PrismaClientsRepository();
  const prismaDishOrdersRepository = new PrismaDishOrdersRepository();
  const prismaMenusRepository = new PrismaMenusRepository();

  const getOrderMetricsMenuUseCase = new GetOrderMetricsMenuUseCase(
    prismaDishesRepository,
    prismaDishOrdersRepository,
    prismaMenusRepository,
    prismaOrdersRepository,
    prismaClientsRepository,
  );

  return getOrderMetricsMenuUseCase;
}