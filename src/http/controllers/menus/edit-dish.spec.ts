import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from "@/app"
import dayjs from "dayjs";
import { prisma } from "@/lib/prisma";
import request from 'supertest'

describe('Edit Dish (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should edit a dish', async () => {
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

    const response = await request(app.server)
      .put(`/menus/dishes/edit/${dish!.id}`)
      .send({
        dish: {
          title: 'Feijoada Vegetariana',
          description: 'Feijoada completa sem carne',
          kind: 'VEGETARIAN',
        },
      })

    expect(response.status).toBe(200)
  })
})
