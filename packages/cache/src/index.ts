import DF from "ioredis"
import { env } from "./env"

const client = new DF(env.DRAGONFLY_URL)

export const cacheClient = {
  users: {
    auth: {
      set: (id: string, value: string, ttl = 60) =>
        client.setex(`users:auth:${id}`, ttl, value),
      get: (id: string) => client.get(`users:auth:${id}`),
      invalidate: (id: string) =>
        client.del(`users:auth:${id}`).then(() => null),
    },
  },
}
