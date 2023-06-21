import { DishNotFoundError } from "./errors/dish-not-found";
import { DishOrder } from "@prisma/client";
import { DishOrderAlreadyExistsError } from "./errors/dish-order-already-exists";
import { DishOrdersRepository } from "@/repositories/interfaces/dish-orders-repository";
import { DishesRepository } from "@/repositories/interfaces/dishes-repository";
import { OrderNotFoundError } from "./errors/order-not-found";
import { OrdersRepository } from "@/repositories/interfaces/orders-repository";

interface AddDishOrderRequest {
  order_id: string
  dish_id: string
  quantity: number
}

interface AddDishOrderResponse {
  dishOrder: DishOrder
}

export class AddDishOrderUseCase {
  constructor(
    private dishesRepository: DishesRepository,
    private ordersRepository: OrdersRepository,
    private dishOrdersRepository: DishOrdersRepository,
  ) {}

  async execute({
    order_id,
    dish_id,
    quantity,
  }: AddDishOrderRequest): Promise<AddDishOrderResponse> {
    const order = await this.ordersRepository.findById(order_id);

    if (!order) throw new OrderNotFoundError();

    const dish = await this.dishesRepository.findById(dish_id);

    if (!dish) throw new DishNotFoundError();

    const dishOrderAlreadyExists = await this.dishOrdersRepository.findByOrderIdAndDishId(order_id, dish_id);

    if (dishOrderAlreadyExists) throw new DishOrderAlreadyExistsError();

    const dishOrder = await this.dishOrdersRepository.create({
      order_id,
      dish_id,
      quantity,
    });

    await this.ordersRepository.addTotal(order_id, quantity);

    return { dishOrder };
  }
}