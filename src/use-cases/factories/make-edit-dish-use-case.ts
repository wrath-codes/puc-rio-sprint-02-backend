import { EditDishUseCase } from "../edit-dish";
import { PrismaDishesRepository } from "@/repositories/prisma/dishes-repository-prisma";

export const makeEditDishUseCase = (): EditDishUseCase => {
  const prismaDishesRepository = new PrismaDishesRepository();

  const editDishUseCase = new EditDishUseCase(
    prismaDishesRepository
  );

  return editDishUseCase;
}