import { Order } from "@prisma/client";
import { OrderNotFoundError } from "./errors/order-not-found";
import { OrdersRepository } from "@/repositories/interfaces/orders-repository";

interface GetOrderPricingRequest {
  order_id: string;
  delivery_price: number;
  item_price: number;
  combo_price: number;
}

interface GetOrderPricingResponse {
  order_price: number;
  delivery_price: number;
  total_price: number;
}

export class GetOrderPricing {
  constructor(
    private ordersRepository: OrdersRepository
  ) {}

  async execute({
    order_id,
    delivery_price,
    item_price,
    combo_price,
  }: GetOrderPricingRequest): Promise<GetOrderPricingResponse> {

    const order = await this.ordersRepository.findById(order_id);
    if (!order) {
      throw new OrderNotFoundError();
    }

    let order_price = 0;
    let total_price = 0;
    let combo_amount = 0;
    let rest_amount = 0;

    if (order.delivery) {
      total_price += delivery_price;
    }

    combo_amount = Math.floor(order.total / 5);
    rest_amount = order.total % 5;

    order_price += combo_amount * combo_price;
    order_price += rest_amount * item_price;

    total_price = order_price + delivery_price;

    return {
      order_price,
      delivery_price,
      total_price,
    };
  }
}




