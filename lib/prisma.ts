import { PrismaClient } from '@prisma/client'

// Use globalThis so the code works in different runtimes and avoids
// TypeScript/ESLint issues with the `global` identifier.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client

export default client
