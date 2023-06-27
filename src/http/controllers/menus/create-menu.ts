import { FastifyReply, FastifyRequest } from "fastify";

import { makeCreateMenuUseCase } from "@/use-cases/factories/make-create-menu-use-case";
import { z } from 'zod';

export async function createMenu(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createMenuBodySchema = z.object({
    menu: z.object({
      created_at: z.string().min(10).max(10).optional(),
    }),
  })

  const { menu } = createMenuBodySchema.parse(request.body)

  const createMenuUseCase = makeCreateMenuUseCase()

  const { menu: createdMenu } = await createMenuUseCase.execute({
    menu,
  })

  return reply.status(201).send({
    message: 'Menu created successfully',
    menu: createdMenu,
  })
}