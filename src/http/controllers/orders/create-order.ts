import { FastifyReply, FastifyRequest } from "fastify";

import { ClientNotFoundError } from "@/use-cases/errors/client-not-found";
import { makeCreateOrderUseCase } from "@/use-cases/factories/make-create-order-use-case";
import { z } from 'zod';

export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createOrderBodySchema = z.object({
    order: z.object({
      delivery: z.boolean(),
      note: z.string().optional(),
    }),
  })

  const { order } = createOrderBodySchema.parse(request.body)
  const { client_id } = request.params as { client_id: string }

  const createOrderUseCase = makeCreateOrderUseCase()

  try {
    const { order: createdOrder } = await createOrderUseCase.execute({
      client_id,
      ...order,
    })

    return reply.status(201).send({
      message: 'Order created successfully',
      order: createdOrder,
    })
  }
  catch (error) {
    if (error instanceof ClientNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }
    throw error
  }
}
