import { GetClientOrderHistory as GetClientOrderHistoryUseCase } from "../get-client-order-history";
import { PrismaClientsRepository } from "@/repositories/prisma/clients-repository-prisma";
import { PrismaDishOrdersRepository } from "@/repositories/prisma/dish-orders-repository-prisma";
import { PrismaDishesRepository } from "@/repositories/prisma/dishes-repository-prisma";
import { PrismaOrdersRepository } from "@/repositories/prisma/orders-repository-prisma";

export const makeGetClientOrderHistoryUseCase = (): GetClientOrderHistoryUseCase => {
  const prismaOrdersRepository = new PrismaOrdersRepository();
  const prismaDishesRepository = new PrismaDishesRepository();
  const prismaClientsRepository = new PrismaClientsRepository();
  const prismaDishOrdersRepository = new PrismaDishOrdersRepository();

  const getClientOrderHistoryUseCase = new GetClientOrderHistoryUseCase(
    prismaOrdersRepository,
    prismaDishesRepository,
    prismaDishOrdersRepository,
    prismaClientsRepository,
  );

  return getClientOrderHistoryUseCase;
}