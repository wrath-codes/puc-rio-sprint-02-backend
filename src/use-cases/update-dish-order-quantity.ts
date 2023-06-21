import { DishNotFoundError } from "./errors/dish-not-found";
import { DishOrder } from "@prisma/client";
import { DishOrderNotFoundError } from "./errors/dish-order-not-found";
import { DishOrdersRepository } from "@/repositories/interfaces/dish-orders-repository";
import { DishesRepository } from "@/repositories/interfaces/dishes-repository";
import { OrderNotFoundError } from "./errors/order-not-found";
import { OrdersRepository } from "@/repositories/interfaces/orders-repository";

interface UpdateDishOrderQuantityRequest {
  order_id: string
  dish_id: string
  quantity: number
}

interface UpdateDishOrderQuantityResponse {
  dishOrder: DishOrder
}

export class UpdateDishOrderQuantityUseCase {
  constructor(
    private dishesRepository: DishesRepository,
    private ordersRepository: OrdersRepository,
    private dishOrdersRepository: DishOrdersRepository,
  ) {}

  async execute({
    order_id,
    dish_id,
    quantity,
  }: UpdateDishOrderQuantityRequest): Promise<UpdateDishOrderQuantityResponse> {
    const order = await this.ordersRepository.findById(order_id);
    if (!order) throw new OrderNotFoundError();

    const dish = await this.dishesRepository.findById(dish_id);
    if (!dish) throw new DishNotFoundError();

    const dishOrder = await this.dishOrdersRepository.findByOrderIdAndDishId(order_id, dish_id);
    if (!dishOrder) throw new DishOrderNotFoundError();

    const currentQuantity = dishOrder.quantity;

    await this.dishOrdersRepository.update(dishOrder.id, quantity);

    if (currentQuantity > quantity) {
      await this.ordersRepository.subtractTotal(order_id, currentQuantity - quantity);
    } else {
      await this.ordersRepository.addTotal(order_id, quantity - currentQuantity);
    }

    return { dishOrder };
  }
}