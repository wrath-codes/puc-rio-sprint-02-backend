import { FastifyReply, FastifyRequest } from "fastify";

import { ClientNotFoundError } from "@/use-cases/errors/client-not-found";
import { makeEditClientUseCase } from "@/use-cases/factories/make-edit-client-use-case";
import { z } from 'zod';

export async function editClient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const editClientBodySchema = z.object({
    client: z.object({
      name: z.string().min(3).max(255).optional(),
      last_name: z.string().min(3).max(255).optional(),
      email: z.string().email().optional(),
      phone: z.string().min(11).max(11).optional(),
    }),
  })

  const { client } = editClientBodySchema.parse(request.body)

  const { id } = request.params as { id: string }

  try {
    const editClientUseCase = makeEditClientUseCase()

    const { client: updatedClient } = await editClientUseCase.execute({
      id,
      client,
    })

    return reply.status(200).send({
      message: 'Client updated successfully',
      client: updatedClient,
    })
  } catch (error) {
    if (error instanceof ClientNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }
    throw error
  }
}