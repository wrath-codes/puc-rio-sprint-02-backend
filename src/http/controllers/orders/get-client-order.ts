import { FastifyReply, FastifyRequest } from "fastify";

import { ClientNotFoundError } from "@/use-cases/errors/client-not-found";
import { MenuNotFoundError } from "@/use-cases/errors/menu-not-found";
import { OrderNotFoundError } from "@/use-cases/errors/order-not-found";
import { makeGetClientOrderUseCase } from "@/use-cases/factories/make-get-client-order-use-case";

export async function getClientOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  const { menu_id, client_id } = request.params as { menu_id: string, client_id: string }

  const getClientOrderUseCase = makeGetClientOrderUseCase()

  try {
    const { order, dishes } = await getClientOrderUseCase.execute({
      client_id,
      menu_id,
    })

    return reply.status(200).send({
      message: 'Client order retrieved successfully',
      order,
      dishes,
    })
  }
  catch (error) {
    if (error instanceof ClientNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }
    if (error instanceof MenuNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }
    if (error instanceof OrderNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }

    throw error
  }
}