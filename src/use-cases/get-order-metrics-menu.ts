import { Client, Dish, DishOrder, Order } from "@prisma/client";

import { ClientsRepository } from "@/repositories/interfaces/clients-repository";
import { DishOrdersRepository } from "@/repositories/interfaces/dish-orders-repository";
import { DishesRepository } from "@/repositories/interfaces/dishes-repository";
import { MenuNotFoundError } from "./errors/menu-not-found";
import { MenusRepository } from "@/repositories/interfaces/menus-repository";
import { OrdersRepository } from "@/repositories/interfaces/orders-repository";

interface GetOrderMetricsMenuRequest {
  menu_id: string;
}

interface DishWithQuantity extends Dish {
  quantity: number;
}

interface OrderWithDishes extends Order {
  dishes: DishWithQuantity[];
}

interface ClientWithOrders extends Client {
  orders: OrderWithDishes[];
}

interface GetOrderMetricsMenuResponse {
  total_orders: number;
  total_quantity: number;
  orders_by_dish: DishWithQuantity[];
  clients: ClientWithOrders[];
}

export class GetOrderMetricsMenu {
  constructor(
    private dishesRepository: DishesRepository,
    private dishOrdersRepository: DishOrdersRepository,
    private menusRepository: MenusRepository,
    private ordersRepository: OrdersRepository,
    private clientsRepository: ClientsRepository

  ) {}

  async execute(
    { menu_id }: GetOrderMetricsMenuRequest
  ): Promise<GetOrderMetricsMenuResponse> {

    const menu = await this.menusRepository.findById(menu_id);
    if (!menu) {
      throw new MenuNotFoundError();
    }

    const dishesInMenu = await this.dishesRepository.findByMenuId(menu_id);

    let allOrderDishes = [] as DishOrder[];

    await Promise.all(
      dishesInMenu.map(async (dish) => {
        const dishOrders = await this.dishOrdersRepository.findByDishId(dish.id);
        allOrderDishes = allOrderDishes.concat(dishOrders);
      })
    );

    const total_quantity = await Promise.all(
      allOrderDishes.map(async (dishOrder) => {
        const quantity = dishOrder.quantity;
        return quantity;
      })
    ).then((quantities) => quantities.reduce((a, b) => a + b, 0));

    let orders_by_dish = [] as DishWithQuantity[];

    await Promise.all(
      dishesInMenu.map(async (dish) => {
        const dishOrders = await this.dishOrdersRepository.findByDishId(dish.id);
        const quantity = await Promise.all(
          dishOrders.map(async (dishOrder) => {
            return dishOrder.quantity;
          })
        ).then((quantities) => quantities.reduce((a, b) => a + b, 0));
        orders_by_dish.push({ ...dish, quantity });
      })
    );

    let total_orders = 0
    let unique_orders = [] as Order[];
    let all_orders = [] as Order[];

    await Promise.all(
      allOrderDishes.map(async (dishOrder) => {
        const order = await this.ordersRepository.findById(dishOrder.order_id);
        if (!order) return;
        all_orders.push(order);
      })
    );

    all_orders.forEach((order) => {
      if (!unique_orders.find((unique_order) => unique_order.id === order.id)) {
        unique_orders.push(order);
      }
    });

    total_orders = unique_orders.length;

    let clients = [] as ClientWithOrders[];
    let clients_with_orders = [] as ClientWithOrders[];
    let orders_with_dishes = [] as OrderWithDishes[];

    await Promise.all(
      unique_orders.map(async (order) => {
        const client = await this.clientsRepository.findById(order.client_id);
        if (!client) return;

        const dishOrders = await this.dishOrdersRepository.findByOrderId(order.id);
        const dishes = await Promise.all(
          dishOrders.map(async (dishOrder) => {
            const dish = await this.dishesRepository.findById(dishOrder.dish_id);
            if (!dish) return;
            return { ...dish, quantity: dishOrder.quantity };
          }
          )) as DishWithQuantity[];
        if (!dishes) return;
        orders_with_dishes.push({ ...order, dishes });

        clients_with_orders.push({ ...client, orders: orders_with_dishes });
      })
    );

    clients = clients_with_orders as ClientWithOrders[];

    return { total_orders, total_quantity, orders_by_dish, clients };
  }
}