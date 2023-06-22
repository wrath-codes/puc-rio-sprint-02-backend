import { Dish, DishOrder, Order } from "@prisma/client";

import { ClientNotFoundError } from "./errors/client-not-found";
import { ClientsRepository } from "@/repositories/interfaces/clients-repository";
import { DishOrdersRepository } from "@/repositories/interfaces/dish-orders-repository";
import { DishesRepository } from "@/repositories/interfaces/dishes-repository";
import { OrdersRepository } from "@/repositories/interfaces/orders-repository";

interface GetClientOrderHistoryRequest {
  client_id: string;
}

interface DishOrderWithDish extends DishOrder {
  dish: Dish;
}

interface OrderWithDishes extends Order {
  dishes: DishOrderWithDish[];
}

interface GetClientOrderHistoryResponse {
  orders: OrderWithDishes[];
}

export class GetClientOrderHistory {
  constructor(
    private ordersRepository: OrdersRepository,
    private dishesRepository: DishesRepository,
    private dishOrdersRepository: DishOrdersRepository,
    private clientsRepository: ClientsRepository
  ) {}

  async execute({
    client_id,
  }: GetClientOrderHistoryRequest): Promise<GetClientOrderHistoryResponse> {
    const client = await this.clientsRepository.findById(client_id);
    if (!client) {
      throw new ClientNotFoundError();
    }

    const clientOrders = await this.ordersRepository.findByClientId(client_id);

    const ordersWithDishes = await Promise.all(
      clientOrders.map(async (order) => {
        const dishOrders = await this.dishOrdersRepository.findByOrderId(
          order.id
        );
        const dishes = await Promise.all(
          dishOrders.map(async (dishOrder) => {
            const dish = await this.dishesRepository.findById(dishOrder.dish_id);
            return { ...dishOrder, dish };
          })
        );
        return { ...order, dishes: dishes as DishOrderWithDish[] };
      }));


    return { orders: ordersWithDishes };
  }
}