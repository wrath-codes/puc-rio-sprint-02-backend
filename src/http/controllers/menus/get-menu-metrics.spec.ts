import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from "@/app"
import dayjs from 'dayjs'
import { prisma } from "@/lib/prisma";
import request from 'supertest'

describe('Get Menu Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should get a menu metrics', async () => {
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
      .post('/clients/create')
      .send({
        client: {
          name: 'Jane',
          last_name: 'Doe',
          email: 'janedoe@example.com',
          phone: '11999999993',
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

    const client2 = await prisma.client.findFirst({
      where: {
        email: 'janedoe@example.com',
      },
    })

    await request(app.server)
      .post(`/orders/create/${client2!.id}`)
      .send({
        order: {
          delivery: true,
          note: 'Sem Pimenta',
        },
      })

    const order2 = await prisma.order.findFirst({
      where: {
        note: 'Sem Pimenta',
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
      .post(`/menus/dishes/add/${menu!.id}`)
      .send({
        dish: {
          title: 'Arroz',
          description: 'Arroz branco',
          kind: 'VEGETARIAN',
        },
      })

    const dish2 = await prisma.dish.findFirst({
      where: {
        title: 'Arroz',
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

    await request(app.server)
      .post(`/orders/dishes/add/${order!.id}`)
      .send({
        dish_order: {
          dish_id: dish2!.id,
          quantity: 1,
        }
      })

    await request(app.server)
      .post(`/orders/dishes/add/${order2!.id}`)
      .send({
        dish_order: {
          dish_id: dish!.id,
          quantity: 1,
        }
      })

    const response = await request(app.server)
      .get(`/menus/metrics/${menu!.id}`)
      .send()



    expect(response.status).toBe(200)
  })
})