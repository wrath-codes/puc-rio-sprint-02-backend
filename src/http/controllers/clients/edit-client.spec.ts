import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from "@/app"
import { prisma } from "@/lib/prisma";
import request from 'supertest'

describe('Edit Client (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should edit a client', async () => {
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

    const response = await request(app.server)
      .put(`/clients/edit/${client!.id}`)
      .send({
        client: {
          name: 'Jonas',
          last_name: 'Doos',
          email: 'jonasdoos@example.com',
          phone: '11999999998',
        },
      })

    expect(response.status).toBe(200)
  })
})