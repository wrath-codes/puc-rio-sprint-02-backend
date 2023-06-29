import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from "@/app"
import dayjs from 'dayjs'
import { prisma } from "@/lib/prisma";
import request from 'supertest'

describe('Update Dish Order Quantity (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should update the quantity of a dish in an order', async () => {
    await request(app.server)
      .post('/clients/create')
      .send({
        client: {
          name: 'John',
          last_name: 'Doe',
          email: 'johndoe@example.com',
          phone: '11999999999',
        },
        address: {
          street: 'Rua dos Bobos',
          number: '0',
          complement: 'Apto 123',
          district: 'Castanheira',
          city: 'São Paulo',
          zipcode: '12345678',
        }
      })

    const client = await prisma.client.findFirst({
      where: {
        email: 'johndoe@example.com',
      },
    })

    await request(app.server)
      .post(`/orders/create/${client!.id}`)
      .send({
        order: {
          delivery: true,
          note: 'Sem cebola',
        },
      })

    const order = await prisma.order.findFirst({
      where: {
        note: 'Sem cebola',
      },
    })

    await request(app.server)
      .post('/menus/create')
      .send({
        menu: {
          created_at: '2021-10-10',
        },
      })

    const menu = await prisma.menu.findFirst({
      where: {
        created_at: dayjs('2021-10-10').toDate(),
      },
    })

    await request(app.server)
      .post(`/menus/dishes/add/${menu!.id}`)
      .send({
        dish: {
          title: 'Feijoada',
          description: 'Feijoada completa',
          kind: 'MEAT',
        },
      })


    const dish = await prisma.dish.findFirst({
      where: {
        title: 'Feijoada',
      },
    })

    await request(app.server)
      .post(`/orders/dishes/add/${order!.id}`)
      .send({
        dish_order: {
          dish_id: dish!.id,
          quantity: 2,
        }
      })

    const response = await request(app.server)
      .put(`/orders/dishes/update/${order!.id}`)
      .send({
        dish_order: {
          dish_id: dish!.id,
          quantity: 3,
        }
      })

    expect(response.status).toBe(200)
  })
})

