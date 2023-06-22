import { Dish, DishOrder, Order } from "@prisma/client";

import { ClientNotFoundError } from "./errors/client-not-found";
import { ClientsRepository } from "@/repositories/interfaces/clients-repository";
import { DishOrdersRepository } from "@/repositories/interfaces/dish-orders-repository";
import { DishesRepository } from "@/repositories/interfaces/dishes-repository";
import { MenuNotFoundError } from "./errors/menu-not-found";
import { OrderNotFoundError } from "./errors/order-not-found";
import { OrdersRepository } from "@/repositories/interfaces/orders-repository";

interface GetClientOrderRequest {
  client_id: string;
  menu_id: string;
}

interface DishOrderWithDish extends DishOrder {
  dish: Dish;
}

interface GetClientOrderResponse {
  order: Order;
  dishes: DishOrderWithDish[];
}

export class GetClientOrder {
  constructor(
    private ordersRepository: OrdersRepository,
    private dishesRepository: DishesRepository,
    private dishOrdersRepository: DishOrdersRepository,
    private clientsRepository: ClientsRepository
  ) {}

  async execute({
    client_id,
    menu_id,
  }: GetClientOrderRequest): Promise<GetClientOrderResponse> {
    const client = await this.clientsRepository.findById(client_id);
    if (!client) {
      throw new ClientNotFoundError();
    }

    const dishesInMenu = await this.dishesRepository.findByMenuId(menu_id);
    if (dishesInMenu.length === 0 || !dishesInMenu) {
      throw new MenuNotFoundError();
    }

    const clientOrders = await this.ordersRepository.findByClientId(client_id);
    if (clientOrders.length === 0 || !clientOrders) {
      throw new OrderNotFoundError();
    }

    let validDishOrders = [] as DishOrder[];
    let allClientsDishOrders = [] as DishOrder[];

    await Promise.all(
      clientOrders.map(async (order) => {
        const dishOrders = await this.dishOrdersRepository.findByOrderId(
          order.id
        );

        return dishOrders;
      })
    ).then((dishOrders) => {
      dishOrders.forEach((dishOrder) => {
        allClientsDishOrders.push(...dishOrder);
      });
    });

    allClientsDishOrders.forEach((dishOrder) => {
      dishesInMenu.forEach((dish) => {
        if (dishOrder.dish_id === dish.id) {
          validDishOrders.push(dishOrder);
        }
      });
    });


    const dishesWithDishData = await Promise.all(
      validDishOrders.map(async (dishOrder) => {
        const dish = await this.dishesRepository.findById(dishOrder.dish_id);

        return {
          ...dishOrder,
          dish: dish!,
        };
      })
    );

    const order = await this.ordersRepository.findById(
      validDishOrders[0].order_id
    );

    return {
      order: order!,
      dishes: dishesWithDishData,
    };
  }
}











