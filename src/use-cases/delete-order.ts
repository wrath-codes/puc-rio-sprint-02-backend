import { DishOrdersRepository } from "@/repositories/interfaces/dish-orders-repository";
import { Order } from "@prisma/client";
import { OrderNotFoundError } from "./errors/order-not-found";
import { OrdersRepository } from "@/repositories/interfaces/orders-repository";

interface DeleteOrderRequest {
  order_id: string;
}

interface DeleteOrderResponse {
  order: Order;
}

export class DeleteOrderUseCase {
  constructor(
    private dishOrdersRepository: DishOrdersRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({ order_id }: DeleteOrderRequest): Promise<DeleteOrderResponse> {
    const order = await this.ordersRepository.findById(order_id);
    if (!order) {
      throw new OrderNotFoundError();
    }


    await this.dishOrdersRepository.deleteAllByOrderId(order_id);
    await this.ordersRepository.delete(order_id);

    return { order };
  }
}