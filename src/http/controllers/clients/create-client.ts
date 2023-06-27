import { FastifyReply, FastifyRequest } from "fastify";

import { ClientAlreadyExistsError } from "@/use-cases/errors/client-already-exists";
import { makeCreateClientUseCase } from "@/use-cases/factories/make-create-client-use-case";
import { z } from 'zod'

export async function createClient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createClientBodySchema = z.object({
    client: z.object({
      name: z.string().min(3).max(255),
      last_name: z.string().min(3).max(255),
      email: z.string().email(),
      phone: z.string().min(11).max(11),
    }),
    address: z.object({
      street: z.string().min(3).max(255),
      number: z.string().min(1).max(10),
      complement: z.string().min(3).max(255).optional(),
      district: z.string().min(3).max(255),
      city: z.string().min(3).max(255),
      zipcode: z.string().min(8).max(8),
    }),
  })

  const { client, address } = createClientBodySchema.parse(request.body)

  try {
    const createClientUseCase = makeCreateClientUseCase()

    await createClientUseCase.execute({
      client,
      address,
    })
  } catch (error) {
    if (error instanceof ClientAlreadyExistsError) {
      return reply.status(409).send({
        message: 'Client already exists',
      })
    }
    throw error
  }

  return reply.status(201).send({
    message: 'Client created successfully',
    client,
    address,
  })
}