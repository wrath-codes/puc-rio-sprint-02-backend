import { DishNotFoundError } from "./errors/dish-not-found";
import { DishOrder } from "@prisma/client";
import { DishOrderNotFoundError } from "./errors/dish-order-not-found";
import { DishOrdersRepository } from "@/repositories/interfaces/dish-orders-repository";
import { DishesRepository } from "@/repositories/interfaces/dishes-repository";
import { OrderNotFoundError } from "./errors/order-not-found";
import { OrdersRepository } from "@/repositories/interfaces/orders-repository";
interface RemoveDishOrderRequest {
  order_id: string
  dish_id: string
}

interface RemoveDishOrderResponse {
  dishOrder: DishOrder
}

export class RemoveDishOrderUseCase {
  constructor(
    private dishesRepository: DishesRepository,
    private ordersRepository: OrdersRepository,
    private dishOrdersRepository: DishOrdersRepository,
  ) {}

  async execute({
    order_id,
    dish_id,
  }: RemoveDishOrderRequest): Promise<RemoveDishOrderResponse> {
    const order = await this.ordersRepository.findById(order_id);
    if (!order) throw new OrderNotFoundError();

    const dish = await this.dishesRepository.findById(dish_id);
    if (!dish) throw new DishNotFoundError();

    const dishOrder = await this.dishOrdersRepository.findByOrderIdAndDishId(order_id, dish_id);
    if (!dishOrder) throw new DishOrderNotFoundError();

    await this.dishOrdersRepository.delete(dishOrder.id);

    await this.ordersRepository.subtractTotal(order_id, dishOrder.quantity);

    return { dishOrder };
  }
}

