import { ZodError } from 'zod'
import { clientsRoutes } from "./http/controllers/clients/routes"
import cors from '@fastify/cors'
import { env } from './env'
import fastify from 'fastify'
import { menusRoutes } from "./http/controllers/menus/routes"
import { ordersRoutes } from "./http/controllers/orders/routes"

export const app = fastify()

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(clientsRoutes, { prefix: '/clients' })
app.register(menusRoutes, { prefix: '/menus' })
app.register(ordersRoutes, { prefix: '/orders' })


// Register error handler
app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    console.error(error.issues)
    return reply
      .status(400)
      .send({ message: 'Validation Error!', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Send error to Sentry/Datadog/NewRelic/etc
  }

  return reply.status(500).send({ message: 'Internal Server Error!' })
})