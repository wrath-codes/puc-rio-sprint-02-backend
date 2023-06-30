import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from "@/app"
import dayjs from 'dayjs'
import { prisma } from "@/lib/prisma";
import request from 'supertest'

describe('Get Latest Menu (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should get the latest menu', async () => {
    await request(app.server)
      .post('/menus/create')
      .send({
        menu: {
          created_at: '2021-10-10',
        },
      })

    const menu_01 = await prisma.menu.findFirst({
      where: {
        created_at: dayjs('2021-10-10').toDate(),
      },
    })

    await request(app.server)
      .post('/menus/create')
      .send({
        menu: {
          created_at: '2021-10-11',
        },
      })

    const menu_02 = await prisma.menu.findFirst({
      where: {
        created_at: dayjs('2021-10-11').toDate(),
      },
    })

    const response = await request(app.server)
      .get('/menus/latest')
      .send()

    console.log(response.body)

    expect(response.status).toBe(200)
  })
})

