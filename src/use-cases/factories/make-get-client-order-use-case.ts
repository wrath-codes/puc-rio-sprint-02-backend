import { GetClientOrder as GetClientOrderUseCase } from "../get-client-order";
import { PrismaClientsRepository } from "@/repositories/prisma/clients-repository-prisma";
import { PrismaDishOrdersRepository } from "@/repositories/prisma/dish-orders-repository-prisma";
import { PrismaDishesRepository } from "@/repositories/prisma/dishes-repository-prisma";
import { PrismaOrdersRepository } from "@/repositories/prisma/orders-repository-prisma";

export const makeGetClientOrderUseCase = (): GetClientOrderUseCase => {
  const prismaOrdersRepository = new PrismaOrdersRepository();
  const prismaDishesRepository = new PrismaDishesRepository();
  const prismaClientsRepository = new PrismaClientsRepository();
  const prismaDishOrdersRepository = new PrismaDishOrdersRepository();

  const getClientOrderUseCase = new GetClientOrderUseCase(
    prismaOrdersRepository,
    prismaDishesRepository,
    prismaDishOrdersRepository,
    prismaClientsRepository,
  );

  return getClientOrderUseCase;
}