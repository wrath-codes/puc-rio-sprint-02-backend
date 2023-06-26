import { GetOrderPricing as GetOrderPricingUseCase } from "../get-order-pricing";
import { PrismaOrdersRepository } from "@/repositories/prisma/orders-repository-prisma";

export const makeGetOrderPricingUseCase = (): GetOrderPricingUseCase => {
  const prismaOrdersRepository = new PrismaOrdersRepository();

  const getOrderPricingUseCase = new GetOrderPricingUseCase(
    prismaOrdersRepository
  );

  return getOrderPricingUseCase;
}