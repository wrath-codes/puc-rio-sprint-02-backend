import { CreateOrderUseCase } from "../create-order";
import { PrismaClientsRepository } from "@/repositories/prisma/clients-repository-prisma";
import { PrismaOrdersRepository } from "@/repositories/prisma/orders-repository-prisma";

export const makeCreateOrderUseCase = (): CreateOrderUseCase => {
  const prismaOrdersRepository = new PrismaOrdersRepository();
  const prismaClientsRepository = new PrismaClientsRepository();

  const createOrderUseCase = new CreateOrderUseCase(
    prismaClientsRepository,
    prismaOrdersRepository
  );

  return createOrderUseCase;
}