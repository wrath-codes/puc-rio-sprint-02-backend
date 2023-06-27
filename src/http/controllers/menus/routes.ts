import { FastifyInstance } from "fastify";
import { addDishToMenu } from "./add-dish-to-menu";
import { createMenu } from "./create-menu";
import { editDish } from "./edit-dish";

export async function menusRoutes(app: FastifyInstance) {
  app.post('/create', createMenu)
  app.post('/dishes/add/:menu_id', addDishToMenu)
  app.put('/dishes/edit/:dish_id', editDish)
}