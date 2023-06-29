import { FastifyReply, FastifyRequest } from "fastify";

import { DishNotFoundError } from "@/use-cases/errors/dish-not-found";
import { makeEditDishUseCase } from "@/use-cases/factories/make-edit-dish-use-case";
import { z } from 'zod';

export async function editDish(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const editDishBodySchema = z.object({
    dish: z.object({
      title: z.string().min(3).max(255).optional(),
      description: z.string().min(3).max(255).optional(),
      kind: z.enum(['MEAT', 'CHICKEN', 'VEGETARIAN']).optional(),
    }),
  })

  const { dish } = editDishBodySchema.parse(request.body)
  const { dish_id } = request.params as { dish_id: string }

  try {
    const editDishUseCase = makeEditDishUseCase()

    const { dish: updatedDish } = await editDishUseCase.execute({
      dish_id,
      title: dish.title,
      description: dish.description,
      kind: dish.kind,
    })

    return reply.status(200).send({
      message: 'Dish updated successfully',
      dish: updatedDish,
    })
  }
  catch (error) {
    if (error instanceof DishNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }
    throw error
  }
}