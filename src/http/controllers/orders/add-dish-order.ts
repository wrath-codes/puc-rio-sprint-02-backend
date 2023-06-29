import { FastifyReply, FastifyRequest } from "fastify";

import { ClientNotFoundError } from "@/use-cases/errors/client-not-found";
import { DishNotFoundError } from "@/use-cases/errors/dish-not-found";
import { makeAddDishOrderUseCase } from "@/use-cases/factories/make-add-dish-order-use-case";
import { z } from 'zod';

export async function addDishOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const addDishOrderBodySchema = z.object({
    dish_order: z.object({
      dish_id: z.string(),
      quantity: z.number(),
    }),
  })

  const { dish_order } = addDishOrderBodySchema.parse(request.body)
  const { order_id } = request.params as { order_id: string }

  const addDishOrderUseCase = makeAddDishOrderUseCase()

  try {
    const { dishOrder } = await addDishOrderUseCase.execute({
      order_id,
      ...dish_order,
    })

    return reply.status(201).send({
      message: 'Dish order created successfully',
      dish_order: dishOrder,
    })
  }
  catch (error) {
    if (error instanceof ClientNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }
    if (error instanceof DishNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }
    throw error
  }
}