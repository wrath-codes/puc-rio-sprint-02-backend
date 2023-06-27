import { FastifyReply, FastifyRequest } from "fastify";

import { MenuNotFoundError } from "@/use-cases/errors/menu-not-found";
import { makeDeleteMenuUseCase } from "@/use-cases/factories/make-delete-menu-use-case";
import { z } from "zod";

export async function deleteMenu(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { menu_id } = request.params as { menu_id: string };

  try {
    const deleteMenuUseCase = makeDeleteMenuUseCase();

    await deleteMenuUseCase.execute({
      id: menu_id,
    });

    return reply.status(200).send({
      message: "Menu deleted successfully",
    });
  }
  catch (error) {
    if (error instanceof MenuNotFoundError) {
      return reply.status(404).send({
        message: "Menu not found",
      });
    }

    throw error;
  }
}