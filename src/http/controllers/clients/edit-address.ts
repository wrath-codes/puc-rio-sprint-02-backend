import { FastifyReply, FastifyRequest } from "fastify";

import { ClienWithNoAddressError } from "@/use-cases/errors/client-with-no-address";
import { ClientNotFoundError } from "@/use-cases/errors/client-not-found";
import { makeEditAddressUseCase } from "@/use-cases/factories/make-edit-address-use-case";
import { z } from 'zod';

export async function editAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const editAddressBodySchema = z.object({
    address: z.object({
      street: z.string().min(3).max(255).optional(),
      number: z.string().min(1).max(10).optional(),
      complement: z.string().min(1).max(255).optional(),
      district: z.string().min(3).max(255).optional(),
      city: z.string().min(3).max(255).optional(),
      zipcode: z.string().min(8).max(8).optional(),
    }),
  })

  const { client_id } = request.params as { client_id: string }
  const { address } = editAddressBodySchema.parse(request.body)

  try {
    const editAddressUseCase = makeEditAddressUseCase()

    const { address: updatedAddress } = await editAddressUseCase.execute({
      client_id,
      address,
    })

    return reply.status(200).send({
      message: 'Address updated successfully',
      address: updatedAddress,
    })
  }
  catch (error) {
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