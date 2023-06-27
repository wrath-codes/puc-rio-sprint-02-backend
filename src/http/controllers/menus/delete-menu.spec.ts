import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from "@/app"
import dayjs from "dayjs";
import { prisma } from "@/lib/prisma";
import request from 'supertest'

describe('Delete Menu (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should delete a menu', async () => {
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

    const response = await request(app.server)
      .delete(`/menus/delete/${menu!.id}`)

    expect(response.status).toBe(200)
  })
})