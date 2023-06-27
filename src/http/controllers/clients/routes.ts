import { FastifyInstance } from "fastify";
import { createClient } from "./create-client";

export async function clientsRoutes(app: FastifyInstance) {
  app.post('/create', createClient)
}