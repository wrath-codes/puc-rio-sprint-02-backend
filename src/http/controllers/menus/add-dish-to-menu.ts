import { FastifyReply, FastifyRequest } from "fastify";

import { MenuHasFiveItemsError } from "@/use-cases/errors/menu-has-five-items";
import { MenuNotFoundError } from "@/use-cases/errors/menu-not-found";
import { makeAddDishToMenuUseCase } from "@/use-cases/factories/make-add-dish-to-menu-use-case";
import { z } from "zod";

export async function addDishToMenu(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const addDishToMenuBodySchema = z.object({
    dish: z.object({
      title: z.string().min(3).max(255),
      description: z.string().min(3).max(255),
      kind: z.enum(['MEAT', 'CHICKEN', 'VEGETARIAN']),
    }),
  });

  const { dish } = addDishToMenuBodySchema.parse(request.body);

  const { menu_id } = request.params as { menu_id: string };

  try {
    const addDishToMenuUseCase = makeAddDishToMenuUseCase();

    const { dish: createdDish } = await addDishToMenuUseCase.execute({
      menu_id,
      dish,
    });

    return reply.status(201).send({
      message: "Dish added to menu successfully",
      dish: createdDish,
    });
  } catch (error) {
    if (error instanceof MenuNotFoundError) {
      return reply.status(404).send({
        message: "Menu not found",
      });
    }

    if (error instanceof MenuHasFiveItemsError) {
      return reply.status(400).send({
        message: "Menu has five items already",
      });
    }

    throw error;
  }
}