import { FastifyReply, FastifyRequest } from "fastify";

import { ClientNotFoundError } from "@/use-cases/errors/client-not-found";
import { makeGetClientOrderHistoryUseCase } from "@/use-cases/factories/make-get-client-order-history-use-case";

export async function getClientOrderHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  const { client_id } = request.params as { client_id: string }

  const getClientOrderHistoryUseCase = makeGetClientOrderHistoryUseCase()

  try {
    const { orders } = await getClientOrderHistoryUseCase.execute({
      client_id,
    })

    return reply.status(200).send({
      message: 'Client order history retrieved successfully',
      orders,
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