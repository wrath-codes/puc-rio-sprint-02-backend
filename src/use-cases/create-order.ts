import { ClientNotFoundError } from "./errors/client-not-found"
import { ClientsRepository } from "@/repositories/interfaces/clients-repository"
import { Order } from '@prisma/client'
import { OrdersRepository } from '@/repositories/interfaces/orders-repository'

interface CreateOrderRequest {
  client_id: string
  delivery: boolean
  note?: string | null
}

interface CreateOrderResponse {
  order: Order
}

export class CreateOrderUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    client_id,
    delivery,
    note,
  }: CreateOrderRequest): Promise<CreateOrderResponse> {
    const client = await this.clientsRepository.findById(client_id)

    if (!client) {
      throw new ClientNotFoundError()
    }

    const order = await this.ordersRepository.create({
      client_id,
      delivery,
      note,
      total: 0,
    })

    return {
      order,
    }
  }
}