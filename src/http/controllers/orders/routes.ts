import { FastifyInstance } from "fastify";
import { addDishOrder } from "./add-dish-order";
import { createOrder } from "./create-order";
import { getClientOrder } from "./get-client-order";
import { getClientOrderHistory } from "./get-client-order-history";
import { getOrderPricing } from "./get-order-pricing";
import { removeDishOrder } from "./remove-dish-order";
import { updateDishOrderQuantity } from "./update-dish-order-quantity";

export async function ordersRoutes(app: FastifyInstance) {
  app.post('/create/:client_id', createOrder)
  app.post('/dishes/add/:order_id', addDishOrder)
  app.delete('/dishes/remove/:order_id', removeDishOrder)
  app.put('/dishes/update/:order_id', updateDishOrderQuantity)
  app.get('/get-info/:menu_id/:client_id', getClientOrder)
  app.get('/pricing/:order_id', getOrderPricing)
  app.get('/history/:client_id', getClientOrderHistory)
}