import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'

import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL env variable')
  }

  const {
    DATABASE_HOST,
    DATABASE_USER,
    DATABASE_PASS,
    DATABASE_PORT,
    DATABASE_NAME,
  } = process.env

  const url = new URL(
    `postgresql://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
  )

  url.searchParams.set('schema', schema)

  return url.toString()
}
export default <Environment>{
  name: 'prisma',
  async setup() {
    const schema = randomUUID()
    // eslint-disable-next-line no-unused-vars
    const databaseURL = generateDatabaseURL(schema)
    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
