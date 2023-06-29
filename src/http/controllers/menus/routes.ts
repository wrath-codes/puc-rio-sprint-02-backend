import { FastifyInstance } from "fastify";
import { addDishToMenu } from "./add-dish-to-menu";
import { createMenu } from "./create-menu";
import { deleteMenu } from "./delete-menu";
import { editDish } from "./edit-dish";
import { getDishesOnMenu } from "./get-dishes-on-menu";
import { getMenuMetrics } from "./get-menu-metrics";
import { removeDishOfMenu } from "./remove-dish-of-menu";

export async function menusRoutes(app: FastifyInstance) {
  app.post('/create', createMenu)
  app.post('/dishes/add/:menu_id', addDishToMenu)
  app.put('/dishes/edit/:dish_id', editDish)
  app.delete('/dishes/remove/:menu_id', removeDishOfMenu)
  app.delete('/delete/:menu_id', deleteMenu)
  app.get('/dishes/list/:menu_id', getDishesOnMenu)
  app.get('/metrics/:menu_id', getMenuMetrics)
}