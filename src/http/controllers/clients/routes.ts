import { FastifyInstance } from "fastify";
import { createClient } from "./create-client";
import { deleteClient } from "./delete-client";
import { editAddress } from "./edit-address";
import { editClient } from "./edit-client";
import { getClientInfo } from "./get-client-info";
import { listClients } from "./list-clients";

export async function clientsRoutes(app: FastifyInstance) {
  app.post('/create', createClient)
  app.put('/edit/:id', editClient)
  app.delete('/delete/:id', deleteClient)
  app.get('/info/:id', getClientInfo)
  app.get('/list', listClients)
  app.put('/edit-address/:client_id', editAddress)
}