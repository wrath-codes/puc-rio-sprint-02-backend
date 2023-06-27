import { FastifyReply, FastifyRequest } from "fastify";

import { ClientNotFoundError } from "@/use-cases/errors/client-not-found";
import { makeDeleteClientUseCase } from "@/use-cases/factories/make-delete-client-use-case";
import { z } from 'zod';

export async function deleteClient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string }

  try {
    const deleteClientUseCase = makeDeleteClientUseCase()

    await deleteClientUseCase.execute({
      id,
    })

    return reply.status(200).send({
      message: 'Client deleted successfully',
    })
  } catch (error) {
    if (error instanceof ClientNotFoundError) {
      return reply.status(404).send({
        message: 'Client not found',
      })
    }
    throw error
  }
}