import DF from "ioredis"
import { env } from "./env"

let client: DF | null = null

const getClient = () => {
  if (!client) {
    client = new DF(env.DRAGONFLY_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
    })
  }
  return client
}

export const cacheClient = {
  users: {
    auth: {
      set: (id: string, value: string, ttl = 60) =>
        getClient().setex(`users:auth:${id}`, ttl, value),
      get: (id: string) => getClient().get(`users:auth:${id}`),
      delete: (id: string) =>
        getClient()
          .del(`users:auth:${id}`)
          .then(() => null),
    },
  },
  images: {
    getByHash: (hash: string) => getClient().get(`studio:hash:${hash}`),
    setByHash: (hash: string, value: string, ttl: number = 60 * 60 * 24 * 7) =>
      getClient().setex(`studio:hash:${hash}`, ttl, value),
  },
}
