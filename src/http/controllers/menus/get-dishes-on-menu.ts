import { FastifyReply, FastifyRequest } from "fastify";

import { MenuNotFoundError } from "@/use-cases/errors/menu-not-found";
import { makeGetDishesOnMenuUseCase } from "@/use-cases/factories/make-get-dishes-on-menu-use-case";
import { z } from "zod";

export async function getDishesOnMenu(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { menu_id } = request.params as { menu_id: string };

  try {
    const getDishesOnMenuUseCase = makeGetDishesOnMenuUseCase();

    const { dishes } = await getDishesOnMenuUseCase.execute({
      menu_id,
    });

    return reply.status(200).send({
      dishes,
    });
  } catch (error) {
    if (error instanceof MenuNotFoundError) {
      return reply.status(404).send({
        message: "Menu not found",
      });
    }

    throw error;
  }
}