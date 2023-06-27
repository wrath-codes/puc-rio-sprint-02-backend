import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from "@/app"
import request from 'supertest'

describe('Create Menu (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should create a menu', async () => {
    const response = await request(app.server)
      .post('/menus/create')
      .send({
        menu: {
          created_at: '2021-10-10',
        },
      })

    expect(response.status).toBe(201)
  })
})