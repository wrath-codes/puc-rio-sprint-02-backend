import { GetLatestMenuUseCase } from "../get-latest-menu";
import { PrismaMenusRepository } from "@/repositories/prisma/menu-repositary-prisma";

export const makeGetLatestMenuUseCase = (): GetLatestMenuUseCase => {
  const prismaMenusRepository = new PrismaMenusRepository();

  const getLatestMenuUseCase = new GetLatestMenuUseCase(
    prismaMenusRepository,
  );

  return getLatestMenuUseCase;
}