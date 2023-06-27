import { FastifyReply, FastifyRequest } from "fastify";

import { MenuNotFoundError } from "@/use-cases/errors/menu-not-found";
import { makeRemoveDishOfMenuUseCase } from "@/use-cases/factories/make-remove-dish-of-menu-use-case";
import { z } from "zod";

export async function removeDishOfMenu(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const removeDishOfMenuBodySchema = z.object({
    dish_id: z.string(),
  });

  const { dish_id } = removeDishOfMenuBodySchema.parse(request.body);
  const { menu_id } = request.params as { menu_id: string };

  try {
    const removeDishOfMenuUseCase = makeRemoveDishOfMenuUseCase();

    await removeDishOfMenuUseCase.execute({
      menu_id,
      dish_id,
    });

    return reply.status(200).send({
      message: "Dish removed from menu successfully",
    });
  }
  catch (error) {
    if (error instanceof MenuNotFoundError) {
      return reply.status(404).send({
        message: "Menu not found",
      });
    }

    throw error;
  }
}