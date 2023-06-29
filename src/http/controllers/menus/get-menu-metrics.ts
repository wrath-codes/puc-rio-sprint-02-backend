import { FastifyReply, FastifyRequest } from "fastify";

import { MenuNotFoundError } from "@/use-cases/errors/menu-not-found";
import { makeGetOrderMetricsMenuUseCase } from "@/use-cases/factories/make-get-client-order-metrics-menu-use-case";

export async function getMenuMetrics(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  const { menu_id } = request.params as { menu_id: string }

  const getOrderMetricsMenuUseCase = makeGetOrderMetricsMenuUseCase()

  try {
    const metrics = await getOrderMetricsMenuUseCase.execute({
      menu_id,
    })

    return reply.status(200).send({
      message: 'Menu metrics retrieved successfully',
      metrics,
    })
  }
  catch (error) {
    if (error instanceof MenuNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }

    throw error
  }
}