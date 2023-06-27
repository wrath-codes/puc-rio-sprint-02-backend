import { FastifyInstance } from "fastify";
import { createClient } from "./create-client";
import { deleteClient } from "./delete-client";
import { editClient } from "./edit-client";
import { getClientInfo } from "./get-client-info";

export async function clientsRoutes(app: FastifyInstance) {
  app.post('/create', createClient)
  app.put('/edit/:id', editClient)
  app.delete('/delete/:id', deleteClient)
  app.get('/info/:id', getClientInfo)
}