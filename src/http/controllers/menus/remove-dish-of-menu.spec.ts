import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from "@/app"
import dayjs from "dayjs";
import { prisma } from "@/lib/prisma";
import request from 'supertest'

describe('Remove Dish Of Menu (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should remove a dish of a menu', async () => {
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
      .delete(`/menus/dishes/remove/${menu!.id}`)
      .send({
        dish_id: dish!.id,
      })

    expect(response.status).toBe(200)
  })
})