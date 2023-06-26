import { CreateMenuUseCase } from "../create-menu";
import { PrismaMenusRepository } from "@/repositories/prisma/menu-repositary-prisma";

export const makeCreateMenuUseCase = (): CreateMenuUseCase => {
  const prismaMenusRepository = new PrismaMenusRepository();

  const createMenuUseCase = new CreateMenuUseCase(
    prismaMenusRepository,
  );

  return createMenuUseCase;
}