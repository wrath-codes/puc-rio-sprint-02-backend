import { FastifyReply, FastifyRequest } from "fastify";

import { DishNotFoundError } from "@/use-cases/errors/dish-not-found";
import { DishOrderNotFoundError } from "@/use-cases/errors/dish-order-not-found";
import { OrderNotFoundError } from "@/use-cases/errors/order-not-found";
import { makeUpdateDishOrderQuantityUseCase } from "@/use-cases/factories/make-update-dish-order-quantity-use-case";
import { z } from 'zod';

export async function updateDishOrderQuantity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateDishOrderQuantityBodySchema = z.object({
    dish_order: z.object({
      dish_id: z.string(),
      quantity: z.number().int().positive(),
    })
  })

  const { dish_order } = updateDishOrderQuantityBodySchema.parse(request.body)
  const { order_id } = request.params as { order_id: string, dish_id: string }

  const updateDishOrderQuantityUseCase = makeUpdateDishOrderQuantityUseCase()

  try {
    const { dishOrder } = await updateDishOrderQuantityUseCase.execute({
      order_id,
      dish_id: dish_order.dish_id,
      quantity: dish_order.quantity,
    })

    return reply.status(200).send({
      message: 'Dish order quantity updated successfully',
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