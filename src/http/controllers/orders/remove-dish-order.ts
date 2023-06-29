import { FastifyReply, FastifyRequest } from "fastify";

import { DishNotFoundError } from "@/use-cases/errors/dish-not-found";
import { DishOrderNotFoundError } from "@/use-cases/errors/dish-order-not-found";
import { OrderNotFoundError } from "@/use-cases/errors/order-not-found";
import { makeRemoveDishOrderUseCase } from "@/use-cases/factories/make-remove-dish-order-use-case";
import { z } from 'zod';

export async function removeDishOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const removeDishOrderBodySchema = z.object({
    dish_id: z.string(),
  })

  const { dish_id } = removeDishOrderBodySchema.parse(request.body)
  const { order_id } = request.params as { order_id: string }

  const removeDishOrderUseCase = makeRemoveDishOrderUseCase()

  try {
    const { dishOrder } = await removeDishOrderUseCase.execute({
      order_id,
      dish_id,
    })

    return reply.status(200).send({
      message: 'Dish order removed successfully',
      dish_order: dishOrder,
    })
  }
  catch (error) {
    if (error instanceof OrderNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }
    if (error instanceof DishNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }
    if (error instanceof DishOrderNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }

    throw error
  }
}
