import { Order, Prisma } from "@prisma/client";

export interface OrdersRepository {
  create(data: Prisma.OrderUncheckedCreateInput): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByClientId(client_id: string): Promise<Order[]>;
  findByDelivery(delivery: boolean): Promise<Order[]>;
  update(id: string, data: Prisma.OrderUncheckedUpdateInput): Promise<Order | null>;
  delete(id: string): Promise<void | null>;
  addTotal(id: string, quantity: number): Promise<Order | null>;
  subtractTotal(id: string, quantity: number): Promise<Order | null>;
  changeDelivery(id: string): Promise<Order | null>;
}