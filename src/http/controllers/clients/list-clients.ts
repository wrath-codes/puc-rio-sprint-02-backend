import { FastifyReply, FastifyRequest } from "fastify";

import { makeListClientsUseCase } from "@/use-cases/factories/make-list-clients-use-case";

export async function listClients(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listClientsUseCase = makeListClientsUseCase()

  const { clients } = await listClientsUseCase.execute()

  return reply.status(200).send({
    message: 'Clients retrieved successfully',
    clients,
  })
}