import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from "@/app"
import request from 'supertest'

describe('List Clients (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should list clients', async () => {
    const response = await request(app.server)
      .get('/clients/list')
      .send()

    expect(response.status).toBe(200)
  })
})