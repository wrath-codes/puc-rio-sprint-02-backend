import { FastifyReply, FastifyRequest } from "fastify";

import { ClienWithNoAddressError } from "@/use-cases/errors/client-with-no-address";
import { ClientNotFoundError } from "@/use-cases/errors/client-not-found";
import { makeGetClientInfoUseCase } from "@/use-cases/factories/make-get-client-info-use-case";

export async function getClientInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string }

  try {
    const getClientInfoUseCase = makeGetClientInfoUseCase()

    const { client } = await getClientInfoUseCase.execute({
      id,
    })

    return reply.status(200).send({
      message: 'Client info retrieved successfully',
      client,
    })
  } catch (error) {
    if (error instanceof ClientNotFoundError) {
      return reply.status(404).send({
        message: 'Client not found',
      })
    }
    if (error instanceof ClienWithNoAddressError) {
      return reply.status(404).send({
        message: 'Client has no address',
      })
    }
    throw error
  }
}