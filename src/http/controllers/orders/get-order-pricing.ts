import { FastifyReply, FastifyRequest } from "fastify";

import { OrderNotFoundError } from "@/use-cases/errors/order-not-found";
import { makeGetOrderPricingUseCase } from "@/use-cases/factories/make-get-order-pricing-use-case";
import { z } from 'zod';

export async function getOrderPricing(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getOrderPricingBodySchema = z.object({
    delivery_rate: z.coerce.number(),
    item_rate: z.coerce.number(),
    combo_rate: z.coerce.number(),
  })
  const { order_id } = request.params as { order_id: string }

  const { delivery_rate, item_rate, combo_rate } = getOrderPricingBodySchema.parse(request.query)


  const getOrderPricingUseCase = makeGetOrderPricingUseCase()


  try {
    const { order_price, delivery_price, total_price } = await getOrderPricingUseCase.execute({
      order_id,
      delivery_price: delivery_rate,
      item_price: item_rate,
      combo_price: combo_rate,
    })

    return reply.status(200).send({
      message: 'Order pricing retrieved successfully',
      order_price,
      delivery_price,
      total_price,
    })
  }
  catch (error) {
    if (error instanceof OrderNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }

    throw error
  }
}