import { FastifyReply, FastifyRequest } from "fastify";

import { MenuNotFoundError } from "@/use-cases/errors/menu-not-found";
import { makeGetLatestMenuUseCase } from "@/use-cases/factories/make-get-latest-menu-use-case";

export async function getLatestMenu(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  try {
    const getLatestMenuUseCase = makeGetLatestMenuUseCase();

    const { menu } = await getLatestMenuUseCase.execute();

    return reply.status(200).send({
      menu,
    });
  }
  catch (error) {
    if (error instanceof MenuNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    throw error;
  }
}

